<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    public const UPDATED_AT = null; // sem updated_at

    protected $fillable = [
        'user_id',
        'subject_type',
        'subject_id',
        'action',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    // ─── Factories ────────────────────────────────────────────────────────────

    /**
     * Registra uma ação de administrador.
     */
    public static function record(
        string $action,
        Model $subject,
        array $oldValues = [],
        array $newValues = []
    ): self {
        return self::create([
            'user_id'      => auth()->id(),
            'subject_type' => get_class($subject),
            'subject_id'   => $subject->getKey(),
            'action'       => $action,
            'old_values'   => $oldValues,
            'new_values'   => $newValues,
            'ip_address'   => request()->ip(),
            'user_agent'   => request()->userAgent(),
        ]);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBySubject($query, string $type, int $id)
    {
        return $query->where('subject_type', $type)->where('subject_id', $id);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    public function getSubjectLabelAttribute(): string
    {
        return class_basename($this->subject_type) . ' #' . $this->subject_id;
    }
}
