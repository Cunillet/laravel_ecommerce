<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Price;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        $price = $product->activePrice ?? Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'standard',
            'is_active' => true,
        ]);
        $quantity = fake()->numberBetween(1, 3);

        return [
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_price' => $price->amount,
            'quantity' => $quantity,
            'subtotal' => round((float) $price->amount * $quantity, 2),
        ];
    }
}
