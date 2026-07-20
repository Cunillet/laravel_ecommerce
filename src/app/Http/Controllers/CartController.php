<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
    ) {}

    public function index(): InertiaResponse
    {
        $cart = $this->cartService->getCart();
        $items = $cart?->items ?? collect();
        $total = $this->cartService->getCartTotal();

        return Inertia::render('Cart/Index', [
            'items' => $items->values()->map(fn (CartItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'stock' => $item->product->stock,
                    'image' => $item->product->primaryImage?->url
                        ?? $item->product->images->first()?->url
                        ?? null,
                    'price' => $item->product->activePrice?->price ?? 0,
                    'sale_price' => $item->product->salePrice?->price ?? null,
                ],
                'subtotal' => ($item->product->activePrice?->price ?? 0) * $item->quantity,
            ]),
            'total' => $total,
            'itemCount' => $items->sum('quantity'),
        ]);
    }

    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $this->cartService->addItem(
            (int) $request->validated('product_id'),
            (int) ($request->validated('quantity') ?? 1),
        );

        return Redirect::route('cart.index');
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        $this->cartService->updateQuantity(
            $cartItem,
            (int) $request->validated('quantity'),
        );

        return Redirect::route('cart.index');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $this->cartService->removeItem($cartItem);

        return Redirect::route('cart.index');
    }
}

