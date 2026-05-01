<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartService;
use App\Services\PriceCalculatorService;
use App\Services\ShippingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService            $cartService,
        private readonly PriceCalculatorService $priceCalculator,
        private readonly ShippingService        $shippingService,
    ) {}

    // ─── Inertia Pages ────────────────────────────────────────────────────────

    /**
     * Página completa do carrinho.
     */
    public function index(Request $request): Response
    {
        $cart = $this->cartService->getOrCreate($request);
        $cart->load('items.product.images', 'items.variant.attributeValues.attribute');

        $pricing = $this->priceCalculator->calculate($cart, null, 0.0);

        return Inertia::render('Cart/Index', [
            'cart'    => $this->buildCartPayload($cart),
            'pricing' => $pricing,
        ]);
    }

    // ─── AJAX Endpoints ───────────────────────────────────────────────────────

    /**
     * Adiciona item ao carrinho.
     * Valida estoque via CartService e retorna resumo JSON do carrinho.
     */
    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity'   => 'required|integer|min:1|max:99',
        ]);

        $cart = $this->cartService->getOrCreate($request);

        try {
            $this->cartService->addItem(
                $cart,
                $validated['product_id'],
                $validated['variant_id'] ?? null,
                $validated['quantity']
            );
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $cart->load('items.product.images', 'items.variant.attributeValues.attribute');

        return response()->json([
            'message' => 'Produto adicionado ao carrinho!',
            'cart'    => $this->buildCartPayload($cart),
        ]);
    }

    /**
     * Atualiza a quantidade de um item.
     * Valida estoque disponível antes de incrementar.
     */
    public function update(Request $request, CartItem $item): JsonResponse
    {
        $this->authorizeItem($request, $item);

        $validated = $request->validate(['quantity' => 'required|integer|min:0|max:99']);

        $qty = $validated['quantity'];

        // Validação de estoque antes de persistir
        if ($qty > 0) {
            $item->loadMissing('product', 'variant');

            if ($item->variant_id && $item->variant) {
                if (! $item->variant->isAvailable($qty)) {
                    return response()->json([
                        'message' => 'Estoque insuficiente. Disponível: ' . $item->variant->stock_quantity . ' un.',
                    ], 422);
                }
            } elseif ($item->product) {
                if (! $item->product->isAvailable($qty)) {
                    return response()->json([
                        'message' => 'Estoque insuficiente. Disponível: ' . $item->product->stock_quantity . ' un.',
                    ], 422);
                }
            }
        }

        $this->cartService->updateItem($item, $qty);

        $cart = $this->cartService->getOrCreate($request);
        $cart->load('items.product.images', 'items.variant.attributeValues.attribute');

        return response()->json([
            'message' => $qty === 0 ? 'Item removido.' : 'Quantidade atualizada.',
            'cart'    => $this->buildCartPayload($cart),
        ]);
    }

    /**
     * Remove um item do carrinho.
     */
    public function remove(Request $request, CartItem $item): JsonResponse
    {
        $this->authorizeItem($request, $item);
        $this->cartService->removeItem($item);

        $cart = $this->cartService->getOrCreate($request);
        $cart->load('items.product.images', 'items.variant.attributeValues.attribute');

        return response()->json([
            'message' => 'Item removido do carrinho.',
            'cart'    => $this->buildCartPayload($cart),
        ]);
    }

    /**
     * Aplica cupom e retorna pricing atualizado.
     */
    public function applyCoupon(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string|max:50']);

        $cart   = $this->cartService->getOrCreate($request);
        $result = $this->cartService->applyCoupon($cart, $request->code);

        if (! $result['success']) {
            // Log de tentativa de cupom inválido com IP
            Log::warning('Cupom inválido tentado', [
                'code'    => $request->code,
                'ip'      => $request->ip(),
                'user_id' => auth()->id(),
                'reason'  => $result['message'],
            ]);

            return response()->json(['message' => $result['message']], 422);
        }

        $pricing = $this->priceCalculator->calculate(
            $cart,
            $result['coupon'],
            (float) $request->get('shipping_cost', 0)
        );

        return response()->json([
            'message' => $result['message'],
            'pricing' => $pricing,
        ]);
    }

    /**
     * Remove cupom aplicado e retorna pricing sem desconto.
     */
    public function removeCoupon(Request $request): JsonResponse
    {
        $cart    = $this->cartService->getOrCreate($request);
        $pricing = $this->priceCalculator->calculate(
            $cart,
            null,
            (float) $request->get('shipping_cost', 0)
        );

        return response()->json([
            'message' => 'Cupom removido.',
            'pricing' => $pricing,
        ]);
    }

    /**
     * Calcula opções de frete via ShippingService (ViaCEP + lógica de peso/região).
     */
    public function calculateShipping(Request $request): JsonResponse
    {
        $request->validate(['cep' => 'required|string|min:8|max:9']);

        $cep = preg_replace('/\D/', '', $request->cep);

        $validation = $this->shippingService->validateCep($cep);
        if (! $validation['valid']) {
            return response()->json(['message' => 'CEP inválido ou não encontrado.'], 422);
        }

        $cart    = $this->cartService->getOrCreate($request);
        $cart->load('items.product');
        $options = $this->shippingService->calculate($cep, $cart);

        return response()->json([
            'options'  => $options,
            'address'  => $validation['address'],
        ]);
    }

    /**
     * Retorna dados reduzidos do carrinho para o mini-cart React (navbar).
     * Rota pública — chamada em qualquer página.
     */
    public function mini(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreate($request);
        $cart->load('items.product.images', 'items.variant');

        return response()->json([
            'item_count'         => $cart->item_count,
            'subtotal'           => $cart->subtotal,
            'formatted_subtotal' => 'R$ ' . number_format($cart->subtotal, 2, ',', '.'),
            'items'              => $cart->items->map(fn (CartItem $item) => [
                'id'          => $item->id,
                'quantity'    => $item->quantity,
                'unit_price'  => $item->unit_price,
                'line_total'  => $item->line_total,
                'product' => [
                    'id'            => $item->product->id,
                    'name'          => $item->product->name,
                    'slug'          => $item->product->slug,
                    'primary_image' => $item->product->primary_image,
                ],
                'variant' => $item->variant ? [
                    'id'           => $item->variant->id,
                    'display_name' => $item->variant->display_name,
                ] : null,
            ])->values()->all(),
        ]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function authorizeItem(Request $request, CartItem $item): void
    {
        $cart = $this->cartService->getOrCreate($request);
        abort_if($item->cart_id !== $cart->id, 403);
    }

    private function buildCartPayload(\App\Models\Cart $cart): array
    {
        return [
            'id'                 => $cart->id,
            'is_empty'           => $cart->is_empty,
            'item_count'         => $cart->item_count,
            'subtotal'           => $cart->subtotal,
            'formatted_subtotal' => 'R$ ' . number_format($cart->subtotal, 2, ',', '.'),
            'items'              => $cart->items->map(fn (CartItem $item) => [
                'id'         => $item->id,
                'quantity'   => $item->quantity,
                'unit_price' => $item->unit_price,
                'line_total' => $item->line_total,
                'product'    => [
                    'id'            => $item->product->id,
                    'name'          => $item->product->name,
                    'slug'          => $item->product->slug,
                    'primary_image' => $item->product->primary_image,
                    'in_stock'      => $item->product->in_stock,
                ],
                'variant' => $item->variant ? [
                    'id'           => $item->variant->id,
                    'display_name' => $item->variant->display_name,
                    'in_stock'     => $item->variant->in_stock,
                ] : null,
            ])->values()->all(),
        ];
    }
}
