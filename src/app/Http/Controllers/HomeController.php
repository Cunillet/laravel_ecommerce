<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $banners = Banner::active()
            ->orderBy('sort_order')
            ->get();

        $featuredProducts = Product::active()
            ->with([
                'primaryImage',
                'activePrice',
                'salePrice',
            ])
            ->inRandomOrder()
            ->take(8)
            ->get();

        $categories = Category::active()
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->active()->withCount('products')])
            ->withCount('products')
            ->get();

        return Inertia::render('Home', [
            'banners' => $banners,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
