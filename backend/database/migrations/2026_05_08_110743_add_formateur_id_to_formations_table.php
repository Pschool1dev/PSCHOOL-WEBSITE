<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('formations', function (Blueprint $table) {
      
        $table->foreignId('formateur_id')
              ->nullable()
              ->constrained('users')
              ->onDelete('set null'); 
    });
}

public function down()
{
    Schema::table('formations', function (Blueprint $table) {
      
        $table->dropForeign(['formateur_id']);
        $table->dropColumn('formateur_id');
    });
}
};
