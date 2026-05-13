<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::create('quizzes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
        $table->string('titre')->nullable(); 
        $table->integer('score_min')->default(70); 
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
