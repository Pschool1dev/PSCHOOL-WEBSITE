<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    //
    protected $fillable = [
    'titre',
    'description',
    'duree',
    'nb_modules',
    'formateur_id',
    'prix',
    'statut',
    'categorie',
    'public_cible', 
    'image',
    'public_id'
];
public function inscriptions()
{
    return $this->hasMany(Inscription::class);
}

public function users()
{
    return $this->belongsToMany(User::class, 'inscriptions');
}
public function formateur()
{
    // Une formation appartient à un utilisateur (le formateur)
    return $this->belongsTo(User::class, 'formateur_id');
}
public function cours()
{
    // Indique à Laravel qu'une formation a plusieurs cours
    return $this->hasMany(Cours::class, 'formation_id')->orderBy('ordre', 'asc');
}
}

