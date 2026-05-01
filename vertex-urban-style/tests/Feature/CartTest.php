<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;

// ── Adicionar item ─────────────────────────────────────────────────────────────

test('usuário pode adicionar item ao carrinho', function () {
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);

    $this->post('/carrinho/adicionar', [
        'product_id' => $product->id,
        'quantity'   => 1,
    ])->assertOk();

    $this->assertDatabaseHas('cart_items', ['product_id' => $product->id]);
});

test('adicionar produto sem estoque retorna erro 422', function () {
    $product = Product::factory()->outOfStock()->create(['is_active' => true]);

    $this->post('/carrinho/adicionar', [
        'product_id' => $product->id,
        'quantity'   => 1,
    ])->assertStatus(422);
});

test('adicionar o mesmo produto incrementa quantidade', function () {
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 20]);

    $this->post('/carrinho/adicionar', ['product_id' => $product->id, 'quantity' => 1]);
    $this->post('/carrinho/adicionar', ['product_id' => $product->id, 'quantity' => 2]);

    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity'   => 3,
    ]);
});

// ── Atualizar item ────────────────────────────────────────────────────────────

test('usuário pode atualizar quantidade de item no carrinho', function () {
    $user    = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 20]);
    $cart    = Cart::create(['user_id' => $user->id]);
    $item    = CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

    $this->actingAs($user)
         ->put("/carrinho/item/{$item->id}", ['quantity' => 3])
         ->assertOk();

    $this->assertDatabaseHas('cart_items', ['id' => $item->id, 'quantity' => 3]);
});

test('atualizar item com quantidade 0 remove o item', function () {
    $user    = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 20]);
    $cart    = Cart::create(['user_id' => $user->id]);
    $item    = CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 2]);

    $this->actingAs($user)
         ->put("/carrinho/item/{$item->id}", ['quantity' => 0])
         ->assertOk();

    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

// ── Remover item ──────────────────────────────────────────────────────────────

test('usuário pode remover item do carrinho', function () {
    $user    = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    $cart    = Cart::create(['user_id' => $user->id]);
    $item    = CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

    $this->actingAs($user)
         ->delete("/carrinho/item/{$item->id}")
         ->assertOk();

    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

// ── Aplicar cupom ─────────────────────────────────────────────────────────────

test('usuário pode aplicar cupom válido ao carrinho', function () {
    $user    = User::factory()->create();
    $product = Product::factory()->create(['price' => 200.00, 'is_active' => true, 'stock_quantity' => 10]);
    $cart    = Cart::create(['user_id' => $user->id]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);
    $coupon = Coupon::factory()->create(['code' => 'TESTE10', 'type' => 'percentage', 'value' => 10]);

    $response = $this->actingAs($user)
                     ->post('/carrinho/cupom', ['coupon_code' => 'TESTE10']);

    $response->assertOk()
             ->assertJsonPath('success', true);
});

test('cupom inválido retorna erro', function () {
    $user    = User::factory()->create();

    $response = $this->actingAs($user)
                     ->post('/carrinho/cupom', ['coupon_code' => 'INVALIDO99']);

    $response->assertOk()
             ->assertJsonPath('success', false);
});

test('cupom expirado não é aplicado', function () {
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->expired()->create(['code' => 'EXPIRADO']);

    $response = $this->actingAs($user)
                     ->post('/carrinho/cupom', ['coupon_code' => 'EXPIRADO']);

    $response->assertOk()
             ->assertJsonPath('success', false);
});

// ── Calcular frete ────────────────────────────────────────────────────────────

test('cálculo de frete retorna opções para CEP válido', function () {
    $user    = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    $cart    = Cart::create(['user_id' => $user->id]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

    // Mock do HTTP para evitar chamadas externas
    \Illuminate\Support\Facades\Http::fake([
        'viacep.com.br/*' => \Illuminate\Support\Facades\Http::response([
            'localidade' => 'São Paulo',
            'uf'         => 'SP',
            'bairro'     => 'Centro',
        ], 200),
    ]);

    $response = $this->actingAs($user)
                     ->post('/carrinho/frete', ['cep' => '01310100']);

    $response->assertOk()
             ->assertJsonStructure(['options']);
});
