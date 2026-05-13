<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['quiz_id', 'texte_question', 'explication'];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    // Une question possède plusieurs options (réponses possibles)
    public function options()
    {
        return $this->hasMany(Option::class);
    }
}
