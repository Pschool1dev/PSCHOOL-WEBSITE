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
    Schema::create('formations', function (Blueprint $table) {
        $table->id();
        
        // Identifiant unique pour le stockage Cloudinary ou autre (public_id)
        $table->string('public_id')->nullable();
        
        // REGLAGE DU BUG : On utilise string au lieu de enum
        $table->string('mode_formation')->default('elearning'); // 'elearning' ou 'session'
        
        $table->string('titre');
        $table->text('description');
        $table->string('duree');
        $table->integer('nb_modules')->default(0);
        
        // Liaison avec le formateur (table users)
        $table->foreignId('formateur_id')->nullable()->constrained('users')->onDelete('set null');
        
        $table->decimal('prix', 10, 2)->default(0);
        $table->string('statut')->default('actif');
        $table->string('categorie')->nullable();
        $table->string('public_cible')->nullable();
        $table->string('image')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
