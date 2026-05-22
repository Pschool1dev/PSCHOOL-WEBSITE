<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InscriptionSession extends Model
{
   protected $table = 'inscriptions_sessions'; 

    protected $fillable = [
        'user_id', 
        'session_id', 
        'parent_nom', 
        'parent_adresse', 
        'parent_contact', 
        'eleve_nom', 
        'eleve_age', 
        'eleve_niveau', 
        'eleve_etablissement', 
        'zone', 
        'session_choisie', 
        'source_information',
        'statut'
    ];
    public function user() {
        return $this->belongsTo(User::class);
    }
}
