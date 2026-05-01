<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;

beforeEach(function () {
    $this->service = app(CartService::class);
});

// ── addItem ───────────────────────────────────────────────────────────────────

test('addItem cria item no carrinho', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);

    $item = $this->service->addItem($cart, $product->id, null, 1);

    expect($item)->toBeInstanceOf(CartItem::class)
                 ->and($item->product_id)->toBe($product->id)
                 ->and($item->quantity)->toBe(1);
});

test('addItem incrementa quantidade se item já existe', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 20]);

    $this->service->addItem($cart, $product->id, null, 2);
    $this->service->addItem($cart, $product->id, null, 3);

    $items = $cart->items()->where('product_id', $product->id)->get();
    expect($items)->toHaveCount(1);
    expect($items->first()->quantity)->toBe(5);
});

test('addItem lança exceção para produto sem estoque', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->outOfStock()->create();

    expect(fn () => $this->service->addItem($cart, $product->id, null, 1))
        ->toThrow(\Symfony\Component\HttpKernel\Exception\HttpException::class);
});

// ── updateItem ────────────────────────────────────────────────────────────────

test('updateItem atualiza quantidade', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 20]);
    $item    = CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

    $updated = $this->service->updateItem($item, 5);

    expect($updated->quantity)->toBe(5);
});

test('updateItem com qty=0 remove o item', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    $item    = CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 2]);

    $this->service->updateItem($item, 0);

    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

// ── removeItem ────────────────────────────────────────────────────────────────

test('removeItem deleta o item', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    $item    = CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

    $this->service->removeItem($item);

    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

// ── clear ─────────────────────────────────────────────────────────────────────

test('clear remove todos os itens do carrinho', function () {
    $cart = Cart::factory()->create();
    $p1   = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    $p2   = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $p1->id, 'quantity' => 1]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $p2->id, 'quantity' => 2]);

    $this->service->clear($cart);

    expect(CartItem::where('cart_id', $cart->id)->count())->toBe(0);
});

// ── applyCoupon ───────────────────────────────────────────────────────────────

test('applyCoupon retorna sucesso para cupom válido com subtotal suficiente', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 200.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);
    $coupon = Coupon::factory()->create(['code' => 'DESCONTO10', 'type' => 'percentage', 'value' => 10]);

    $result = $this->service->applyCoupon($cart, 'DESCONTO10');

    expect($result['success'])->toBeTrue()
                              ->and($result['discount'])->toBe(20.00);
});

test('applyCoupon falha para cupom inexistente', function () {
    $cart = Cart::factory()->create();

    $result = $this->service->applyCoupon($cart, 'NAOEXISTE');

    expect($result['success'])->toBeFalse();
});

test('applyCoupon falha quando subtotal abaixo do mínimo', function () {
    $cart    = Cart::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'is_active' => true, 'stock_quantity' => 10]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);
    $coupon = Coupon::factory()->withMinOrder(200.00)->create(['code' => 'MINIMO']);

    $result = $this->service->applyCoupon($cart, 'MINIMO');

    expect($result['success'])->toBeFalse();
});


