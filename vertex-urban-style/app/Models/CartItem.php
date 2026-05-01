<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = ['cart_id', 'product_id', 'variant_id', 'quantity'];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function cart(): BelongsTo    { return $this->belongsTo(Cart::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'variant_id'); }

    // ─── Accessors ────────────────────────────────────────────────────────────

    public function getLineTotalAttribute(): float
    {
        $price = $this->variant?->effective_price ?? (float) $this->product->price;
        return round($price * $this->quantity, 2);
    }

    public function getUnitPriceAttribute(): float
    {
        return $this->variant?->effective_price ?? (float) $this->product->price;
    }
}
