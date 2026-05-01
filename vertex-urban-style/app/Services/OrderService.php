<?php

namespace App\Services;

use App\Jobs\GenerateInvoicePdfJob;
use App\Jobs\SendOrderEmailsJob;
use App\Jobs\UpdateProductStockJob;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    public function __construct(
        private readonly CartService            $cartService,
        private readonly PriceCalculatorService $priceCalculator,
        private readonly PaymentService         $paymentService,
    ) {}

    /**
     * Cria um pedido a partir do carrinho e dados do checkout.
     *
     * $data = [
     *   'address_id'    => int,
     *   'payment_method' => 'credit_card'|'pix'|'boleto',
     *   'shipping_method' => 'pac'|'sedex',
     *   'shipping_cost'  => float,
     *   'coupon_code'    => string|null,
     *   'notes'          => string|null,
     * ]
     */
    public function createFromCart(Cart $cart, array $data): Order
    {
        $coupon = isset($data['coupon_code'])
            ? Coupon::active()->byCode($data['coupon_code'])->first()
            : null;

        $orderData = $this->cartService->toOrderData($cart);
        $shippingCost = (float) ($data['shipping_cost'] ?? 0);

        $pricing = $this->priceCalculator->calculate($cart, $coupon, $shippingCost);

        return DB::transaction(function () use ($cart, $data, $coupon, $orderData, $pricing) {

            $order = Order::create([
                'user_id'        => $cart->user_id,
                'address_id'     => $data['address_id'] ?? null,
                'coupon_id'      => $coupon?->id,
                'status'         => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $data['payment_method'] ?? null,
                'subtotal'       => $pricing['subtotal'],
                'discount'       => $pricing['discount'],
                'shipping_cost'  => $pricing['shipping'],
                'total'          => $pricing['total'],
                'shipping_method' => $data['shipping_method'] ?? null,
                'notes'          => $data['notes'] ?? null,
            ]);

            foreach ($orderData['items'] as $item) {
                OrderItem::create(array_merge($item, ['order_id' => $order->id]));

                // Decrementa estoque
                if ($item['variant_id']) {
                    \App\Models\ProductVariant::find($item['variant_id'])
                        ?->decrementStock($item['quantity']);
                } else {
                    \App\Models\Product::find($item['product_id'])
                        ?->decrementStock($item['quantity']);
                }
            }

            // Marca cupom como usado
            $coupon?->markAsUsed();

            // Limpa o carrinho
            $this->cartService->clear($cart);

            return $order->load('items');
        });
    }

    /**
     * Dispara os jobs assíncronos após criação/confirmação do pedido.
     */
    public function dispatchOrderJobs(Order $order): void
    {
        SendOrderEmailsJob::dispatch($order)->onQueue('emails');
        GenerateInvoicePdfJob::dispatch($order)->onQueue('default');
        UpdateProductStockJob::dispatch($order)->onQueue('default');
    }

    /**
     * Atualiza o status de um pedido com validação de transições.
     */
    public function updateStatus(Order $order, string $status): Order
    {
        $validTransitions = [
            'pending'    => ['confirmed', 'cancelled'],
            'confirmed'  => ['processing', 'cancelled'],
            'processing' => ['shipped', 'cancelled'],
            'shipped'    => ['delivered'],
            'delivered'  => ['refunded'],
            'cancelled'  => [],
            'refunded'   => [],
        ];

        $allowed = $validTransitions[$order->status] ?? [];

        abort_unless(in_array($status, $allowed), 422,
            "Transição inválida: {$order->status} → {$status}.");

        $updates = ['status' => $status];

        if ($status === 'shipped') {
            $updates['shipped_at'] = now();
        } elseif ($status === 'delivered') {
            $updates['delivered_at'] = now();
        } elseif ($status === 'confirmed') {
            $updates['payment_status'] = 'paid';
        }

        $order->update($updates);

        return $order->fresh();
    }

    /**
     * Processa o pagamento de um pedido via PaymentService (Stripe + Pix + Boleto).
     *
     * @return array{success: bool, message: string, order: Order, payment_data?: array}
     */
    public function processPayment(Order $order, array $paymentData): array
    {
        try {
            $result = match ($order->payment_method) {
                'pix'    => $this->processPixPayment($order),
                'boleto' => $this->processBoletoPayment($order),
                default  => $this->processCreditCardPayment($order, $paymentData),
            };

            // Dispara jobs assíncronos se o pagamento foi processado (não necessariamente pago — pix/boleto são async)
            $this->dispatchOrderJobs($order);

            return $result;

        } catch (\Exception $e) {
            Log::error('OrderService::processPayment — ' . $e->getMessage(), [
                'order_id'       => $order->id,
                'payment_method' => $order->payment_method,
            ]);

            $order->update(['payment_status' => 'failed']);
            return ['success' => false, 'message' => 'Erro ao processar pagamento.', 'order' => $order];
        }
    }

    // ─── Private Payment Methods ──────────────────────────────────────────────

    private function processCreditCardPayment(Order $order, array $paymentData): array
    {
        // Se veio um payment_intent_id do frontend (Stripe Elements), confirma
        if (! empty($paymentData['payment_intent_id'])) {
            $confirmed = $this->paymentService->confirmPayment($paymentData['payment_intent_id']);

            if ($confirmed) {
                $order->update([
                    'payment_status' => 'paid',
                    'payment_id'     => $paymentData['payment_intent_id'],
                    'status'         => 'confirmed',
                ]);
                return ['success' => true, 'message' => 'Pagamento aprovado!', 'order' => $order->fresh()];
            }

            $order->update(['payment_status' => 'failed']);
            return ['success' => false, 'message' => 'Pagamento recusado. Tente outro cartão.', 'order' => $order];
        }

        // Cria um PaymentIntent novo (fluxo server-side)
        $intent = $this->paymentService->createPaymentIntent($order);
        $order->update(['payment_id' => $intent['payment_intent_id']]);

        return [
            'success'      => true,
            'message'      => 'Aguardando confirmação do pagamento.',
            'order'        => $order,
            'payment_data' => $intent,
        ];
    }

    private function processPixPayment(Order $order): array
    {
        $pix = $this->paymentService->createPixCharge($order);
        $order->update(['payment_id' => 'pix-' . $order->id]);

        return [
            'success'      => true,
            'message'      => 'QR Code Pix gerado. Aguardando pagamento.',
            'order'        => $order,
            'payment_data' => $pix,
        ];
    }

    private function processBoletoPayment(Order $order): array
    {
        $boleto = $this->paymentService->createBoleto($order);
        $order->update(['payment_id' => 'boleto-' . $order->id]);

        return [
            'success'      => true,
            'message'      => 'Boleto gerado. Pague até ' . now()->addBusinessDays(3)->format('d/m/Y') . '.',
            'order'        => $order,
            'payment_data' => $boleto,
        ];
    }

    /**
     * Cancela um pedido (somente se ainda for possível).
     */
    public function cancel(Order $order): Order
    {
        abort_unless($order->canBeCancelled(), 422, 'Este pedido não pode ser cancelado.');

        $order->update(['status' => 'cancelled']);

        // Devolve estoque
        foreach ($order->items as $item) {
            if ($item->variant_id) {
                \App\Models\ProductVariant::find($item->variant_id)
                    ?->increment('stock_quantity', $item->quantity);
            } else {
                \App\Models\Product::find($item->product_id)?->increment('stock_quantity', $item->quantity);
            }
        }

        return $order->fresh();
    }

    /**
     * Gera uma "fatura" em texto simples (PDF real exigiria dompdf/wkhtmltopdf).
     * Retorna o path do arquivo gerado em storage/app/invoices/.
     */
    public function generateInvoice(Order $order): string
    {
        $order->load('items', 'user', 'address');

        $lines   = [];
        $lines[] = "========================================";
        $lines[] = "  ERAS STREETWEAR — PEDIDO #{$order->id}";
        $lines[] = "========================================";
        $lines[] = "Data: " . $order->created_at->format('d/m/Y H:i');
        $lines[] = "Cliente: " . ($order->user?->name ?? 'Visitante');
        $lines[] = "Status: " . $order->status_label;
        $lines[] = "";
        $lines[] = "ITENS:";

        foreach ($order->items as $item) {
            $variant = $item->variant_name ? " ({$item->variant_name})" : '';
            $lines[] = "  - {$item->product_name}{$variant}";
            $lines[] = "    {$item->quantity}x R$ " . number_format($item->price, 2, ',', '.')
                . " = R$ " . number_format($item->total, 2, ',', '.');
        }

        $lines[] = "";
        $lines[] = "Subtotal:  R$ " . number_format($order->subtotal,      2, ',', '.');
        $lines[] = "Desconto:  R$ " . number_format($order->discount,      2, ',', '.');
        $lines[] = "Frete:     R$ " . number_format($order->shipping_cost, 2, ',', '.');
        $lines[] = "TOTAL:     R$ " . number_format($order->total,         2, ',', '.');
        $lines[] = "========================================";

        $content  = implode("\n", $lines);
        $fileName = "invoices/order-{$order->id}.txt";

        \Illuminate\Support\Facades\Storage::disk('local')->put($fileName, $content);

        return storage_path("app/{$fileName}");
    }

}
