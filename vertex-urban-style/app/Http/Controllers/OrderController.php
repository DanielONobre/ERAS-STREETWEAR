<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\PriceCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly CartService            $cartService,
        private readonly OrderService           $orderService,
        private readonly PriceCalculatorService $priceCalculator,
    ) {
        $this->middleware('auth');
    }

    /**
     * Lista de pedidos do usuário autenticado.
     */
    public function index(): Response
    {
        $orders = auth()->user()
            ->orders()
            ->with('items')
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders->through(fn (Order $order) => [
                'id'               => $order->id,
                'status'           => $order->status,
                'status_label'     => $order->status_label,
                'status_color'     => $order->status_color,
                'payment_status'   => $order->payment_status,
                'formatted_total'  => $order->formatted_total,
                'item_count'       => $order->items->count(),
                'created_at'       => $order->created_at->format('d/m/Y'),
            ]),
        ]);
    }

    /**
     * Detalhe de um pedido.
     */
    public function show(Order $order): Response
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $order->load('items', 'address', 'coupon');

        return Inertia::render('Orders/Show', [
            'order' => array_merge($order->toArray(), [
                'status_label'       => $order->status_label,
                'status_color'       => $order->status_color,
                'payment_status_label' => $order->payment_status_label,
                'formatted_total'    => $order->formatted_total,
                'can_be_cancelled'   => $order->canBeCancelled(),
            ]),
        ]);
    }

    /**
     * Tela de checkout — exibe resumo do carrinho com cálculos de preço.
     */
    public function checkout(Request $request): Response
    {
        $cart = $this->cartService->getOrCreate($request);
        $cart->load('items.product.images', 'items.variant.attributeValues.attribute');

        abort_if($cart->is_empty, 302, route('cart.index'));

        $pricing = $this->priceCalculator->calculate($cart, null, 19.90);

        return Inertia::render('Orders/Checkout', [
            'cart'      => $cart,
            'pricing'   => $pricing,
            'addresses' => auth()->user()->addresses()->get(),
        ]);
    }

    /**
     * Cria o pedido a partir do carrinho.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'address_id'      => 'required|exists:addresses,id',
            'payment_method'  => 'required|in:credit_card,pix,boleto',
            'shipping_method' => 'required|in:pac,sedex',
            'shipping_cost'   => 'required|numeric|min:0',
            'coupon_code'     => 'nullable|string|max:50',
            'notes'           => 'nullable|string|max:500',
        ]);

        $cart = $this->cartService->getOrCreate($request);

        abort_if($cart->is_empty, 422, 'Carrinho vazio.');

        $order = $this->orderService->createFromCart($cart, $validated);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Pedido #' . $order->id . ' criado com sucesso!');
    }

    /**
     * Cancela um pedido.
     */
    public function cancel(Order $order): RedirectResponse
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $this->orderService->cancel($order);

        return back()->with('success', 'Pedido cancelado com sucesso.');
    }

    /**
     * Retorna opções de frete via ViaCEP (AJAX).
     */
    public function shippingOptions(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate(['cep' => 'required|string|min:8|max:9']);

        $cart    = $this->cartService->getOrCreate($request);
        $options = $this->cartService->getShippingOptions($cart, $request->cep);

        return response()->json($options);
    }

    /**
     * Aplica cupom e retorna pricing atualizado (AJAX).
     */
    public function applyCoupon(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate(['code' => 'required|string|max:50']);

        $cart   = $this->cartService->getOrCreate($request);
        $result = $this->cartService->applyCoupon($cart, $request->code);

        if ($result['success']) {
            $pricing = $this->priceCalculator->calculate(
                $cart,
                $result['coupon'],
                (float) $request->get('shipping_cost', 0)
            );
            return response()->json(array_merge($result, ['pricing' => $pricing]));
        }

        return response()->json($result, 422);
    }
}
