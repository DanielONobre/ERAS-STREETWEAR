<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Setting;

class PriceCalculatorService
{
    /**
     * Calcula todos os valores monetários de um carrinho para exibição ou criação de pedido.
     *
     * Retorna:
     * [
     *   'subtotal'         => float,   // soma dos itens sem desconto
     *   'discount'         => float,   // desconto do cupom (ou 0)
     *   'shipping'         => float,   // custo do frete (0 se grátis)
     *   'total'            => float,   // subtotal - discount + shipping
     *   'savings_message'  => string,  // mensagem amigável de economia
     *   'free_shipping'    => bool,    // se o frete foi zerado
     *   'coupon_type'      => string|null,
     * ]
     */
    public function calculate(Cart $cart, ?Coupon $coupon, float $shippingCost): array
    {
        $cart->load('items.product', 'items.variant');

        $subtotal = $cart->subtotal;
        $discount = 0.0;
        $freeShipping = false;
        $savingsParts = [];

        // ── Frete grátis por threshold da loja ───────────────────────────────
        $threshold = (float) Setting::get('free_shipping_threshold', 299.00);
        if ($subtotal >= $threshold) {
            if ($shippingCost > 0) {
                $savingsParts[] = 'frete grátis (pedido acima de R$ ' . number_format($threshold, 2, ',', '.') . ')';
            }
            $shippingCost = 0.0;
            $freeShipping = true;
        }

        // ── Cupom ────────────────────────────────────────────────────────────
        $couponType = null;
        if ($coupon && $coupon->isValid()) {
            $couponType = $coupon->type;

            if ($coupon->type === 'free_shipping') {
                if (!$freeShipping && $shippingCost > 0) {
                    $savingsParts[] = 'frete grátis (cupom ' . $coupon->code . ')';
                    $shippingCost = 0.0;
                    $freeShipping = true;
                }
            } else {
                $discount = $coupon->getDiscountFor($subtotal);
                if ($discount > 0) {
                    $savingsParts[] = 'desconto de R$ ' . number_format($discount, 2, ',', '.')
                        . ' (cupom ' . $coupon->code . ')';
                }
            }
        }

        // ── Desconto de comparação (produtos em promoção) ─────────────────────
        $priceDiscount = $cart->items->sum(function ($item) {
            if (!$item->product->is_on_sale) return 0;
            $originalPrice = (float) $item->product->compare_price;
            $currentPrice  = $item->variant?->effective_price ?? (float) $item->product->price;
            return round(($originalPrice - $currentPrice) * $item->quantity, 2);
        });

        if ($priceDiscount > 0) {
            $savingsParts[] = 'R$ ' . number_format($priceDiscount, 2, ',', '.') . ' em promoções';
        }

        $total = max(0.0, round($subtotal - $discount + $shippingCost, 2));

        // ── Mensagem de economia ──────────────────────────────────────────────
        $savingsMessage = '';
        if (!empty($savingsParts)) {
            $savingsMessage = 'Você economizou com ' . implode(' e ', $savingsParts) . '!';
        } elseif ($subtotal > 0) {
            $remaining = $threshold - $subtotal;
            if ($remaining > 0) {
                $savingsMessage = 'Falta R$ ' . number_format($remaining, 2, ',', '.')
                    . ' para ganhar frete grátis!';
            }
        }

        return [
            'subtotal'        => round($subtotal, 2),
            'discount'        => round($discount, 2),
            'shipping'        => round($shippingCost, 2),
            'total'           => $total,
            'savings_message' => $savingsMessage,
            'free_shipping'   => $freeShipping,
            'coupon_type'     => $couponType,
            'price_discount'  => round($priceDiscount, 2),
        ];
    }

    /**
     * Versão simplificada para exibição no navbar/mini-cart (sem carregar relações pesadas).
     */
    public function quickTotal(float $subtotal, float $shippingCost, float $discount = 0.0): float
    {
        return max(0.0, round($subtotal - $discount + $shippingCost, 2));
    }
}
