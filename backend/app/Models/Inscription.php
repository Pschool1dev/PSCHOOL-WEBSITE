<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = [
        'user_id',
        'formation_id',
        'date_inscription',
        'statut',
        'montant_paye',
        'mode_paiement'
    ];

    protected $casts = [
        'date_inscription' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }
}