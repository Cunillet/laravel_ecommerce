<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraphs(3, true),
            'stock' => fake()->numberBetween(0, 100),
            'sku' => 'SKU-' . fake()->unique()->bothify('?????-#####'),
            'is_active' => true,
        ];
    }

    /**
     * Configure the factory to attach random categories after creating.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            $categories = Category::inRandomOrder()->take(fake()->numberBetween(1, 3))->get();

            if ($categories->isNotEmpty()) {
                $product->categories()->attach($categories->pluck('id')->toArray());
            }
        });
    }
}
