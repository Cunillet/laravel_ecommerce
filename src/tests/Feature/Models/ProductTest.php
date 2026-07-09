<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Category;
use App\Models\Price;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_product_can_have_many_categories(): void
    {
        // Given: a product
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: categories are attached to the product
        $categories = Category::factory(3)->create();
        $product->categories()->attach($categories->pluck('id')->toArray());

        // Then: the product belongs to all categories
        $this->assertCount(3, $product->categories);
        foreach ($categories as $category) {
            $this->assertTrue($product->categories->contains($category));
        }
    }

    public function test_a_product_can_have_many_prices(): void
    {
        // Given: a product
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: prices are created for the product
        Price::factory()->count(2)->create([
            'product_id' => $product->id,
            'type' => 'standard',
        ]);

        // Then: the product has the prices
        $this->assertCount(2, $product->prices);
        foreach ($product->prices as $price) {
            $this->assertEquals('standard', $price->type);
        }
    }

    public function test_a_product_can_have_images(): void
    {
        // Given: a product
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: images are created for the product
        $images = ProductImage::factory()->count(3)->create([
            'product_id' => $product->id,
        ]);

        // Then: the product has the images, sorted by sort_order
        $this->assertCount(3, $product->images);
        foreach ($images as $image) {
            $this->assertTrue($product->images->contains($image));
        }
    }

    public function test_active_scope_filters_correctly(): void
    {
        // Given: active and inactive products
        $active = Product::factory()->create(['name' => 'Active Product', 'is_active' => true]);
        Product::factory()->create(['name' => 'Inactive Product', 'is_active' => false]);

        // When: using the active scope
        $activeProducts = Product::active()->get();

        // Then: only active products are returned
        $this->assertCount(1, $activeProducts);
        $this->assertEquals($active->id, $activeProducts->first()->id);
    }

    public function test_soft_delete_works(): void
    {
        // Given: a product
        /** @var Product $product */
        $product = Product::factory()->create();

        // When: the product is deleted
        $product->delete();

        // Then: it is soft-deleted
        $this->assertSoftDeleted($product);
        $this->assertNotNull($product->deleted_at);
        $this->assertNull(Product::find($product->id));
        $this->assertNotNull(Product::withTrashed()->find($product->id));
    }
}
