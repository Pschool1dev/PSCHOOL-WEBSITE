<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CinetpayTransaction extends Model
{
    protected $table = 'cinetpay_transactions';
    
    protected $fillable = [
        'transaction_id',
        'inscription_id',
        'user_id',
        'amount',
        'currency',
        'status',
        'customer_phone',
        'customer_email',
        'metadata',
        'payment_method',
        'paid_at'
    ];
    
    protected $casts = [
        'metadata' => 'array',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2'
    ];
    
    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}