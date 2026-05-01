<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeValidCpf', function () {
    $cpf = preg_replace('/\D/', '', $this->value);

    expect(strlen($cpf))->toBe(11);

    $sum = 0;
    for ($i = 0; $i < 9; $i++) {
        $sum += (int) $cpf[$i] * (10 - $i);
    }
    $r = $sum % 11;
    $d1 = $r < 2 ? 0 : 11 - $r;
    expect((int) $cpf[9])->toBe($d1);

    $sum = 0;
    for ($i = 0; $i < 10; $i++) {
        $sum += (int) $cpf[$i] * (11 - $i);
    }
    $r = $sum % 11;
    $d2 = $r < 2 ? 0 : 11 - $r;
    expect((int) $cpf[10])->toBe($d2);

    return $this;
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function makeAdmin(): \App\Models\User
{
    return \App\Models\User::factory()->create(['is_admin' => true, 'role' => 'admin']);
}

function makeCustomer(): \App\Models\User
{
    return \App\Models\User::factory()->create(['is_admin' => false, 'role' => 'customer']);
}
