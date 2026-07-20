<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        $rules = [
            'use_different_billing' => ['boolean'],
            'payment.card_number' => ['required', 'string'],
            'payment.expiry' => ['required', 'string'],
            'payment.cvc' => ['required', 'string'],
        ];

        if (auth()->check()) {
            $rules['shipping_address_id'] = ['required', 'exists:shipping_addresses,id'];
            $rules['billing_address_id'] = ['nullable', 'required_if:use_different_billing,true', 'exists:shipping_addresses,id'];
        } else {
            $rules['guest_email'] = ['required', 'email'];
            $rules['shipping_address_data.full_name'] = ['required', 'string', 'max:255'];
            $rules['shipping_address_data.street'] = ['required', 'string', 'max:255'];
            $rules['shipping_address_data.city'] = ['required', 'string', 'max:255'];
            $rules['shipping_address_data.state'] = ['nullable', 'string', 'max:255'];
            $rules['shipping_address_data.zip'] = ['required', 'string', 'max:20'];
            $rules['shipping_address_data.country'] = ['required', 'string', 'max:255'];
            $rules['shipping_address_data.phone'] = ['required', 'string', 'max:20'];

            if ($this->boolean('use_different_billing')) {
                $rules['billing_address_data.full_name'] = ['required', 'string', 'max:255'];
                $rules['billing_address_data.street'] = ['required', 'string', 'max:255'];
                $rules['billing_address_data.city'] = ['required', 'string', 'max:255'];
                $rules['billing_address_data.state'] = ['nullable', 'string', 'max:255'];
                $rules['billing_address_data.zip'] = ['required', 'string', 'max:20'];
                $rules['billing_address_data.country'] = ['required', 'string', 'max:255'];
                $rules['billing_address_data.phone'] = ['required', 'string', 'max:20'];
            }
        }

        return $rules;
    }
}
