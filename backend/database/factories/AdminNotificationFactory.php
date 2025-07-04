<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdminNotification>
 */
class AdminNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // $table->enum('type', ['product_request', 'system', 'report', 'payment', 'user_registration', 'order']);
        //    $table->id();
        //             $table->enum('type', ['product_request', 'system', 'report', 'payment', 'user_registration', 'order']);
        //             $table->string('title');
        //             $table->string('message');
        //             $table->boolean('is_read');
        //             $table->boolean('action_required');
        //             $table->enum('priority', ['low', 'medium', 'high']);
        //             $table->timestamps();
        return [
            'type' => fake()->randomElement(['product_request', 'system', 'report', 'payment', 'user_registration', 'order']),
            'title' => fake()->unique()->name(),
            'message' => fake()->sentence(),
            'is_read' => fake()->randomElement([true, false]),
            'action_required' => fake()->randomElement([true, false]),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
        ];
    }
}
