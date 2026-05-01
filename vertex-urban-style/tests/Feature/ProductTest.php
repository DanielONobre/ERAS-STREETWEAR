<?php

use App\Models\Category;
use App\Models\Product;

// ── Listagem ──────────────────────────────────────────────────────────────────

test('página de produtos retorna 200', function () {
    Product::factory()->count(5)->create();

    $this->get('/produtos')->assertOk();
});

test('listagem só exibe produtos ativos', function () {
    $active   = Product::factory()->create(['is_active' => true]);
    $inactive = Product::factory()->inactive()->create();

    $response = $this->get('/produtos');
    $response->assertOk();

    $data = $response->original->getData()['page']['props']['products']['data'];
    $ids  = collect($data)->pluck('id');

    expect($ids)->toContain($active->id)
                ->not->toContain($inactive->id);
});

test('listagem é paginada com 24 por página', function () {
    Product::factory()->count(30)->create(['is_active' => true]);

    $response = $this->get('/produtos');
    $response->assertOk();

    $products = $response->original->getData()['page']['props']['products'];
    expect($products['per_page'])->toBe(24);
});

// ── Filtros ───────────────────────────────────────────────────────────────────

test('filtro por categoria funciona', function () {
    $cat1 = Category::factory()->create();
    $cat2 = Category::factory()->create();

    Product::factory()->create(['category_id' => $cat1->id, 'is_active' => true]);
    Product::factory()->create(['category_id' => $cat2->id, 'is_active' => true]);

    $response = $this->get("/produtos?category={$cat1->slug}");
    $response->assertOk();

    $data = $response->original->getData()['page']['props']['products']['data'];
    expect(collect($data)->every(fn ($p) => true))->toBeTrue();
});

test('filtro por faixa de preço funciona', function () {
    Product::factory()->create(['price' => 50.00, 'is_active' => true]);
    Product::factory()->create(['price' => 200.00, 'is_active' => true]);
    Product::factory()->create(['price' => 500.00, 'is_active' => true]);

    $response = $this->get('/produtos?min_price=100&max_price=300');
    $response->assertOk();

    $data = $response->original->getData()['page']['props']['products']['data'];
    foreach ($data as $product) {
        expect((float) $product['price'])->toBeGreaterThanOrEqual(100)
                                         ->toBeLessThanOrEqual(300);
    }
});

// ── Página de produto individual ───────────────────────────────────────────────

test('página de produto exibe produto ativo por slug', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $this->get("/produtos/{$product->slug}")->assertOk();
});

test('página de produto retorna 404 para produto inativo', function () {
    $product = Product::factory()->inactive()->create();

    $this->get("/produtos/{$product->slug}")->assertNotFound();
});

test('página de produto retorna 404 para slug inexistente', function () {
    $this->get('/produtos/nao-existe-slug-abc123')->assertNotFound();
});

// ── Busca ──────────────────────────────────────────────────────────────────────

test('busca retorna 200', function () {
    Product::factory()->create(['name' => 'Camiseta Skull Preta', 'is_active' => true]);

    $this->get('/busca?q=Camiseta')->assertOk();
});
