<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Notifications\CustomResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

  
    protected $fillable = [
        'username',
        'nom',
        'email',
        'telephone',
        'password',
        'type',      // 'apprenant' ou 'parent'
        'role',      // 'user', 'admin', 'formateur'
        'parent_id', 
        'age',
        'nom_ecole',
        'niveau_etude',
        'formations_interet', 
        'localite',
        'statut'
    ];

    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'formations_interet' => 'array',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function enfants(): HasMany
    {
        // On lie l'utilisateur à lui-même via parent_id
        return $this->hasMany(User::class, 'parent_id');
    }

    
 public function parent() {
    return $this->belongsTo(User::class, 'parent_id');
}

   
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class, 'user_id');
    }

   
    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'inscriptions', 'user_id', 'formation_id')
                    ->withTimestamps(); 
    }
    public function sendPasswordResetNotification($token)
{
    $this->notify(new CustomResetPassword($token));
}


public function certificats()
{
    return $this->hasMany(Certificat::class);
}
}