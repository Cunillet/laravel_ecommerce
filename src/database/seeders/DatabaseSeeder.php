<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Price;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;
use Database\Factories\CartItemFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(BannerSeeder::class);

        // 1 admin user (skip if already exists)
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::factory()->admin()->create([
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
            ]);
        }

        // 5 customer users
        User::factory(5)->create();

        // 10 categories with hierarchy (3 parent, 7 children)
        $parents = Category::factory(3)->create();

        Category::factory(3)->withParent($parents[0])->create();
        Category::factory(2)->withParent($parents[1])->create();
        Category::factory(2)->withParent($parents[2])->create();

        // 50 products, each with categories, images, and prices
        $categories = Category::all();

        foreach (Product::factory(50)->create() as $product) {
            // Attach 1-3 random categories
            $product->categories()->syncWithoutDetaching(
                $categories->random(fake()->numberBetween(1, 3))->pluck('id')->toArray()
            );

            // 2-4 images, first is primary
            ProductImage::factory()->primary()->create(['product_id' => $product->id]);

            $extraImages = fake()->numberBetween(1, 3);
            if ($extraImages > 0) {
                ProductImage::factory($extraImages)->create(['product_id' => $product->id]);
            }

            // 1 standard price
            Price::factory()->create(['product_id' => $product->id]);

            // 20% chance of sale price
            if (fake()->boolean(20)) {
                Price::factory()->sale()->create(['product_id' => $product->id]);
            }
        }

        // 2 coupons (one percentage, one fixed)
        Coupon::factory()->create(['type' => 'percentage']);
        Coupon::factory()->create(['type' => 'fixed']);

        // 20 reviews for random products
        Review::factory(20)->create();

        // 1 cart with 3 items
        $customer = User::where('role', 'customer')->first();
        $cart = Cart::factory()->forUser($customer)->create();

        $products = Product::inRandomOrder()->take(3)->get();
        foreach ($products as $product) {
            CartItemFactory::new()->create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
            ]);
        }
    }
}
