<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 1000);
        $shipping = fake()->randomFloat(2, 0, 30);

        return [
            'user_id'        => User::factory(),
            'address_id'     => Address::factory(),
            'coupon_id'      => null,
            'status'         => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'pix',
            'payment_id'     => null,
            'subtotal'       => $subtotal,
            'discount'       => 0,
            'shipping_cost'  => $shipping,
            'total'          => $subtotal + $shipping,
            'shipping_method' => 'pac',
            'tracking_code'  => null,
            'notes'          => null,
            'shipped_at'     => null,
            'delivered_at'   => null,
        ];
    }

    public function paid(): static
    {
        return $this->state([
            'status'         => 'confirmed',
            'payment_status' => 'paid',
        ]);
    }

    public function shipped(): static
    {
        return $this->state([
            'status'         => 'shipped',
            'payment_status' => 'paid',
            'tracking_code'  => fake()->numerify('BR#########BR'),
            'shipped_at'     => now()->subDays(2),
        ]);
    }
}
