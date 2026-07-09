<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Price;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Price>
 */
class PriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => fake()->randomFloat(2, 5, 500),
            'type' => 'standard',
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ];
    }

    /**
     * Set the price as a sale price.
     * Defaults to 50% of the standard amount.
     */
    public function sale(float $amount = null): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'sale',
            'amount' => $amount ?? round((float) ($attributes['amount'] ?? 0) * 0.5, 2),
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
        ]);
    }
}
