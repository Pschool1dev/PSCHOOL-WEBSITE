<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 1. On renomme 'name' en 'nom' (ou on l'ajoute s'il n'existe pas)
            // Si tu as déjà 'name', tu peux faire : $table->renameColumn('name', 'nom');
            // Sinon, on l'ajoute simplement :
            if (!Schema::hasColumn('users', 'nom')) {
                $table->string('nom')->after('id');
            }

            // 2. On ajoute 'admin' dans l'enum
            $table->enum('type', ['apprenant','formateur', 'parent', 'admin'])->default('apprenant')->after('password');
             $table->enum('role', ['user', 'formateur', 'admin'])->default('user');
            // Champs communs
            $table->string('telephone')->nullable()->after('email');
            $table->string('role')->default('user')->after('type');
            $table->string('username')->nullable();
            // Champs pour apprenant adulte
            $table->string('fonction')->nullable()->after('role');
            $table->json('formations_interet')->nullable()->after('fonction');
            
            // Champs pour parent d'élève
    
            $table->json('formations_enfant')->nullable()->after('localite_ecole');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nom',
                'username',
                'telephone',
                'type',
                'role',
                'fonction',
                'formations_interet',
                
                'formations_enfant',
            ]);
        });
    }
};