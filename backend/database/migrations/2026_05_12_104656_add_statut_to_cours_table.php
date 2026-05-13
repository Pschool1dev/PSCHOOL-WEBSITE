<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('cours', function (Blueprint $table) {
        // 'actif' par défaut, sinon 'inactif'
        $table->string('statut')->default('actif')->after('ordre');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cours', function (Blueprint $table) {
            //
        });
    }
};
