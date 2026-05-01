<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Setting;
use App\Services\PriceCalculatorService;

beforeEach(function () {
    $this->service = app(PriceCalculatorService::class);

    // Garante configuração de frete grátis
    Setting::set('free_shipping_threshold', 299.00);
});

// ── calculate — sem cupom ────────────────────────────────────────────────────

test('calcula total sem cupom e sem frete grátis', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 100.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 2]);

    $result = $this->service->calculate($cart, null, 15.90);

    expect($result['subtotal'])->toBe(200.00)
        ->and($result['shipping'])->toBe(15.90)
        ->and($result['discount'])->toBe(0.0)
        ->and($result['total'])->toBe(215.90);
});

test('aplica frete grátis quando subtotal atinge o threshold', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 150.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 2]);

    $result = $this->service->calculate($cart, null, 15.90);

    expect($result['shipping'])->toBe(0.0)
        ->and($result['free_shipping'])->toBeTrue()
        ->and($result['total'])->toBe(300.00);
});

// ── calculate — com cupom percentual ────────────────────────────────────────

test('aplica desconto percentual corretamente', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 200.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);
    $coupon = Coupon::factory()->create(['type' => 'percentage', 'value' => 10.00]);

    $result = $this->service->calculate($cart, $coupon, 15.90);

    expect($result['discount'])->toBe(20.00)
        ->and($result['total'])->toBe(195.90);
});

test('aplica desconto fixo corretamente', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 200.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);
    $coupon = Coupon::factory()->fixed()->create(['value' => 30.00]);

    $result = $this->service->calculate($cart, $coupon, 15.90);

    expect($result['discount'])->toBe(30.00)
        ->and($result['total'])->toBe(185.90);
});

test('cupom de frete grátis zera o shipping', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 100.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);
    $coupon = Coupon::factory()->freeShipping()->create();

    $result = $this->service->calculate($cart, $coupon, 15.90);

    expect($result['shipping'])->toBe(0.0)
        ->and($result['free_shipping'])->toBeTrue()
        ->and($result['discount'])->toBe(0.0);
});

// ── quickTotal ────────────────────────────────────────────────────────────────

test('quickTotal calcula corretamente', function () {
    $total = $this->service->quickTotal(100.00, 15.90, 10.00);

    expect($total)->toBe(105.90);
});

test('quickTotal nunca retorna negativo', function () {
    $total = $this->service->quickTotal(50.00, 0.0, 100.00);

    expect($total)->toBe(0.0);
});
