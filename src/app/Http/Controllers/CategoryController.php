<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Show category page with filtered products.
     */
    public function __invoke(string $slug, Request $request): Response
    {
        $category = Category::active()
            ->where('slug', $slug)
            ->with('children')
            ->firstOrFail();

        // Build breadcrumb from ancestors
        $ancestors = collect();
        $current = $category;
        while ($current->parent_id) {
            $current = Category::find($current->parent_id);
            if ($current) {
                $ancestors->prepend($current);
            }
        }
        $category->setRelation('ancestors', $ancestors);

        // Collect this category + all descendants IDs
        $categoryIds = $this->getDescendantIds($category);
        $categoryIds[] = $category->id;

        $query = Product::active()
            ->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $categoryIds))
            ->with([
                'primaryImage',
                'activePrice',
                'salePrice',
            ]);

        // Filter by name
        if ($name = $request->input('name')) {
            $query->where('name', 'like', "%{$name}%");
        }

        // Filter by colors (JSON contains)
        if ($colors = $request->input('colors')) {
            $colors = is_array($colors) ? $colors : [$colors];
            foreach ($colors as $color) {
                $query->whereJsonContains('colors', $color);
            }
        }

        // Filter by price range
        if ($priceMin = $request->input('price_min')) {
            $query->whereHas('activePrice', fn ($q) => $q->where('amount', '>=', (float) $priceMin));
        }
        if ($priceMax = $request->input('price_max')) {
            $query->whereHas('activePrice', fn ($q) => $q->where('amount', '<=', (float) $priceMax));
        }

        $products = $query->paginate(12)->withQueryString();

        // Collect available colors from all products in this category + descendants
        $availableColors = Product::active()
            ->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $categoryIds))
            ->pluck('colors')
            ->filter()
            ->flatten()
            ->unique(fn ($c) => is_array($c) ? ($c['value'] ?? $c) : $c)
            ->values()
            ->take(20);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
            'filters' => $request->only(['name', 'colors', 'price_min', 'price_max']),
            'availableColors' => $availableColors,
        ]);
    }

    /**
     * Recursively collect all descendant category IDs.
     *
     * @return list<int>
     */
    private function getDescendantIds(Category $category): array
    {
        $ids = [];

        foreach ($category->children as $child) {
            $ids[] = $child->id;
            // Load grandchildren if not already loaded
            if (! $child->relationLoaded('children')) {
                $child->load('children');
            }
            $ids = array_merge($ids, $this->getDescendantIds($child));
        }

        return $ids;
    }
}
