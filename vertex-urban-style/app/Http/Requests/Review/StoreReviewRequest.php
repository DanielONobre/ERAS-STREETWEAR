<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|integer|exists:products,id',
            'order_id'   => 'nullable|integer|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:100',
            'body'       => 'required|string|min:10|max:2000',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'title' => $this->input('title') ? strip_tags($this->input('title')) : null,
            'body'  => $this->input('body') ? strip_tags($this->input('body')) : null,
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            // Impede avaliações duplicadas no mesmo produto
            $alreadyReviewed = \App\Models\Review::where('product_id', $this->input('product_id'))
                ->where('user_id', $this->user()->id)
                ->exists();

            if ($alreadyReviewed) {
                $v->errors()->add('product_id', 'Você já avaliou este produto.');
            }

            // Se informou order_id, verifica que pertence ao usuário
            if ($this->input('order_id')) {
                $belongs = \App\Models\Order::where('id', $this->input('order_id'))
                    ->where('user_id', $this->user()->id)
                    ->exists();
                if (!$belongs) {
                    $v->errors()->add('order_id', 'Pedido não encontrado.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produto inválido.',
            'rating.required'     => 'Selecione uma nota de 1 a 5.',
            'rating.min'          => 'A nota mínima é 1.',
            'rating.max'          => 'A nota máxima é 5.',
            'body.required'       => 'Escreva sua avaliação.',
            'body.min'            => 'A avaliação deve ter pelo menos 10 caracteres.',
        ];
    }
}
