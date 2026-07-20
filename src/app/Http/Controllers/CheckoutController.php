<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
    ) {}

    public function index(): Response
    {
        $cart = $this->cartService->getCart();
        $items = $cart?->items ?? collect();

        $checkoutItems = $items->map(fn ($item) => [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'product' => [
                'id' => $item->product->id,
                'name' => $item->product->name,
                'slug' => $item->product->slug,
                'image' => $item->product->primaryImage?->url
                    ?? $item->product->images->first()?->url
                    ?? null,
                'price' => $item->product->activePrice?->price ?? 0,
                'sale_price' => $item->product->salePrice?->price ?? null,
            ],
            'subtotal' => ($item->product->activePrice?->price ?? 0) * $item->quantity,
        ]);

        $total = $checkoutItems->sum('subtotal');
        $itemCount = $checkoutItems->sum('quantity');

        $addresses = auth()->check()
            ? auth()->user()->shippingAddresses()->latest()->get()
            : collect();

        return Inertia::render('Checkout/Index', [
            'items' => $checkoutItems,
            'total' => $total,
            'itemCount' => $itemCount,
            'addresses' => $addresses,
            'isGuest' => !auth()->check(),
        ]);
    }

    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $cart = $this->cartService->getCart();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Tu carrito está vacío.');
        }

        $validated = $request->validated();
        $user = auth()->user();

        $total = $cart->items->sum(function ($item) {
            return ($item->product->activePrice?->price ?? 0) * $item->quantity;
        });

        $orderData = [
            'user_id' => $user?->id,
            'total_amount' => $total,
            'status' => 'pending',
            'notes' => null,
        ];

        if ($user) {
            $orderData['shipping_address_id'] = $validated['shipping_address_id'];

            if ($request->boolean('use_different_billing') && !empty($validated['billing_address_id'])) {
                $orderData['billing_address_id'] = $validated['billing_address_id'];
            } else {
                $orderData['billing_address_id'] = $validated['shipping_address_id'];
            }
        } else {
            $orderData['guest_email'] = $validated['guest_email'];
            $orderData['shipping_address_data'] = $validated['shipping_address_data'];

            if ($request->boolean('use_different_billing')) {
                $orderData['billing_address_data'] = $validated['billing_address_data'];
            } else {
                $orderData['billing_address_data'] = $validated['shipping_address_data'];
            }
        }

        $order = Order::create($orderData);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_price' => $item->product->activePrice?->price ?? 0,
                'quantity' => $item->quantity,
                'subtotal' => ($item->product->activePrice?->price ?? 0) * $item->quantity,
            ]);
        }

        Payment::create([
            'order_id' => $order->id,
            'method' => 'card',
            'status' => 'completed',
            'transaction_id' => 'TXN-' . strtoupper(bin2hex(random_bytes(8))),
            'amount' => $total,
        ]);

        $this->cartService->clearCart();

        return redirect()->route('orders.show', $order)
            ->with('success', '¡Pedido realizado correctamente!');
    }

    public function asyncLogin(Request $request): JsonResponse|RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $sessionId = Session::getId();

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $this->cartService->mergeGuestCartIntoUser(
                auth()->id(),
                $sessionId,
            );

            return response()->json([
                'success' => true,
                'message' => 'Sesión iniciada correctamente.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Credenciales incorrectas.',
        ], 422);
    }
}
