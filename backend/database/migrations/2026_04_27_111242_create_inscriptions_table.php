<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::create('inscriptions', function (Blueprint $table) {
        $table->id();
        
        // Liens vers l'utilisateur et la formation
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('formation_id')->constrained()->onDelete('cascade');
        
        $table->date('date_inscription');
        
        // Statut de l'inscription (en_attente, active, terminee, annulee)
        $table->string('statut')->default('active');
        
        // Informations financières
        $table->decimal('montant_paye', 10, 2)->default(0);
        $table->string('mode_paiement')->nullable(); // Orange Money, Moov Money, Espèces
        $table->string('payment_status')->default('pending'); // pending, completed, failed
        
        // Suivi pédagogique (si besoin)
        $table->integer('progression')->default(0); // Pourcentage de complétion (0 à 100)
        
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('inscriptions');
    }
};