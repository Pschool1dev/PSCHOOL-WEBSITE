<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $fillable = ['question_id', 'texte_option', 'is_correct'];

    // On s'assure que is_correct est toujours traité comme un vrai booléen
    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
