<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::create('services', function (Blueprint $table) {
        $table->id();
        
        // Identifiant pour Cloudinary/Stockage
        $table->string('public_id')->nullable();
        
        $table->string('titre');
        $table->text('description');
        $table->string('image')->nullable();
        
        // Statut du service (ex: actif, maintenance, bientôt)
        $table->string('statut')->default('actif');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
