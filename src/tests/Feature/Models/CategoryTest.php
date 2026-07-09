<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_category_can_have_children(): void
    {
        /** @var Category $parent */
        $parent = Category::factory()->create(['name' => 'Parent Category']);
        /** @var Category $child */
        $child = Category::factory()->create([
            'name' => 'Child Category',
            'parent_id' => $parent->id,
        ]);

        // Then: parent has children, child belongs to parent
        $this->assertTrue($parent->children->contains($child));
        $this->assertEquals($parent->id, $child->parent->id);
    }

    public function test_a_category_can_have_products(): void
    {
        // Given: a category
        /** @var Category $category */
        $category = Category::factory()->create();

        // When: products are attached to the category
        $products = Product::factory(3)->create();
        $category->products()->sync($products->pluck('id')->toArray());

        // Then: the category has the products
        $this->assertCount(3, $category->products);
        foreach ($products as $product) {
            $this->assertTrue($category->products->contains($product));
        }
    }

    public function test_active_scope_filters_correctly(): void
    {
        // Given: active and inactive categories
        Category::factory()->create(['name' => 'Active Cat', 'is_active' => true]);
        Category::factory()->create(['name' => 'Inactive Cat', 'is_active' => false]);

        // When: using the active scope
        $activeCategories = Category::active()->get();

        // Then: only active categories are returned
        $this->assertCount(1, $activeCategories);
        $this->assertEquals('Active Cat', $activeCategories->first()->name);
    }

    public function test_soft_delete_works(): void
    {
        // Given: a category
        /** @var Category $category */
        $category = Category::factory()->create();

        // When: the category is deleted
        $category->delete();

        // Then: it is soft-deleted
        $this->assertSoftDeleted($category);
        $this->assertNotNull($category->deleted_at);
        $this->assertNull(Category::find($category->id));
        $this->assertNotNull(Category::withTrashed()->find($category->id));
    }
}
