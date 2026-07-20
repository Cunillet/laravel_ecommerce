<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Models\ShippingAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = $request->user()
            ->shippingAddresses()
            ->latest()
            ->get();

        return Inertia::render('Profile/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Profile/Addresses/Form');
    }

    public function store(StoreAddressRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        if ($request->boolean('is_default')) {
            $request->user()->shippingAddresses()->update(['is_default' => false]);
        }

        ShippingAddress::create($data);

        return Redirect::route('profile.addresses.index')
            ->with('success', 'Dirección creada correctamente.');
    }

    public function edit(Request $request, ShippingAddress $address): Response
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Profile/Addresses/Form', [
            'address' => $address,
        ]);
    }

    public function update(StoreAddressRequest $request, ShippingAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($request->boolean('is_default')) {
            $request->user()->shippingAddresses()
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($request->validated());

        return Redirect::route('profile.addresses.index')
            ->with('success', 'Dirección actualizada correctamente.');
    }

    public function destroy(Request $request, ShippingAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $address->delete();

        return Redirect::route('profile.addresses.index')
            ->with('success', 'Dirección eliminada correctamente.');
    }
}
