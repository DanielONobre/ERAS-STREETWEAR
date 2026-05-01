<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\PaymentService;
use App\Services\PriceCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService            $cartService,
        private readonly OrderService           $orderService,
        private readonly PriceCalculatorService $priceCalculator,
        private readonly PaymentService         $paymentService,
    ) {}

    /**
     * Página de checkout.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $cart = $this->cartService->getOrCreate($request);
        $cart->load('items.product.images', 'items.variant.attributeValues.attribute');

        if ($cart->is_empty) {
            return redirect()->route('cart.index')
                ->with('info', 'Seu carrinho está vazio.');
        }

        $pricing = $this->priceCalculator->calculate($cart, null, 0.0);

        return Inertia::render('Checkout/Index', [
            'cart'      => [
                'item_count'         => $cart->item_count,
                'subtotal'           => $cart->subtotal,
                'formatted_subtotal' => 'R$ ' . number_format($cart->subtotal, 2, ',', '.'),
                'items'              => $cart->items->map(fn ($item) => [
                    'id'         => $item->id,
                    'quantity'   => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                    'product'    => [
                        'name'          => $item->product->name,
                        'primary_image' => $item->product->primary_image,
                    ],
                    'variant' => $item->variant?->display_name,
                ])->values()->all(),
            ],
            'pricing'   => $pricing,
            'addresses' => $request->user()->addresses()->get(),
        ]);
    }

    /**
     * Salva / cria endereço de entrega (AJAX).
     */
    public function saveAddress(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id'   => 'nullable|exists:addresses,id',
            'name'         => 'required_without:address_id|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'zip_code'     => 'required_without:address_id|string|max:10',
            'street'       => 'required_without:address_id|string|max:255',
            'number'       => 'required_without:address_id|string|max:20',
            'complement'   => 'nullable|string|max:100',
            'neighborhood' => 'required_without:address_id|string|max:100',
            'city'         => 'required_without:address_id|string|max:100',
            'state'        => 'required_without:address_id|string|size:2',
        ]);

        if (! empty($validated['address_id'])) {
            $address = Address::where('id', $validated['address_id'])
                ->where('user_id', $request->user()->id)
                ->firstOrFail();
        } else {
            $address = $request->user()->addresses()->create($validated);
        }

        return response()->json([
            'message' => 'Endereço salvo.',
            'address' => $address,
        ]);
    }

    /**
     * Processa o pagamento e cria o pedido.
     */
    public function processPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id'      => 'required|exists:addresses,id',
            'payment_method'  => 'required|in:credit_card,pix,boleto',
            'payment_data'    => 'nullable|array',   // token Stripe, dados do cartão, etc.
            'shipping_method' => 'required|in:pac,sedex',
            'shipping_cost'   => 'required|numeric|min:0',
            'coupon_code'     => 'nullable|string|max:50',
            'notes'           => 'nullable|string|max:500',
        ]);

        // Garante que o endereço pertence ao usuário
        $address = Address::where('id', $validated['address_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cart = $this->cartService->getOrCreate($request);

        if ($cart->is_empty) {
            return response()->json(['message' => 'Carrinho vazio.'], 422);
        }

        try {
            $order  = $this->orderService->createFromCart($cart, $validated);
            $result = $this->orderService->processPayment($order, $validated['payment_data'] ?? []);

            return response()->json([
                'success'   => $result['success'],
                'message'   => $result['message'],
                'order_id'  => $order->id,
                'redirect'  => route('checkout.success', $order),
            ], $result['success'] ? 200 : 422);

        } catch (\Exception $e) {
            Log::error('CheckoutController::processPayment — ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao processar o pedido. Tente novamente.'], 500);
        }
    }

    /**
     * Página de sucesso após pagamento confirmado.
     */
    public function success(Order $order): Response|RedirectResponse
    {
        // Só o dono do pedido pode ver esta página
        if ($order->user_id !== auth()->id()) {
            return redirect()->route('account.orders');
        }

        $order->load('items', 'address');

        return Inertia::render('Checkout/Success', [
            'order' => [
                'id'             => $order->id,
                'status'         => $order->status,
                'status_label'   => $order->status_label,
                'payment_status' => $order->payment_status,
                'formatted_total' => $order->formatted_total,
                'items_count'    => $order->items->count(),
                'created_at'     => $order->created_at->format('d/m/Y H:i'),
                'address'        => $order->address?->full_address,
            ],
        ]);
    }

    /**
     * Webhook do Stripe — verificação de assinatura obrigatória.
     * Esta rota está excluída do CSRF (ver routes/web.php).
     * Delega todo o processamento ao PaymentService::handleWebhook().
     */
    public function stripeWebhook(Request $request): \Illuminate\Http\Response
    {
        $secret = config('services.stripe.webhook_secret');

        // Verifica assinatura antes de qualquer processamento
        if ($secret) {
            try {
                \Stripe\Webhook::constructEvent(
                    $request->getContent(),
                    $request->header('Stripe-Signature'),
                    $secret
                );
            } catch (\Stripe\Exception\SignatureVerificationException $e) {
                Log::warning('Stripe webhook — assinatura inválida: ' . $e->getMessage(), [
                    'ip' => $request->ip(),
                ]);
                return response('Assinatura inválida.', 400);
            } catch (\UnexpectedValueException $e) {
                Log::warning('Stripe webhook — payload inválido: ' . $e->getMessage());
                return response('Payload inválido.', 400);
            }
        }

        try {
            $this->paymentService->handleWebhook($request);
        } catch (\Exception $e) {
            Log::error('Stripe webhook — erro ao processar: ' . $e->getMessage());
            return response('Erro interno.', 500);
        }

        return response('OK', 200);
    }
}
