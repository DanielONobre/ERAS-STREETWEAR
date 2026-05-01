<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code'            => strtoupper(Str::random(8)),
            'type'            => 'percentage',
            'value'           => fake()->randomFloat(2, 5, 30),
            'min_order_value' => null,
            'max_uses'        => null,
            'used_count'      => 0,
            'starts_at'       => null,
            'expires_at'      => null,
            'is_active'       => true,
        ];
    }

    public function fixed(): static
    {
        return $this->state([
            'type'  => 'fixed',
            'value' => fake()->randomFloat(2, 10, 50),
        ]);
    }

    public function freeShipping(): static
    {
        return $this->state(['type' => 'free_shipping', 'value' => 0]);
    }

    public function expired(): static
    {
        return $this->state(['expires_at' => now()->subDay()]);
    }

    public function exhausted(): static
    {
        return $this->state(['max_uses' => 5, 'used_count' => 5]);
    }

    public function withMinOrder(float $min): static
    {
        return $this->state(['min_order_value' => $min]);
    }
}
