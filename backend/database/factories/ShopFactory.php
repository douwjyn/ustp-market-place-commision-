<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
 */
class ShopFactory extends Factory
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
            'name' => fake()->unique()->company(),
            'description' => fake()->sentence(),
            'image' => fake()->imageUrl(),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
