<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->integer('age')->nullable()->change();
        $table->string('nom_ecole')->nullable()->change();
        $table->string('niveau_etude')->nullable()->change();
        $table->string('localite')->nullable()->change();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
