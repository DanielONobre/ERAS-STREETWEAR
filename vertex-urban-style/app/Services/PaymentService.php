<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function __construct()
    {
        if (config('services.stripe.secret')) {
            \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
        }
    }

    // ─── Stripe Credit Card ───────────────────────────────────────────────────

    /**
     * Cria um PaymentIntent para cartão de crédito.
     *
     * @return array{client_secret: string, payment_intent_id: string}
     */
    public function createPaymentIntent(Order $order): array
    {
        if (! config('services.stripe.secret')) {
            // Modo simulado — retorna dados fictícios para desenvolvimento
            return [
                'client_secret'     => 'pi_simulated_' . $order->id . '_secret_dev',
                'payment_intent_id' => 'pi_simulated_' . $order->id,
            ];
        }

        $intent = \Stripe\PaymentIntent::create([
            'amount'               => (int) ($order->total * 100), // centavos
            'currency'             => 'brl',
            'automatic_payment_methods' => ['enabled' => true],
            'metadata'             => [
                'order_id' => $order->id,
                'user_id'  => $order->user_id,
            ],
        ]);

        return [
            'client_secret'     => $intent->client_secret,
            'payment_intent_id' => $intent->id,
        ];
    }

    /**
     * Confirma um PaymentIntent já criado.
     */
    public function confirmPayment(string $paymentIntentId): bool
    {
        if (! config('services.stripe.secret') || str_starts_with($paymentIntentId, 'pi_simulated_')) {
            return true;
        }

        try {
            $intent = \Stripe\PaymentIntent::retrieve($paymentIntentId);
            return $intent->status === 'succeeded';
        } catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('PaymentService::confirmPayment — ' . $e->getMessage(), [
                'payment_intent_id' => $paymentIntentId,
            ]);
            return false;
        }
    }

    // ─── Pix ─────────────────────────────────────────────────────────────────

    /**
     * Cria uma cobrança Pix.
     *
     * Em produção: integrar com Stripe (payment method type = pix) ou
     * gateway nacional (Gerencianet, Asaas, PagSeguro, etc.).
     * Por ora retorna dados simulados realistas.
     *
     * @return array{qr_code: string, qr_code_url: string, expires_at: string, copy_paste: string}
     */
    public function createPixCharge(Order $order): array
    {
        if (config('services.stripe.secret') && ! str_contains(config('services.stripe.secret'), 'test')) {
            // Placeholder para gateway de produção
            // TODO: integrar com Gerencianet, Asaas ou PagSeguro para Pix real
        }

        $expiresAt = now()->addMinutes(30);
        $pixKey    = '00020126580014BR.GOV.BCB.PIX0136eras-' . str_pad($order->id, 8, '0', STR_PAD_LEFT);
        $payload   = $this->buildPixPayload($order, $expiresAt);

        return [
            'qr_code'     => 'data:image/png;base64,' . base64_encode($this->simulateQrCode($payload)),
            'qr_code_url' => 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' . urlencode($payload),
            'expires_at'  => $expiresAt->toIso8601String(),
            'copy_paste'  => $payload,
        ];
    }

    // ─── Boleto ───────────────────────────────────────────────────────────────

    /**
     * Cria um boleto bancário.
     *
     * Em produção: integrar com Stripe (payment method type = boleto) ou
     * gateway nacional.
     *
     * @return array{line: string, pdf_url: string, barcode: string, due_date: string}
     */
    public function createBoleto(Order $order): array
    {
        if (config('services.stripe.secret') && ! str_contains(config('services.stripe.secret'), 'test')) {
            // TODO: integrar com Stripe Boleto (disponível em prod) ou Asaas/PagSeguro
        }

        $dueDate = now()->addBusinessDays(3);
        $barcode = $this->generateSimulatedBarcode($order);

        return [
            'line'     => $barcode,
            'pdf_url'  => route('account.orders.detail', $order) . '?boleto=1',
            'barcode'  => $barcode,
            'due_date' => $dueDate->format('Y-m-d'),
        ];
    }

    // ─── Webhook ──────────────────────────────────────────────────────────────

    /**
     * Processa eventos de webhook recebidos do Stripe.
     * Deve ser chamado apenas após validação de assinatura no controller.
     */
    public function handleWebhook(Request $request): void
    {
        $payload = $request->getContent();
        $secret  = config('services.stripe.webhook_secret');

        $event = $secret
            ? \Stripe\Webhook::constructEvent(
                $payload,
                $request->header('Stripe-Signature'),
                $secret
            )
            : json_decode($payload);

        $type = is_array($event) ? ($event['type'] ?? '') : $event->type;

        match ($type) {
            'payment_intent.succeeded'       => $this->onPaymentSucceeded($event),
            'payment_intent.payment_failed'  => $this->onPaymentFailed($event),
            'charge.refunded'                => $this->onChargeRefunded($event),
            default                          => null,
        };
    }

    // ─── Refund ───────────────────────────────────────────────────────────────

    /**
     * Solicita reembolso parcial ou total de um pedido.
     *
     * @param float|null $amount Valor em reais; null = reembolso total.
     */
    public function refund(Order $order, ?float $amount = null): bool
    {
        if (! $order->payment_id || str_starts_with($order->payment_id, 'pi_simulated_')) {
            // Modo simulado
            $order->update(['payment_status' => 'refunded', 'status' => 'refunded']);
            return true;
        }

        try {
            $params = ['payment_intent' => $order->payment_id];
            if ($amount !== null) {
                $params['amount'] = (int) ($amount * 100);
            }

            \Stripe\Refund::create($params);

            $order->update(['payment_status' => 'refunded', 'status' => 'refunded']);

            return true;
        } catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('PaymentService::refund — ' . $e->getMessage(), [
                'order_id'         => $order->id,
                'payment_intent'   => $order->payment_id,
                'requested_amount' => $amount,
            ]);
            return false;
        }
    }

    // ─── Webhook Handlers (private) ───────────────────────────────────────────

    private function onPaymentSucceeded(mixed $event): void
    {
        $id    = $this->extractPaymentIntentId($event);
        $order = $id ? Order::where('payment_id', $id)->first() : null;

        if ($order && $order->payment_status !== 'paid') {
            $order->update(['payment_status' => 'paid', 'status' => 'confirmed']);
            Log::info('Pagamento confirmado via webhook.', ['order_id' => $order->id]);
        }
    }

    private function onPaymentFailed(mixed $event): void
    {
        $id    = $this->extractPaymentIntentId($event);
        $order = $id ? Order::where('payment_id', $id)->first() : null;

        if ($order && $order->payment_status === 'pending') {
            $order->update(['payment_status' => 'failed']);
            Log::warning('Pagamento falhou via webhook.', [
                'order_id'         => $order->id,
                'payment_intent_id' => $id,
            ]);
        }
    }

    private function onChargeRefunded(mixed $event): void
    {
        $chargeId = is_array($event)
            ? ($event['data']['object']['id'] ?? null)
            : ($event->data->object->id ?? null);

        if (! $chargeId) return;

        // Localiza o pedido pelo payment_intent dentro da charge
        $intentId = is_array($event)
            ? ($event['data']['object']['payment_intent'] ?? null)
            : ($event->data->object->payment_intent ?? null);

        $order = $intentId ? Order::where('payment_id', $intentId)->first() : null;

        if ($order) {
            $order->update(['payment_status' => 'refunded', 'status' => 'refunded']);
            Log::info('Reembolso processado via webhook.', ['order_id' => $order->id]);
        }
    }

    // ─── Helpers (private) ────────────────────────────────────────────────────

    private function extractPaymentIntentId(mixed $event): ?string
    {
        return is_array($event)
            ? ($event['data']['object']['id'] ?? null)
            : ($event->data->object->id ?? null);
    }

    private function buildPixPayload(Order $order, \Carbon\Carbon $expiresAt): string
    {
        // Payload Pix BR.GOV.BCB simplificado (EMV-like)
        $merchantName = 'ERAS STREETWEAR';
        $city         = 'SAO PAULO';
        $amount       = number_format($order->total, 2, '.', '');

        return sprintf(
            '00020126580014BR.GOV.BCB.PIX01361234567890123456789012345678901234520400005303986540%s5802BR5920%s6009%s62070503***6304ABCD',
            strlen($amount) . $amount,
            str_pad(strtoupper($merchantName), 20, ' '),
            str_pad(strtoupper($city), 9, ' ')
        );
    }

    private function simulateQrCode(string $payload): string
    {
        // Retorna um PNG 1x1 transparente como placeholder
        // Em produção usar: endroid/qr-code ou chillerlan/php-qrcode
        return base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        );
    }

    private function generateSimulatedBarcode(Order $order): string
    {
        // Linha digitável Boleto simulada (formato real: 47 dígitos)
        $bank    = '341'; // Itaú simulado
        $value   = str_pad((int) ($order->total * 100), 10, '0', STR_PAD_LEFT);
        $orderId = str_pad($order->id, 8, '0', STR_PAD_LEFT);

        return "{$bank}9.{$orderId}0 {$orderId}1 {$orderId}2 1 {$value}0000";
    }
}
