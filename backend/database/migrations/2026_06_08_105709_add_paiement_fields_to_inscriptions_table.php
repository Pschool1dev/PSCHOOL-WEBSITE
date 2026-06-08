<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            // 1. Ajouter le type de paiement (simulation ou cinetpay)
            $table->enum('paiement_type', ['simulation', 'cinetpay'])->default('simulation')->after('statut_paiement');
            
            // 2. Ajouter la clé étrangère vers cinetpay_transactions
            $table->foreignId('cinetpay_transaction_id')
                  ->nullable()
                  ->after('paiement_type')
                  ->constrained('cinetpay_transactions')
                  ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            $table->dropForeign(['cinetpay_transaction_id']);
            $table->dropColumn(['paiement_type', 'cinetpay_transaction_id']);
        });
    }
};