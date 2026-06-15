<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificat extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date_delivrance' => 'datetime',
        'note' => 'integer'
    ];

    public function inscription(): BelongsTo
    {
        return $this->belongsTo(Inscription::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function getStatutTexteAttribute(): string
    {
        return match($this->statut) {
            'valide' => 'Validé',
            'annule' => 'Annulé',
            'expire' => 'Expiré',
            default => 'Inconnu'
        };
    }

    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'valide' => 'green',
            'annule' => 'red',
            'expire' => 'orange',
            default => 'gray'
        };
    }
}