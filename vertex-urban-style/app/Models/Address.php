<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'name', 'email', 'phone', 'cpf',
        'zip_code', 'street', 'number', 'complement',
        'neighborhood', 'city', 'state', 'country', 'is_default',
    ];

    protected function casts(): array
    {
        return ['is_default' => 'boolean'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFullAddressAttribute(): string
    {
        $complement = $this->complement ? ", {$this->complement}" : '';
        return "{$this->street}, {$this->number}{$complement} — {$this->neighborhood}, {$this->city}/{$this->state} — CEP {$this->zip_code}";
    }
}
