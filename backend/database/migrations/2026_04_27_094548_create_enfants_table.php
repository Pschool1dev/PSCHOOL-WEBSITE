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
        // La clé étrangère qui lie l'enfant au compte du parent
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        
        $table->string('nom');
        $table->string('prenom');
        $table->integer('age');
        $table->string('niveau_etude');
        $table->string('nom_ecole');
        $table->string('localite_ecole');
     
        $table->json('formations_interet')->nullable(); 
        
        // Statut de l'inscription (en cours, terminé, etc.)
        $table->string('statut')->default('En cours'); 
        
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
