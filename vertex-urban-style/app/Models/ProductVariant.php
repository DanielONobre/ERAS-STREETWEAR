<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'sku', 'price', 'stock_quantity', 'image_id'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(ProductImage::class, 'image_id');
    }

    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(
            AttributeValue::class,
            'product_variant_attribute_values',
            'variant_id',
            'attribute_value_id'
        )->with('attribute');
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    /**
     * Retorna o preço próprio da variante, ou herda o preço do produto pai.
     */
    protected function effectivePrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->price !== null
                ? (float) $this->price
                : (float) ($this->relationLoaded('product')
                    ? $this->product->price
                    : $this->product()->value('price')),
        );
    }

    /**
     * Concatena os valores dos atributos: "P / Preto", "GG / Verde Militar".
     */
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->relationLoaded('attributeValues')) {
                    return $this->attributeValues
                        ->sortBy(fn ($av) => $av->attribute->name)
                        ->pluck('value')
                        ->join(' / ');
                }
                return $this->attributeValues()
                    ->join('attributes', 'attributes.id', '=', 'attribute_values.attribute_id')
                    ->orderBy('attributes.name')
                    ->pluck('attribute_values.value')
                    ->join(' / ');
            },
        );
    }

    protected function inStock(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->stock_quantity > 0,
        );
    }

    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => 'R$ ' . number_format($this->effective_price, 2, ',', '.'),
        );
    }

    // ─── Business Methods ─────────────────────────────────────────────────────

    public function decrementStock(int $qty): void
    {
        $this->decrement('stock_quantity', $qty);
    }

    public function isAvailable(int $qty = 1): bool
    {
        return $this->stock_quantity >= $qty;
    }
}
