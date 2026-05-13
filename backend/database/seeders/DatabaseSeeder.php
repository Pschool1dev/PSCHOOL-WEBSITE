<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // On utilise updateOrCreate pour éviter les erreurs si l'admin existe déjà
        User::updateOrCreate(
            ['email' => 'admin@pschool.pro'], // Condition de recherche
            [   'nom'      => 'Administrateur Principal',
               
                'password' => Hash::make('admin2026P@'),
                'type' => 'admin',
            ]
        );
        
    }
}