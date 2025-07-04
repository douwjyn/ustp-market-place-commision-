<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
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
            'user_id' => fake()->numberBetween(1, 10),
            'shop_id' => fake()->numberBetween(1, 10),
            'product_id' => fake()->numberBetween(1, 10),
            'status' => fake()->randomElement(['pending', 'confirmed', 'received', 'cancelled']),
            'is_confirmed' => fake()->randomElement([true, false]),
            'payment_method_id' => 1,
            'price' => fake()->randomFloat(2, 1, 1000),
            'quantity' => fake()->numberBetween(1, 100),
            'total' => fake()->randomFloat(2, 1, 1000),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
