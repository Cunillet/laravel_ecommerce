<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_order_has_items(): void
    {
        // Given: an order with items
        /** @var Order $order */
        $order = Order::factory()->create();

        // Then: the order has items
        $this->assertGreaterThan(0, $order->items->count());
        foreach ($order->items as $item) {
            $this->assertEquals($order->id, $item->order_id);
        }
    }

    public function test_an_order_belongs_to_a_user(): void
    {
        // Given: a user
        /** @var User $user */
        $user = User::factory()->create();

        // When: an order is created for that user
        /** @var Order $order */
        $order = Order::factory()->create(['user_id' => $user->id]);

        // Then: the order belongs to the user
        $this->assertTrue($order->user->is($user));
    }

    public function test_order_total_matches_items_subtotal(): void
    {
        // Given: a user and a product
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: an order is created without factory auto-items
        /** @var Order $order */
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total_amount' => 0,
        ]);

        // Remove any items the factory may have created
        $order->items()->delete();

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'product_price' => 49.99,
            'subtotal' => 99.98,
        ]);

        $order->refresh();

        // Then: the total should match the sum of all item subtotals
        $order->update(['total_amount' => $order->items->sum('subtotal')]);
        $order->refresh();

        $this->assertEquals(99.98, (float) $order->total_amount);
        $this->assertEquals(
            (float) $order->total_amount,
            (float) $order->items->sum('subtotal')
        );
    }
}
