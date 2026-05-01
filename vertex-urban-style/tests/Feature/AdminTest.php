<?php

use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

// ── Controle de acesso ────────────────────────────────────────────────────────

test('cliente não acessa o painel admin', function () {
    $customer = makeCustomer();

    $this->actingAs($customer)
         ->get('/admin')
         ->assertForbidden();
});

test('guest é redirecionado do painel admin', function () {
    $this->get('/admin')->assertRedirect('/entrar');
});

test('admin acessa o dashboard', function () {
    $admin = makeAdmin();

    $this->actingAs($admin)
         ->get('/admin')
         ->assertOk();
});

// ── CRUD de Produtos ──────────────────────────────────────────────────────────

test('admin pode listar produtos', function () {
    $admin = makeAdmin();
    Product::factory()->count(3)->create();

    $this->actingAs($admin)
         ->get('/admin/produtos')
         ->assertOk();
});

test('admin pode criar produto', function () {
    $admin    = makeAdmin();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post('/admin/produtos', [
        'name'           => 'Camiseta Nova',
        'category_id'    => $category->id,
        'price'          => 99.90,
        'stock_quantity' => 50,
        'stock_status'   => 'in_stock',
        'is_active'      => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('products', ['name' => 'Camiseta Nova']);
});

test('criação de produto falha sem campos obrigatórios', function () {
    $admin = makeAdmin();

    $this->actingAs($admin)
         ->post('/admin/produtos', [])
         ->assertStatus(422);
});

test('admin pode atualizar status de pedido', function () {
    $admin   = makeAdmin();
    $user    = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $order   = Order::factory()->create([
        'user_id'    => $user->id,
        'address_id' => $address->id,
        'status'     => 'pending',
    ]);

    $this->actingAs($admin)
         ->put("/admin/pedidos/{$order->id}", ['status' => 'confirmed'])
         ->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'id'     => $order->id,
        'status' => 'confirmed',
    ]);
});

test('cliente não pode acessar listagem de pedidos do admin', function () {
    $customer = makeCustomer();

    $this->actingAs($customer)
         ->get('/admin/pedidos')
         ->assertForbidden();
});

test('admin pode acessar listagem de pedidos', function () {
    $admin = makeAdmin();

    $this->actingAs($admin)
         ->get('/admin/pedidos')
         ->assertOk();
});
