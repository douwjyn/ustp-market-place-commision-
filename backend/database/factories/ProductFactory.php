<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $now = Carbon::now();

        return [
            'shop_id' => fake()->numberBetween(1, 10),
            'name' => fake()->unique()->name(),
            'description' => fake()->sentence(),
            'image' => fake()->imageUrl(),
            'price' => fake()->randomFloat(2, 1, 1000),
            'quantity' => fake()->numberBetween(1, 100),
            'stock' => fake()->numberBetween(1, 100),
            'discount' => fake()->numberBetween(0, 100),
            'category' => fake()->randomElement(['Food', 'Drink', 'Gaming', 'Electronics', 'Other', 'Clothing', 'Furniture', 'Toys', 'Books', 'Health']),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
