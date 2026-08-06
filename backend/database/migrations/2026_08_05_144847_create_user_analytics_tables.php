<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 'user_progress' table
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('progressable'); // E.g., App\Models\LearningMaterial, App\Models\Topic
            $table->enum('status', ['started', 'completed'])->default('started');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 'bookmarks' table
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('bookmarkable'); // E.g., App\Models\Question, App\Models\LearningMaterial
            $table->timestamps();
        });

        // 'study_plans' table
        Schema::create('study_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->json('plan_data'); // The AI-generated schedule
            $table->timestamps();
        });

        // 'ai_chat_histories' table
        Schema::dropIfExists('ai_chat_histories');
        Schema::create('ai_chat_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('prompt');
            $table->longText('response');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_chat_histories');
        Schema::dropIfExists('study_plans');
        Schema::dropIfExists('bookmarks');
        Schema::dropIfExists('user_progress');
    }
};
