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
        // Add new advanced fields to existing 'exams' table
        Schema::table('exams', function (Blueprint $table) {
            $table->text('overview')->nullable();
            // $table->json('eligibility')->nullable(); // Already exists as string in the base migration
            $table->json('exam_pattern')->nullable();
            $table->longText('official_syllabus')->nullable();
            $table->json('mock_test_structure')->nullable();
            $table->text('revision_strategy')->nullable();
            $table->json('daily_plan')->nullable();
            $table->json('weekly_plan')->nullable();
            $table->json('monthly_plan')->nullable();
        });

        // Add new advanced fields to existing 'subjects' table
        Schema::table('subjects', function (Blueprint $table) {
            $table->integer('weightage_percentage')->nullable();
        });

        // Create 'units' table (Level 2)
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Add unit_id to 'chapters' table and make subject_id nullable (as chapters now belong to units)
        Schema::table('chapters', function (Blueprint $table) {
            $table->foreignId('unit_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('order')->default(0);
            // We keep subject_id for backwards compatibility or drop it later
        });

        // Create 'topics' table (Level 4)
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('learning_objectives')->nullable();
            $table->json('ncert_references')->nullable();
            $table->json('standard_books')->nullable();
            $table->string('difficulty_level')->nullable(); // Beginner, Intermediate, Advanced
            $table->integer('estimated_time_minutes')->nullable();
            $table->json('tags')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Create 'sub_topics' table (Level 5)
        Schema::create('sub_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Create 'learning_materials' table (Level 6 - Content)
        Schema::create('learning_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_topic_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['note', 'video', 'mcq', 'pyq', 'flashcard', 'ai_prompt', 'quiz']);
            $table->string('title');
            $table->longText('content_data')->nullable(); // markdown, url, etc.
            $table->json('metadata')->nullable(); // specific options for mcqs, ai prompts
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_materials');
        Schema::dropIfExists('sub_topics');
        Schema::dropIfExists('topics');
        
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropColumn('unit_id');
            $table->dropColumn('order');
        });

        Schema::dropIfExists('units');

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn('weightage_percentage');
        });

        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn([
                'overview', 'eligibility', 'exam_pattern', 'official_syllabus', 
                'mock_test_structure', 'revision_strategy', 'daily_plan', 
                'weekly_plan', 'monthly_plan'
            ]);
        });
    }
};
