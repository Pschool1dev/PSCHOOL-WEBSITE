<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::create('inscriptions_sessions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->nullable()->constrained(); // Nullable si inscription rapide
        $table->string('session_id'); // ID de la session choisie
        
        // Infos Parent
        $table->string('parent_nom');
        $table->string('parent_adresse');
        $table->string('parent_contact');
        
        // Infos Élève
        $table->string('eleve_nom');
        $table->integer('eleve_age');
        $table->string('eleve_niveau');
        $table->string('eleve_etablissement');
        
        // Logistique & Marketing
        $table->string('zone');
        $table->string('session_choisie'); // Ex: Juin-Juillet
        $table->string('source_information');
        
        // Paiement
        $table->string('statut')->default('en_attente'); // en_attente, paye
        $table->decimal('montant', 10, 2);
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions_sessions');
    }
};
