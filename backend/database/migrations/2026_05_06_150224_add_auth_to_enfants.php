<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::table('enfants', function (Blueprint $table) {
        
        $table->string('username')->nullable()->after('prenom');
        $table->string('password')->nullable()->after('username');
        $table->string('access_token', 64)->nullable()->after('password');
        $table->boolean('is_active')->default(true)->after('access_token');
    });
}

public function down()
{
    Schema::table('enfants', function (Blueprint $table) {
        $table->dropColumn(['username', 'password', 'access_token', 'is_active']);
    });
}
};
