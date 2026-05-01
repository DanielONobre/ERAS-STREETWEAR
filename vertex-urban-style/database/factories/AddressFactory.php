<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'name'         => fake()->name(),
            'phone'        => fake()->numerify('(##) #####-####'),
            'zip_code'     => fake()->numerify('########'),
            'street'       => fake()->streetName(),
            'number'       => fake()->buildingNumber(),
            'complement'   => null,
            'neighborhood' => fake()->word(),
            'city'         => fake()->city(),
            'state'        => fake()->stateAbbr(),
            'is_default'   => false,
        ];
    }
}
