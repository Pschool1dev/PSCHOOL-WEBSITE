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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('formation_id')->constrained()->onDelete('cascade');
            $table->date('date_inscription');
            $table->enum('statut', ['en_attente', 'confirmee', 'annulee', 'terminee'])->default('en_attente');
            $table->decimal('montant_paye', 10, 2)->nullable();
            $table->string('mode_paiement')->nullable();
            $table->timestamps();
            
            // Empêcher les doublons
            $table->unique(['user_id', 'formation_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('inscriptions');
    }
};