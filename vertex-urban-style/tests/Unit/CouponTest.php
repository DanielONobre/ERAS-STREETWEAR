<?php

use App\Models\Coupon;

// ── isValid ───────────────────────────────────────────────────────────────────

test('cupom ativo e sem restrições é válido', function () {
    $coupon = Coupon::factory()->create(['is_active' => true]);

    expect($coupon->isValid())->toBeTrue();
});

test('cupom inativo não é válido', function () {
    $coupon = Coupon::factory()->create(['is_active' => false]);

    expect($coupon->isValid())->toBeFalse();
});

test('cupom expirado não é válido', function () {
    $coupon = Coupon::factory()->expired()->create();

    expect($coupon->isValid())->toBeFalse();
});

test('cupom que ainda não começou não é válido', function () {
    $coupon = Coupon::factory()->create([
        'starts_at' => now()->addDay(),
        'is_active' => true,
    ]);

    expect($coupon->isValid())->toBeFalse();
});

test('cupom com usos esgotados não é válido', function () {
    $coupon = Coupon::factory()->exhausted()->create();

    expect($coupon->isValid())->toBeFalse();
});

test('cupom com max_uses=null é ilimitado', function () {
    $coupon = Coupon::factory()->create(['max_uses' => null, 'used_count' => 9999]);

    expect($coupon->isValid())->toBeTrue();
});

// ── getDiscountFor ─────────────────────────────────────────────────────────────

test('calcula desconto percentual sobre subtotal', function () {
    $coupon = Coupon::factory()->create(['type' => 'percentage', 'value' => 15.00]);

    expect($coupon->getDiscountFor(200.00))->toBe(30.00);
});

test('desconto percentual é arredondado para 2 decimais', function () {
    $coupon = Coupon::factory()->create(['type' => 'percentage', 'value' => 10.00]);

    expect($coupon->getDiscountFor(99.99))->toBe(10.00);
});

test('calcula desconto fixo respeitando limite do subtotal', function () {
    $coupon = Coupon::factory()->fixed()->create(['value' => 50.00]);

    // Desconto não pode ser maior que o subtotal
    expect($coupon->getDiscountFor(30.00))->toBe(30.00);
    expect($coupon->getDiscountFor(100.00))->toBe(50.00);
});

test('cupom de frete grátis retorna desconto 0 (frete tratado separadamente)', function () {
    $coupon = Coupon::factory()->freeShipping()->create();

    expect($coupon->getDiscountFor(200.00))->toBe(0.0);
});

test('retorna 0 quando subtotal abaixo do mínimo', function () {
    $coupon = Coupon::factory()->withMinOrder(100.00)->create([
        'type'  => 'percentage',
        'value' => 10.00,
    ]);

    expect($coupon->getDiscountFor(50.00))->toBe(0.0);
    expect($coupon->getDiscountFor(100.00))->toBe(10.00);
});

// ── markAsUsed ────────────────────────────────────────────────────────────────

test('markAsUsed incrementa used_count', function () {
    $coupon = Coupon::factory()->create(['used_count' => 3]);

    $coupon->markAsUsed();

    expect($coupon->fresh()->used_count)->toBe(4);
});

// ── scopeActive ──────────────────────────────────────────────────────────────

test('scope active não retorna cupons expirados', function () {
    Coupon::factory()->expired()->create(['code' => 'EXP']);
    Coupon::factory()->create(['code' => 'VALID']);

    $active = Coupon::active()->pluck('code');

    expect($active)->not->toContain('EXP')
                        ->toContain('VALID');
});

test('scope active não retorna cupons inativos', function () {
    Coupon::factory()->create(['code' => 'INATIVO', 'is_active' => false]);
    Coupon::factory()->create(['code' => 'ATIVO', 'is_active' => true]);

    $active = Coupon::active()->pluck('code');

    expect($active)->not->toContain('INATIVO')
                        ->toContain('ATIVO');
});
