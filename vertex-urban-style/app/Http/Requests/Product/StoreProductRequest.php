<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'category_id'       => 'required|integer|exists:categories,id',
            'brand_id'          => 'nullable|integer|exists:brands,id',
            'name'              => 'required|string|max:255',
            'slug'              => "nullable|string|max:255|unique:products,slug,{$productId}",
            'sku'               => "nullable|string|max:100|unique:products,sku,{$productId}",
            'description'       => 'nullable|string|max:10000',
            'short_description' => 'nullable|string|max:500',
            'price'             => 'required|numeric|min:0.01|max:999999.99',
            'compare_price'     => 'nullable|numeric|min:0.01|max:999999.99|gt:price',
            'cost_price'        => 'nullable|numeric|min:0|max:999999.99',
            'stock_quantity'    => 'required|integer|min:0|max:999999',
            'stock_status'      => 'required|in:in_stock,out_of_stock,backorder',
            'weight'            => 'nullable|numeric|min:0|max:9999',
            'is_active'         => 'boolean',
            'is_featured'       => 'boolean',
            'is_digital'        => 'boolean',
            'meta_title'        => 'nullable|string|max:160',
            'meta_description'  => 'nullable|string|max:320',
            'images'            => 'nullable|array|max:10',
            'images.*'          => 'image|mimes:jpeg,jpg,png,webp|max:5120',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'              => strip_tags($this->input('name', '')),
            'short_description' => strip_tags($this->input('short_description', '')),
            'description'       => $this->input('description') ? strip_tags($this->input('description'), '<p><br><strong><em><ul><ol><li><h2><h3><a><blockquote>') : null,
            'meta_title'        => strip_tags($this->input('meta_title', '')),
            'meta_description'  => strip_tags($this->input('meta_description', '')),
            'is_active'         => $this->boolean('is_active', true),
            'is_featured'       => $this->boolean('is_featured'),
            'is_digital'        => $this->boolean('is_digital'),
        ]);
    }

    public function messages(): array
    {
        return [
            'name.required'          => 'O nome do produto é obrigatório.',
            'price.required'         => 'O preço é obrigatório.',
            'price.min'              => 'O preço deve ser maior que zero.',
            'compare_price.gt'       => 'O preço de comparação deve ser maior que o preço de venda.',
            'stock_quantity.required' => 'A quantidade em estoque é obrigatória.',
            'category_id.required'   => 'A categoria é obrigatória.',
            'images.*.image'         => 'Cada arquivo deve ser uma imagem válida.',
            'images.*.max'           => 'Cada imagem deve ter no máximo 5MB.',
        ];
    }
}
