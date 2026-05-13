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
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'nom_enfant', 
            'niveau_etude', 
            'ecole', 
            'localite_ecole', 
            'formations_enfant'
        ]);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('users', function (Blueprint $table) {
        // Au cas où tu voudrais revenir en arrière
        $table->string('nom_enfant')->nullable();
        $table->string('niveau_etude')->nullable();
        $table->string('ecole')->nullable();
        $table->string('localite_ecole')->nullable();
        $table->json('formations_enfant')->nullable();
    });
    }
};
