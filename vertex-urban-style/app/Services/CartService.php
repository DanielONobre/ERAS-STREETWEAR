<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CartService
{
    /**
     * Busca ou cria um carrinho para o usuário autenticado ou pela sessão.
     */
    public function getOrCreate(Request $request): Cart
    {
        if ($request->user()) {
            $cart = Cart::firstOrCreate(
                ['user_id' => $request->user()->id],
                ['session_id' => null, 'expires_at' => null]
            );

            // Mescla carrinho de sessão ao logar
            $sessionId = $request->session()->getId();
            $sessionCart = Cart::where('session_id', $sessionId)->where('user_id', null)->first();
            if ($sessionCart) {
                $this->mergeSessionCart($sessionCart, $cart);
                $sessionCart->delete();
            }

            return $cart;
        }

        return Cart::firstOrCreate(
            ['session_id' => $request->session()->getId()],
            ['user_id' => null, 'expires_at' => now()->addDays(30)]
        );
    }

    /**
     * Adiciona ou incrementa um item no carrinho.
     */
    public function addItem(Cart $cart, int $productId, ?int $variantId = null, int $qty = 1): CartItem
    {
        $product = Product::findOrFail($productId);

        if ($variantId) {
            $variant = ProductVariant::findOrFail($variantId);
            abort_unless($variant->isAvailable($qty), 422, 'Estoque insuficiente para esta variante.');
        } else {
            abort_unless($product->isAvailable($qty), 422, 'Produto sem estoque disponível.');
        }

        $existing = $cart->items()
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();

        if ($existing) {
            $existing->increment('quantity', $qty);
            return $existing->fresh();
        }

        return $cart->items()->create([
            'product_id' => $productId,
            'variant_id' => $variantId,
            'quantity'   => $qty,
        ]);
    }

    /**
     * Atualiza a quantidade de um item. Remove se qty = 0.
     */
    public function updateItem(CartItem $item, int $qty): CartItem
    {
        if ($qty <= 0) {
            $this->removeItem($item);
            return $item;
        }

        $item->update(['quantity' => $qty]);
        return $item->fresh();
    }

    /**
     * Remove um item do carrinho.
     */
    public function removeItem(CartItem $item): void
    {
        $item->delete();
    }

    /**
     * Remove todos os itens do carrinho.
     */
    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
    }

    /**
     * Calcula o subtotal do carrinho (soma de line_totals).
     */
    public function getSubtotal(Cart $cart): float
    {
        $cart->load('items.product', 'items.variant');
        return $cart->subtotal;
    }

    /**
     * Valida e aplica um cupom de desconto ao carrinho.
     * Retorna ['success' => bool, 'discount' => float, 'message' => string]
     */
    public function applyCoupon(Cart $cart, string $code): array
    {
        $coupon = Coupon::active()->byCode($code)->first();

        if (!$coupon) {
            return ['success' => false, 'discount' => 0.0, 'message' => 'Cupom inválido ou expirado.'];
        }

        $subtotal = $this->getSubtotal($cart);

        if ($coupon->min_order_value && $subtotal < (float) $coupon->min_order_value) {
            $minFormatted = 'R$ ' . number_format((float) $coupon->min_order_value, 2, ',', '.');
            return [
                'success'  => false,
                'discount' => 0.0,
                'message'  => "Pedido mínimo de {$minFormatted} para este cupom.",
            ];
        }

        $discount = $coupon->getDiscountFor($subtotal);

        return [
            'success'  => true,
            'discount' => $discount,
            'coupon'   => $coupon,
            'message'  => $coupon->type === 'free_shipping'
                ? 'Frete grátis aplicado!'
                : 'Cupom aplicado! Desconto de R$ ' . number_format($discount, 2, ',', '.'),
        ];
    }

    /**
     * Consulta o ViaCEP para validar o CEP e retorna opções de frete simuladas.
     * Retorna array de opções: [['label', 'price', 'days', 'method']]
     */
    public function getShippingOptions(Cart $cart, string $cep): array
    {
        $cep = preg_replace('/\D/', '', $cep);

        if (strlen($cep) !== 8) {
            return ['error' => 'CEP inválido.'];
        }

        // Consulta ViaCEP para validar o CEP
        try {
            $response = Http::timeout(5)->get("https://viacep.com.br/ws/{$cep}/json/");
            if ($response->failed() || ($response->json('erro') === true)) {
                return ['error' => 'CEP não encontrado. Verifique e tente novamente.'];
            }
            $address = $response->json();
        } catch (\Exception $e) {
            return ['error' => 'Não foi possível consultar o CEP. Tente novamente.'];
        }

        // Peso total do carrinho para cálculo de frete
        $cart->load('items.product');
        $totalWeight = $cart->items->sum(fn ($item) =>
            (float) ($item->product->weight ?? 0.3) * $item->quantity
        );

        $subtotal = $this->getSubtotal($cart);

        // Frete grátis para pedidos acima de R$ 299
        $freeShippingThreshold = (float) \App\Models\Setting::get('free_shipping_threshold', 299.00);
        $baseSedex = max(12.90, round($totalWeight * 8.50, 2));
        $basePac   = max(8.90,  round($totalWeight * 5.00, 2));

        $options = [
            [
                'method' => 'pac',
                'label'  => 'PAC (Correios)',
                'price'  => $subtotal >= $freeShippingThreshold ? 0.0 : $basePac,
                'days'   => $this->estimateDays($address['uf'] ?? 'SP', 'pac'),
                'free'   => $subtotal >= $freeShippingThreshold,
            ],
            [
                'method' => 'sedex',
                'label'  => 'SEDEX (Correios)',
                'price'  => $baseSedex,
                'days'   => $this->estimateDays($address['uf'] ?? 'SP', 'sedex'),
                'free'   => false,
            ],
        ];

        return [
            'address' => [
                'city'         => $address['localidade'] ?? '',
                'state'        => $address['uf'] ?? '',
                'neighborhood' => $address['bairro'] ?? '',
            ],
            'options' => $options,
        ];
    }

    /**
     * Monta o array de dados para criação de um pedido a partir do carrinho.
     */
    public function toOrderData(Cart $cart): array
    {
        $cart->load('items.product', 'items.variant.attributeValues');

        return [
            'items' => $cart->items->map(fn (CartItem $item) => [
                'product_id'   => $item->product_id,
                'variant_id'   => $item->variant_id,
                'product_name' => $item->product->name,
                'variant_name' => $item->variant?->display_name,
                'sku'          => $item->variant?->sku ?? $item->product->sku,
                'price'        => $item->unit_price,
                'quantity'     => $item->quantity,
                'total'        => $item->line_total,
            ])->toArray(),
            'subtotal' => $cart->subtotal,
        ];
    }

    /**
     * Mescla um carrinho de sessão guest no carrinho do usuário (após login).
     * Chamado com o session ID capturado ANTES do session()->regenerate().
     */
    public function mergeGuestCart(int $userId, string $sessionId): void
    {
        $guestCart = Cart::where('session_id', $sessionId)->whereNull('user_id')->first();
        if (! $guestCart) {
            return;
        }

        $guestCart->load('items');

        $userCart = Cart::firstOrCreate(['user_id' => $userId]);
        $this->mergeSessionCart($guestCart, $userCart);
        $guestCart->delete();
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private function mergeSessionCart(Cart $sessionCart, Cart $userCart): void
    {
        foreach ($sessionCart->items as $sessionItem) {
            $existing = $userCart->items()
                ->where('product_id', $sessionItem->product_id)
                ->where('variant_id', $sessionItem->variant_id)
                ->first();

            if ($existing) {
                $existing->increment('quantity', $sessionItem->quantity);
            } else {
                $userCart->items()->create([
                    'product_id' => $sessionItem->product_id,
                    'variant_id' => $sessionItem->variant_id,
                    'quantity'   => $sessionItem->quantity,
                ]);
            }
        }
    }

    private function estimateDays(string $state, string $method): int
    {
        // Estimativa simplificada por região
        $southeast = ['SP', 'RJ', 'MG', 'ES'];
        $south     = ['PR', 'SC', 'RS'];

        if ($method === 'sedex') {
            return in_array($state, $southeast) ? 1 : (in_array($state, $south) ? 2 : 3);
        }

        return in_array($state, $southeast) ? 3 : (in_array($state, $south) ? 5 : 8);
    }
}
