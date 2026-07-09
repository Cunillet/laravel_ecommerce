<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_review_belongs_to_a_user_and_product(): void
    {
        // Given: a user and a product
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: a review is created
        /** @var Review $review */
        $review = Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        // Then: the review belongs to the user and product
        $this->assertTrue($review->user->is($user));
        $this->assertTrue($review->product->is($product));
    }

    public function test_approved_scope_works(): void
    {
        // Given: approved and unapproved reviews
        Review::factory()->create(['is_approved' => true]);
        Review::factory()->create(['is_approved' => false]);

        // When: using the approved scope
        $approved = Review::approved()->get();

        // Then: only approved reviews are returned
        $this->assertCount(1, $approved);
        $this->assertTrue($approved->first()->is_approved);
    }

    public function test_a_user_can_only_review_a_product_once(): void
    {
        // Given: a user and a product
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: the user creates a review
        Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        // Then: a duplicate review throws an exception
        $this->expectException(\Illuminate\Database\QueryException::class);
        $this->expectExceptionMessageMatches('/unique.*constraint|duplicate.*key|integrity.*constraint/i');

        Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }
}
