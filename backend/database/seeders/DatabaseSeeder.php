<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
  
    public function run(): void
    {
      
        User::updateOrCreate(
            ['email' => 'admin@pschool.pro'], 
            [   'nom'      => 'Administrateur Principal',
               
                'password' => Hash::make('admin2026P@'),
                'type' => 'admin',
            ]
        );
        
    }
}