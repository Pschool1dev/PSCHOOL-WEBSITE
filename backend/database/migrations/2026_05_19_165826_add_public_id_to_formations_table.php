<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPublicIdToFormationsTable extends Migration
{
    public function up()
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->string('public_id')->nullable()->after('image');
        });
    }

    public function down()
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn('public_id');
        });
    }
}