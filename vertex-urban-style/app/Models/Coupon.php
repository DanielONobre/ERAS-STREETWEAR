<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;
    protected $fillable = [
        'code', 'type', 'value', 'min_order_value',
        'max_uses', 'used_count', 'starts_at', 'expires_at', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value'           => 'decimal:2',
            'min_order_value' => 'decimal:2',
            'is_active'       => 'boolean',
            'starts_at'       => 'datetime',
            'expires_at'      => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    protected function typeLabel(): Attribute
    {
        return Attribute::make(get: fn () => match ($this->type) {
            'percentage'   => 'Percentual',
            'fixed'        => 'Valor fixo',
            'free_shipping' => 'Frete grátis',
            default        => $this->type,
        });
    }

    // ─── Business Methods ─────────────────────────────────────────────────────

    /**
     * Verifica se o cupom é aplicável (ativo, dentro da janela, com usos disponíveis).
     */
    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->starts_at && $this->starts_at->isFuture()) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) return false;
        return true;
    }

    /**
     * Calcula o desconto monetário sobre um subtotal.
     */
    public function getDiscountFor(float $subtotal): float
    {
        if ($this->min_order_value && $subtotal < (float) $this->min_order_value) {
            return 0.0;
        }

        return match ($this->type) {
            'percentage'    => round($subtotal * ((float) $this->value / 100), 2),
            'fixed'         => min((float) $this->value, $subtotal),
            'free_shipping' => 0.0,   // desconto no frete — tratado pelo PriceCalculatorService
            default         => 0.0,
        };
    }

    /**
     * Incrementa o contador de usos.
     */
    public function markAsUsed(): void
    {
        $this->increment('used_count');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }

    public function scopeByCode($query, string $code)
    {
        return $query->where('code', strtoupper(trim($code)));
    }
}
