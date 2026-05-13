<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // On ajoute parent_id comme une clé étrangère qui pointe vers la même table (users)
        $table->unsignedBigInteger('parent_id')->nullable()->after('id');
        $table->foreign('parent_id')->references('id')->on('users')->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropForeign(['parent_id']);
        $table->dropColumn('parent_id');
    });
}
};
