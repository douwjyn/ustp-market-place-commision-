<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
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
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            // 'role' => fake()->randomElement(['user', 'shop_owner']),
            'phone' => fake()->unique()->phoneNumber(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'address' => fake()->address(),
            'birthdate' => fake()->date(),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
