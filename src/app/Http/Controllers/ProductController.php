<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Show the product page.
     */
    public function __invoke(string $slug): Response
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with([
                'images' => fn ($q) => $q->orderBy('sort_order'),
                'primaryImage',
                'activePrice',
                'salePrice',
                'categories' => fn ($q) => $q->active(),
                'reviews' => fn ($q) => $q->approved()->with('user')->latest(),
            ])
            ->firstOrFail();

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
