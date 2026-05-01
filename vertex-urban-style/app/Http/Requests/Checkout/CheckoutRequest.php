<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'address_id'      => 'required|integer|exists:addresses,id',
            'payment_method'  => 'required|in:credit_card,pix,boleto',
            'shipping_method' => 'required|in:pac,sedex',
            'shipping_cost'   => 'required|numeric|min:0|max:9999.99',
            'coupon_code'     => 'nullable|string|max:50|alpha_dash',
            'notes'           => 'nullable|string|max:500',
            'cpf'             => 'required|string|max:14',

            // Dados de cartão (obrigatório apenas para credit_card)
            'payment_data'            => 'nullable|array',
            'payment_data.token'      => Rule::requiredIf($this->input('payment_method') === 'credit_card'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'notes'      => $this->input('notes') ? strip_tags($this->input('notes')) : null,
            'cpf'        => preg_replace('/\D/', '', $this->input('cpf', '')),
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $cpf = $this->input('cpf', '');

            if (!$this->validarCpf($cpf)) {
                $v->errors()->add('cpf', 'CPF inválido. Verifique os dígitos informados.');
            }

            // Garante que o endereço pertence ao usuário autenticado
            if ($this->input('address_id')) {
                $belongs = \App\Models\Address::where('id', $this->input('address_id'))
                    ->where('user_id', $this->user()->id)
                    ->exists();
                if (!$belongs) {
                    $v->errors()->add('address_id', 'Endereço não encontrado.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'address_id.required'     => 'Selecione um endereço de entrega.',
            'payment_method.required' => 'Selecione uma forma de pagamento.',
            'shipping_method.required' => 'Selecione um método de entrega.',
            'cpf.required'            => 'O CPF é obrigatório para emissão de nota fiscal.',
        ];
    }

    /**
     * Validação de CPF com algoritmo de dígitos verificadores.
     */
    private function validarCpf(string $cpf): bool
    {
        $cpf = preg_replace('/\D/', '', $cpf);

        if (strlen($cpf) !== 11) {
            return false;
        }

        // Rejeita CPFs com todos os dígitos iguais
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        // Cálculo do 1º dígito verificador
        $sum = 0;
        for ($i = 0; $i < 9; $i++) {
            $sum += (int) $cpf[$i] * (10 - $i);
        }
        $remainder = $sum % 11;
        $digit1    = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cpf[9] !== $digit1) {
            return false;
        }

        // Cálculo do 2º dígito verificador
        $sum = 0;
        for ($i = 0; $i < 10; $i++) {
            $sum += (int) $cpf[$i] * (11 - $i);
        }
        $remainder = $sum % 11;
        $digit2    = $remainder < 2 ? 0 : 11 - $remainder;

        return (int) $cpf[10] === $digit2;
    }
}
