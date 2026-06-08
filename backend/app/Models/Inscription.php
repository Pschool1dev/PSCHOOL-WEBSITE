<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = [
    'user_id', 'formation_id', 'date_inscription', 'statut', 
    'statut_paiement', 'transaction_id', 'montant_paye', 
    'mode_paiement', 'progression','paiement_type',
        'cinetpay_transaction_id'
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
    // Dans la classe Inscription, ajoute :

    public function cinetpayTransaction()
    {
        return $this->belongsTo(CinetpayTransaction::class);
    }

  
}