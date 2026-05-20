<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
{
    Schema::create('cours', function (Blueprint $table) {
        $table->id();
        // La liaison avec la table formations
        $table->foreignId('formation_id')->constrained()->onDelete('cascade');
        
        $table->string('titre');
        $table->text('description')->nullable();
        
        // URL de la vidéo ou du document (ex: YouTube, Vimeo ou stockage local)
        $table->string('contenu_url')->nullable();
        
        // Pour organiser l'affichage (Cours 1, Cours 2, etc.)
        $table->integer('ordre')->default(0);
        
        // Statut pour masquer/afficher un cours précis
        $table->string('statut')->default('publié'); 
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
