<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->with(['items', 'payment'])
            ->latest()
            ->get();

        return Inertia::render('Profile/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        $order->load(['items', 'payment', 'shippingAddress']);

        return Inertia::render('Profile/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function publicShow(Order $order): Response
    {
        $order->load(['items', 'payment', 'shippingAddress', 'billingAddress']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'auth' => auth()->user() ? ['user' => auth()->user()] : null,
        ]);
    }
}
