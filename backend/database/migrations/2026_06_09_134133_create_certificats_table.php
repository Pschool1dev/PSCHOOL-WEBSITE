<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('certificats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('formation_id')->constrained()->onDelete('cascade');
            $table->string('numero_certificat', 50)->unique();
            $table->string('fichier_pdf')->nullable();
            $table->timestamp('date_delivrance');
            $table->enum('statut', ['valide', 'annule', 'expire'])->default('valide');
            $table->string('qr_code')->nullable();
            $table->integer('note')->nullable();
            $table->timestamps();
            
            // Index pour les recherches
            $table->index(['user_id', 'formation_id']);
            $table->index('numero_certificat');
        });
    }

    public function down()
    {
        Schema::dropIfExists('certificats');
    }
};