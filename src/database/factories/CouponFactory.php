<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['percentage', 'fixed']);

        return [
            'code' => strtoupper(fake()->unique()->bothify('?????-#####')),
            'type' => $type,
            'value' => $type === 'percentage'
                ? fake()->randomFloat(2, 5, 50)
                : fake()->randomFloat(2, 5, 100),
            'min_amount' => fake()->randomFloat(2, 10, 50),
            'usage_limit' => fake()->numberBetween(10, 100),
            'used_count' => 0,
            'starts_at' => now(),
            'expires_at' => now()->addDays(fake()->numberBetween(7, 90)),
            'is_active' => true,
        ];
    }
}
