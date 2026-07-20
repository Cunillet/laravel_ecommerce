<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
    /** @use HasFactory<\Database\Factories\CartFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'guest_expires_at',
    ];

    protected function casts(): array
    {
        return [
            'guest_expires_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForGuest($query, string $sessionId): void
    {
        $query->whereNull('user_id')->where('session_id', $sessionId);
    }

    public function scopeForUser($query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    public function scopeExpiredGuests($query): void
    {
        $query->whereNull('user_id')
            ->where('guest_expires_at', '<', now());
    }

    public function isExpiredGuest(): bool
    {
        return $this->user_id === null
            && $this->guest_expires_at
            && $this->guest_expires_at->isPast();
    }
}
