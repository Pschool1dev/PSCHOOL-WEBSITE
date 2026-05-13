<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['cours_id', 'titre', 'score_min'];

    // Un quiz appartient à un cours
    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    // Un quiz possède plusieurs questions
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
