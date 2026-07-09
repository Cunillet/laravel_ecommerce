<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_role_works(): void
    {
        // Given: a user with admin role
        /** @var User $admin */
        $admin = User::factory()->admin()->create();

        // And: a user with customer role
        /** @var User $customer */
        $customer = User::factory()->create(['role' => 'customer']);

        // Then: only the admin is recognized as an admin
        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($customer->isAdmin());
    }

    public function test_a_user_can_have_orders(): void
    {
        // Given: a user
        /** @var User $user */
        $user = User::factory()->create();

        // When: orders are created for the user
        Order::factory()->count(3)->create(['user_id' => $user->id]);

        // Then: the user has the orders
        $this->assertCount(3, $user->orders);
        foreach ($user->orders as $order) {
            $this->assertEquals($user->id, $order->user_id);
        }
    }

    public function test_a_user_can_have_reviews(): void
    {
        // Given: a user
        /** @var User $user */
        $user = User::factory()->create();

        // When: reviews are created for the user
        Review::factory()->count(2)->create(['user_id' => $user->id]);

        // Then: the user has the reviews
        $this->assertCount(2, $user->reviews);
        foreach ($user->reviews as $review) {
            $this->assertEquals($user->id, $review->user_id);
        }
    }

    public function test_a_user_can_have_a_cart(): void
    {
        // Given: a user
        /** @var User $user */
        $user = User::factory()->create();

        // When: a cart is created for the user
        /** @var Cart $cart */
        $cart = Cart::factory()->forUser($user)->create();

        // Then: the user has the cart
        $this->assertCount(1, $user->carts);
        $this->assertTrue($user->carts->contains($cart));
    }
}
