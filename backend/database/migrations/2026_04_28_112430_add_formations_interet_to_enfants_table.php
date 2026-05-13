<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFormationsInteretToEnfantsTable extends Migration
{
    public function up()
    {
        Schema::table('enfants', function (Blueprint $table) {
            if (!Schema::hasColumn('enfants', 'formations_interet')) {
                $table->json('formations_interet')->nullable()->after('localite_ecole');
            }
        });
    }

    public function down()
    {
        Schema::table('enfants', function (Blueprint $table) {
            $table->dropColumn('formations_interet');
        });
    }
}