<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Price extends Model
{
    /** @use HasFactory<\Database\Factories\PriceFactory> */
    use HasFactory;
    protected $fillable = [
        'product_id',
        'amount',
        'type',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getPriceAttribute(): ?string
    {
        return $this->amount;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeStandard(Builder $query): Builder
    {
        return $query->where('type', 'standard');
    }

    public function scopeSale(Builder $query): Builder
    {
        return $query->where('type', 'sale');
    }
}
