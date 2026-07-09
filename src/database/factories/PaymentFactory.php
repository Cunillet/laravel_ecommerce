<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'method' => fake()->randomElement(['card', 'transfer', 'paypal', 'cash']),
            'status' => fake()->randomElement(['pending', 'completed', 'completed', 'completed']),
            'transaction_id' => 'TXN-' . fake()->uuid(),
        ];
    }
}
