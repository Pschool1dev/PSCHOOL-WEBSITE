<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('enfants', function (Blueprint $table) {
        $table->id();
        // Clé étrangère vers le parent (table users)
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        
        // Informations personnelles
        $table->string('nom');
        $table->string('prenom');
        $table->integer('age')->nullable();
        
        // Connexion (Authentification de l'enfant)
        $table->string('username')->unique();
        $table->string('password');
        $table->string('access_token', 64)->nullable()->unique();
        
        // Scolarité
        $table->string('niveau_etude')->nullable();
        $table->string('nom_ecole')->nullable();
        $table->string('localite_ecole')->nullable();
        
        // Préférences et État
        $table->json('formations_interet')->nullable(); // Utilise JSON pour le cast 'array'
        $table->boolean('is_active')->default(true);
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enfants');
    }
};
