<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::create('cours', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
        
        $table->string('titre');
        $table->text('description')->nullable();
        $table->string('contenu_url')->nullable(); 
        $table->integer('ordre')->default(1); 
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
