<?php

use App\Models\User;

// ── Register ─────────────────────────────────────────────────────────────────

test('usuario pode se registrar com dados válidos', function () {
    $response = $this->post('/cadastro', [
        'name'                  => 'João Silva',
        'email'                 => 'joao@example.com',
        'password'              => 'Password@123',
        'password_confirmation' => 'Password@123',
    ]);

    $response->assertRedirect('/');
    $this->assertDatabaseHas('users', ['email' => 'joao@example.com']);
});

test('registro falha com email duplicado', function () {
    User::factory()->create(['email' => 'duplicado@example.com']);

    $this->post('/cadastro', [
        'name'                  => 'Outro',
        'email'                 => 'duplicado@example.com',
        'password'              => 'Password@123',
        'password_confirmation' => 'Password@123',
    ])->assertSessionHasErrors('email');
});

test('registro falha sem campos obrigatórios', function () {
    $this->post('/cadastro', [])->assertSessionHasErrors(['name', 'email', 'password']);
});

// ── Login ────────────────────────────────────────────────────────────────────

test('usuario pode fazer login com credenciais corretas', function () {
    $user = User::factory()->create(['password' => bcrypt('Password@123')]);

    $this->post('/entrar', [
        'email'    => $user->email,
        'password' => 'Password@123',
    ])->assertRedirect('/');

    $this->assertAuthenticatedAs($user);
});

test('login falha com senha incorreta', function () {
    $user = User::factory()->create(['password' => bcrypt('Password@123')]);

    $this->post('/entrar', [
        'email'    => $user->email,
        'password' => 'senha_errada',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('login falha com email inexistente', function () {
    $this->post('/entrar', [
        'email'    => 'naoexiste@example.com',
        'password' => 'qualquer',
    ])->assertSessionHasErrors('email');
});

// ── Logout ───────────────────────────────────────────────────────────────────

test('usuario autenticado pode fazer logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->post('/sair')
         ->assertRedirect('/');

    $this->assertGuest();
});

// ── Redirect ─────────────────────────────────────────────────────────────────

test('usuario autenticado é redirecionado da página de login', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->get('/entrar')
         ->assertRedirect('/');
});
