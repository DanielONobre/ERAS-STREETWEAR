<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name  = fake()->unique()->words(3, true);
        $price = fake()->randomFloat(2, 49.90, 499.90);

        return [
            'category_id'       => Category::factory(),
            'brand_id'          => null,
            'name'              => ucwords($name),
            'slug'              => Str::slug($name) . '-' . fake()->unique()->numerify('###'),
            'sku'               => 'VTX-' . strtoupper(Str::random(8)),
            'description'       => fake()->paragraph(),
            'short_description' => fake()->sentence(),
            'price'             => $price,
            'compare_price'     => null,
            'cost_price'        => $price * 0.4,
            'stock_quantity'    => fake()->numberBetween(10, 100),
            'stock_status'      => 'in_stock',
            'weight'            => fake()->randomFloat(2, 0.1, 2.0),
            'is_active'         => true,
            'is_featured'       => false,
            'is_digital'        => false,
            'views'             => 0,
        ];
    }

    public function onSale(): static
    {
        return $this->state(fn (array $attrs) => [
            'compare_price' => $attrs['price'] * 1.3,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state([
            'stock_quantity' => 0,
            'stock_status'   => 'out_of_stock',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    public function featured(): static
    {
        return $this->state(['is_featured' => true]);
    }
}
