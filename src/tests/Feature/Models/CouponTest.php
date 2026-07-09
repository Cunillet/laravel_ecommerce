<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Coupon;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_coupon_can_apply_to_many_products(): void
    {
        // Given: a coupon
        /** @var Coupon $coupon */
        $coupon = Coupon::factory()->create();

        // When: products are attached to the coupon
        $products = Product::factory(3)->create();
        $coupon->products()->attach($products->pluck('id')->toArray());

        // Then: the coupon applies to all products
        $this->assertCount(3, $coupon->products);
        foreach ($products as $product) {
            $this->assertTrue($coupon->products->contains($product));
        }
    }

    public function test_active_scope_works(): void
    {
        // Given: active and inactive coupons
        Coupon::factory()->create(['code' => 'ACTIVE-01', 'is_active' => true]);
        Coupon::factory()->create(['code' => 'INACTIVE-01', 'is_active' => false]);

        // When: using the active scope
        $active = Coupon::active()->get();

        // Then: only active coupons are returned
        $this->assertCount(1, $active);
        $this->assertEquals('ACTIVE-01', $active->first()->code);
    }

    public function test_valid_scope_checks_dates(): void
    {
        // Given: a valid current coupon, a future coupon, and an expired coupon
        Coupon::factory()->create([
            'code' => 'VALID-NOW',
            'is_active' => true,
            'starts_at' => Carbon::yesterday(),
            'expires_at' => Carbon::tomorrow(),
        ]);

        Coupon::factory()->create([
            'code' => 'NOT-STARTED',
            'is_active' => true,
            'starts_at' => Carbon::tomorrow(),
            'expires_at' => Carbon::tomorrow()->addDays(30),
        ]);

        Coupon::factory()->create([
            'code' => 'EXPIRED',
            'is_active' => true,
            'starts_at' => Carbon::now()->subDays(10),
            'expires_at' => Carbon::yesterday(),
        ]);

        // When: using the valid scope
        $valid = Coupon::valid()->get();

        // Then: only the currently valid coupon is returned
        $this->assertCount(1, $valid);
        $this->assertEquals('VALID-NOW', $valid->first()->code);
    }
}
