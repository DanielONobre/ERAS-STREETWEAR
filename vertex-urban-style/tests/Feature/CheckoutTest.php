<?php

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

// ── Acesso ao checkout ─────────────────────────────────────────────────────────

test('guest é redirecionado para login ao acessar checkout', function () {
    $this->get('/checkout')->assertRedirect('/entrar');
});

test('usuário com carrinho vazio é redirecionado', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->get('/checkout')
         ->assertRedirect(route('cart.index'));
});

test('usuário com carrinho ativo acessa o checkout', function () {
    $user    = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 10]);
    $cart    = Cart::create(['user_id' => $user->id]);
    CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

    $this->actingAs($user)
         ->get('/checkout')
         ->assertOk();
});

// ── Salvar endereço ───────────────────────────────────────────────────────────

test('usuário pode salvar endereço no checkout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/checkout/endereco', [
        'name'         => 'João Silva',
        'phone'        => '(11) 99999-9999',
        'zip_code'     => '01310100',
        'street'       => 'Av. Paulista',
        'number'       => '1000',
        'neighborhood' => 'Bela Vista',
        'city'         => 'São Paulo',
        'state'        => 'SP',
    ]);

    $response->assertOk()
             ->assertJsonStructure(['address']);

    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'city'    => 'São Paulo',
    ]);
});

test('salvar endereço falha sem campos obrigatórios', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->post('/checkout/endereco', [])
         ->assertStatus(422);
});

test('usuário pode reutilizar endereço existente no checkout', function () {
    $user    = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
         ->post('/checkout/endereco', ['address_id' => $address->id])
         ->assertOk()
         ->assertJsonPath('address.id', $address->id);
});

test('usuário não pode usar endereço de outro usuário', function () {
    $user1   = User::factory()->create();
    $user2   = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user2->id]);

    $this->actingAs($user1)
         ->post('/checkout/endereco', ['address_id' => $address->id])
         ->assertStatus(404);
});

// ── Página de sucesso ──────────────────────────────────────────────────────────

test('dono do pedido acessa página de sucesso', function () {
    $user    = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $order   = Order::factory()->create(['user_id' => $user->id, 'address_id' => $address->id]);

    $this->actingAs($user)
         ->get("/checkout/sucesso/{$order->id}")
         ->assertOk();
});

test('outro usuário não acessa página de sucesso de pedido alheio', function () {
    $owner   = User::factory()->create();
    $other   = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $owner->id]);
    $order   = Order::factory()->create(['user_id' => $owner->id, 'address_id' => $address->id]);

    $this->actingAs($other)
         ->get("/checkout/sucesso/{$order->id}")
         ->assertRedirect(route('account.orders'));
});
