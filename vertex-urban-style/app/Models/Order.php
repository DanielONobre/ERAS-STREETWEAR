<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'address_id', 'coupon_id',
        'status', 'payment_status', 'payment_method', 'payment_id',
        'subtotal', 'discount', 'shipping_cost', 'total',
        'shipping_method', 'tracking_code', 'notes',
        'shipped_at', 'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'      => 'decimal:2',
            'discount'      => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'total'         => 'decimal:2',
            'shipped_at'    => 'datetime',
            'delivered_at'  => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo    { return $this->belongsTo(User::class); }
    public function address(): BelongsTo { return $this->belongsTo(Address::class); }
    public function coupon(): BelongsTo  { return $this->belongsTo(Coupon::class); }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    protected function statusLabel(): Attribute
    {
        return Attribute::make(get: fn () => match ($this->status) {
            'pending'    => 'Aguardando pagamento',
            'confirmed'  => 'Confirmado',
            'processing' => 'Em preparação',
            'shipped'    => 'Enviado',
            'delivered'  => 'Entregue',
            'cancelled'  => 'Cancelado',
            'refunded'   => 'Reembolsado',
            default      => $this->status,
        });
    }

    protected function statusColor(): Attribute
    {
        return Attribute::make(get: fn () => match ($this->status) {
            'pending'    => 'warning',
            'confirmed'  => 'primary',
            'processing' => 'primary',
            'shipped'    => 'accent',
            'delivered'  => 'success',
            'cancelled'  => 'danger',
            'refunded'   => 'neutral',
            default      => 'neutral',
        });
    }

    protected function paymentStatusLabel(): Attribute
    {
        return Attribute::make(get: fn () => match ($this->payment_status) {
            'pending'  => 'Pendente',
            'paid'     => 'Pago',
            'failed'   => 'Falhou',
            'refunded' => 'Reembolsado',
            default    => $this->payment_status,
        });
    }

    protected function formattedTotal(): Attribute
    {
        return Attribute::make(
            get: fn () => 'R$ ' . number_format((float) $this->total, 2, ',', '.'),
        );
    }

    // ─── Business Methods ─────────────────────────────────────────────────────

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    public function canBeRefunded(): bool
    {
        return $this->payment_status === 'paid'
            && in_array($this->status, ['delivered', 'cancelled']);
    }

    public function markAsShipped(string $trackingCode): void
    {
        $this->update([
            'status'       => 'shipped',
            'tracking_code' => $trackingCode,
            'shipped_at'   => now(),
        ]);
    }

    public function markAsDelivered(): void
    {
        $this->update([
            'status'       => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }
}
