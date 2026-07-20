<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

class CartService
{
    public function getOrCreateCart(): Cart
    {
        $user = auth()->user();

        if ($user) {
            return Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['user_id' => $user->id],
            );
        }

        $sessionId = Session::getId();

        $cart = Cart::forGuest($sessionId)
            ->where(function ($q) {
                $q->whereNull('guest_expires_at')
                    ->orWhere('guest_expires_at', '>', now());
            })
            ->first();

        if ($cart) {
            return $cart;
        }

        return Cart::create([
            'session_id' => $sessionId,
            'guest_expires_at' => now()->addDays(7),
        ]);
    }

    public function addItem(int $productId, int $quantity = 1): CartItem
    {
        $product = Product::findOrFail($productId);

        $quantity = min($quantity, $product->stock);
        $quantity = max(1, $quantity);

        $cart = $this->getOrCreateCart();

        return CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $productId,
            ],
            [
                'quantity' => $quantity,
            ],
        );
    }

    public function updateQuantity(CartItem $item, int $quantity): CartItem
    {
        $this->authorizeCartItem($item);

        $quantity = min($quantity, $item->product->stock);
        $quantity = max(1, $quantity);

        $item->update(['quantity' => $quantity]);

        return $item;
    }

    public function removeItem(CartItem $item): void
    {
        $this->authorizeCartItem($item);
        $item->delete();
    }

    public function getCart(): ?Cart
    {
        $user = auth()->user();

        $with = [
            'items.product.primaryImage',
            'items.product.activePrice',
            'items.product.salePrice',
            'items.product.images',
        ];

        if ($user) {
            return Cart::forUser($user->id)
                ->with($with)
                ->first();
        }

        $sessionId = Session::getId();

        return Cart::forGuest($sessionId)
            ->with($with)
            ->where(function ($q) {
                $q->whereNull('guest_expires_at')
                    ->orWhere('guest_expires_at', '>', now());
            })
            ->first();
    }

    public function getItemCount(): int
    {
        $cart = $this->getCart();

        if (!$cart) {
            return 0;
        }

        return $cart->items->sum('quantity');
    }

    public function getCartItems(): Collection
    {
        $cart = $this->getCart();

        if (!$cart) {
            return collect();
        }

        return $cart->items;
    }

    public function getCartTotal(): float
    {
        $items = $this->getCartItems();

        return $items->sum(function (CartItem $item) {
            $price = $item->product->activePrice;

            return ($price?->price ?? 0) * $item->quantity;
        });
    }

    public function mergeGuestCartIntoUser(int $userId, ?string $sessionId = null): ?Cart
    {
        $sessionId ??= Session::getId();

        $guestCart = Cart::forGuest($sessionId)->first();

        if (!$guestCart) {
            return null;
        }

        $userCart = Cart::firstOrCreate(
            ['user_id' => $userId],
            ['user_id' => $userId],
        );

        $existingProductIds = $userCart->items()
            ->pluck('product_id')
            ->toArray();

        foreach ($guestCart->items as $guestItem) {
            if (in_array($guestItem->product_id, $existingProductIds, true)) {
                continue;
            }

            CartItem::create([
                'cart_id' => $userCart->id,
                'product_id' => $guestItem->product_id,
                'quantity' => $guestItem->quantity,
            ]);
        }

        $guestCart->delete();

        return $userCart->load([
            'items.product.primaryImage',
            'items.product.activePrice',
            'items.product.salePrice',
            'items.product.images',
        ]);
    }

    public function clearCart(): void
    {
        $cart = $this->getCart();

        if ($cart) {
            $cart->items()->delete();
        }
    }

    private function authorizeCartItem(CartItem $item): void
    {
        $cart = $item->cart;
        $user = auth()->user();

        if ($user && $cart->user_id !== $user->id) {
            abort(403, 'This cart item does not belong to you.');
        }

        if (!$user && $cart->session_id !== Session::getId()) {
            abort(403, 'This cart item does not belong to your session.');
        }
    }
}
