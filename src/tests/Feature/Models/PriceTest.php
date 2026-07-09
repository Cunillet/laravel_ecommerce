<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Price;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PriceTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_product_has_a_standard_price(): void
    {
        // Given: a product with a standard price
        /** @var Product $product */
        $product = Product::factory()->create();
        /** @var Price $price */
        $price = Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'standard',
            'is_active' => true,
        ]);

        // Then: the price belongs to the product and is standard
        $this->assertTrue($price->product->is($product));
        $this->assertEquals('standard', $price->type);
        $this->assertEquals($price->id, $product->activePrice->id);
    }

    public function test_a_product_can_have_a_sale_price(): void
    {
        // Given: a product
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: a sale price is created
        /** @var Price $salePrice */
        $salePrice = Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'sale',
            'is_active' => true,
        ]);

        // Then: the price is typed as sale
        $this->assertTrue($salePrice->product->is($product));
        $this->assertEquals('sale', $salePrice->type);
    }

    public function test_active_scope_returns_only_active_prices(): void
    {
        // Given: active and inactive prices for the same product
        /** @var Product $product */
        $product = Product::factory()->create();
        Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'standard',
            'is_active' => true,
        ]);
        Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'standard',
            'is_active' => false,
        ]);

        // When: using the active scope
        $activePrices = Price::active()->get();

        // Then: only active prices are returned
        $this->assertCount(1, $activePrices);
        $this->assertTrue($activePrices->first()->is_active);
    }

    public function test_sale_scope_returns_only_sale_type(): void
    {
        // Given: standard and sale prices for the same product
        /** @var Product $product */
        $product = Product::factory()->create();
        Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'standard',
        ]);
        Price::factory()->create([
            'product_id' => $product->id,
            'type' => 'sale',
        ]);

        // When: using the sale scope
        $salePrices = Price::sale()->get();

        // Then: only sale prices are returned
        $this->assertCount(1, $salePrices);
        $this->assertEquals('sale', $salePrices->first()->type);
    }
}
