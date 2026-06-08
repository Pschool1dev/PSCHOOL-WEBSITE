<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{public function up(): void
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('transaction_id', 150)->unique(); // Longueur limitée pour éviter l'erreur 1071
        $table->decimal('amount', 10, 2);
        $table->string('customer_email');
        $table->string('status')->default('PENDING');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
