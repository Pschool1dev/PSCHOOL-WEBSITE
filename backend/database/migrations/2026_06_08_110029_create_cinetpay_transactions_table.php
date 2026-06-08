<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cinetpay_transactions', function (Blueprint $table) {
            $table->id();
            // Réduire la longueur de la colonne pour éviter l'erreur 1071
            $table->string('transaction_id', 100)->unique();
            $table->foreignId('inscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('XAF');
            $table->enum('status', ['pending', 'paid', 'failed', 'cancelled'])->default('pending');
            $table->string('customer_phone', 20);
            $table->string('customer_email', 100);
            $table->json('metadata')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cinetpay_transactions');
    }
};