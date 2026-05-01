<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'status'         => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'tracking_code'  => 'nullable|string|max:100',
            'notes'          => 'nullable|string|max:1000',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('notes')) {
            $this->merge(['notes' => strip_tags($this->input('notes', ''))]);
        }
        if ($this->has('tracking_code')) {
            $this->merge(['tracking_code' => strip_tags($this->input('tracking_code', ''))]);
        }
    }

    public function messages(): array
    {
        return [
            'status.in'         => 'Status inválido.',
            'payment_status.in' => 'Status de pagamento inválido.',
        ];
    }
}
