<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = [
        'formation_id', 
        'titre', 
        'description', 
        'contenu_url', 
        'ordre',
        'statut'];


public function formation()
{
    return $this->belongsTo(Formation::class);
}
}
