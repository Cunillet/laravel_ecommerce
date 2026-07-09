<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();

        return [
            'user_id' => $user->id,
            'total_amount' => 0,
            'status' => 'pending',
            'shipping_address_id' => ShippingAddress::factory()->create(['user_id' => $user->id])->id,
            'notes' => null,
        ];
    }

    /**
     * Configure the factory to create order items and calculate total.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            $itemCount = fake()->numberBetween(2, 5);
            $total = 0;

            for ($i = 0; $i < $itemCount; $i++) {
                $product = Product::factory()->create();
                $price = $product->activePrice ?? \App\Models\Price::factory()->create([
                    'product_id' => $product->id,
                    'type' => 'standard',
                    'is_active' => true,
                ]);
                $quantity = fake()->numberBetween(1, 3);
                $subtotal = (float) $price->amount * $quantity;

                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $price->amount,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $order->update(['total_amount' => round($total, 2)]);
        });
    }
}
