<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; // Important pour l'auth
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class Enfant extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'user_id', 
        'nom', 
        'prenom', 
        'username',      // NOUVEAU
        'password',      // NOUVEAU
        'access_token',  // NOUVEAU
        'age', 
        'niveau_etude', 
        'nom_ecole',      
        'localite_ecole', 
        'formations_interet',
        'is_active'
    ];

    protected $hidden = [
        'password', 'access_token',
    ];

    protected $casts = [
        'formations_interet' => 'array',
        'age' => 'integer',
        'is_active' => 'boolean',
    ];

    // Hachage automatique du mot de passe
    public function setPasswordAttribute($value)
    {
        if ($value) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}