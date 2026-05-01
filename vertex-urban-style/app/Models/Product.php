<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'brand_id', 'name', 'slug', 'sku',
        'description', 'short_description',
        'price', 'compare_price', 'cost_price',
        'stock_quantity', 'stock_status', 'weight',
        'is_active', 'is_featured', 'is_digital',
        'meta_title', 'meta_description', 'views',
    ];

    protected $appends = [
        'formatted_price',
        'discount_percentage',
        'primary_image',
        'is_on_sale',
        'average_rating',
    ];

    protected function casts(): array
    {
        return [
            'price'          => 'decimal:2',
            'compare_price'  => 'decimal:2',
            'cost_price'     => 'decimal:2',
            'is_active'      => 'boolean',
            'is_featured'    => 'boolean',
            'is_digital'     => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = 'VTX-' . strtoupper(Str::random(8));
            }
        });
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true)->latest();
    }

    public function allReviews(): HasMany
    {
        return $this->hasMany(Review::class)->latest();
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => 'R$ ' . number_format((float) $this->price, 2, ',', '.'),
        );
    }

    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: fn () => ($this->compare_price && $this->compare_price > $this->price)
                ? (int) round((1 - $this->price / $this->compare_price) * 100)
                : 0,
        );
    }

    protected function primaryImage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->relationLoaded('images')
                ? ($this->images->where('is_primary', true)->first()?->url
                    ?? $this->images->first()?->url
                    ?? null)
                : $this->images()->where('is_primary', true)->value('url'),
        );
    }

    protected function isOnSale(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->compare_price !== null && (float) $this->compare_price > (float) $this->price,
        );
    }

    protected function averageRating(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->relationLoaded('reviews')
                ? round($this->reviews->avg('rating') ?? 0, 1)
                : round($this->reviews()->avg('rating') ?? 0, 1),
        );
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_status', 'in_stock')->where('stock_quantity', '>', 0);
    }

    public function scopeOnSale($query)
    {
        return $query->whereNotNull('compare_price')
                     ->whereColumn('price', '<', 'compare_price')
                     ->where('is_active', true);
    }

    public function scopeByCategory($query, string $slug)
    {
        return $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
    }

    public function scopeByBrand($query, string $slug)
    {
        return $query->whereHas('brand', fn ($q) => $q->where('slug', $slug));
    }

    public function scopePriceRange($query, ?float $min, ?float $max)
    {
        if ($min !== null) $query->where('price', '>=', $min);
        if ($max !== null) $query->where('price', '<=', $max);
        return $query;
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(fn ($q) =>
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('short_description', 'like', "%{$term}%")
              ->orWhere('sku', 'like', "%{$term}%")
              ->orWhereHas('brand', fn ($bq) => $bq->where('name', 'like', "%{$term}%"))
        );
    }

    /**
     * Busca FULLTEXT MySQL (colunas: name, description, sku).
     * Requer migration 2026_01_01_000019 (índice FULLTEXT).
     * Fallback automático para LIKE em drivers sem suporte (SQLite).
     */
    public function scopeFullTextSearch($query, string $term)
    {
        if (\Illuminate\Support\Facades\DB::getDriverName() === 'mysql') {
            $safe = str_replace(['+', '-', '<', '>', '(', ')', '~', '*', '"', '@'], '', $term);
            return $query->whereRaw(
                'MATCH(name, description, sku) AGAINST(? IN BOOLEAN MODE)',
                ["+{$safe}*"]
            );
        }

        // Fallback para SQLite / testes
        return $query->where(fn ($q) =>
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%")
              ->orWhere('sku', 'like', "%{$term}%")
        );
    }

    // ─── Business Methods ─────────────────────────────────────────────────────

    /**
     * Decrementa estoque e atualiza stock_status automaticamente.
     */
    public function decrementStock(int $qty): void
    {
        $this->decrement('stock_quantity', $qty);

        $status = $this->stock_quantity <= 0 ? 'out_of_stock' : 'in_stock';
        $this->update(['stock_status' => $status]);
    }

    /**
     * Verifica se há estoque disponível para a quantidade solicitada.
     */
    public function isAvailable(int $qty = 1): bool
    {
        return $this->is_active
            && $this->stock_status !== 'out_of_stock'
            && $this->stock_quantity >= $qty;
    }

    /**
     * Retorna a variante que possui exatamente os attributeValues informados.
     * $attrs = [attribute_id => attribute_value_id, ...]
     */
    public function getVariantByAttributes(array $attrs): ?ProductVariant
    {
        return $this->variants()
            ->whereHas('attributeValues', function ($q) use ($attrs) {
                $q->whereIn('attribute_value_id', array_values($attrs));
            }, '=', count($attrs))
            ->first();
    }
}
