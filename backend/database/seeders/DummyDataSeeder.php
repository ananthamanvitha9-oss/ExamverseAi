<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Exam;
use App\Models\Subject;
use App\Models\Chapter;
use App\Models\Lesson;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        // Exams
        $upscId = DB::table('exams')->insertGetId(['name' => 'UPSC Civil Services', 'description' => 'Top tier administrative exam', 'duration' => 180, 'category' => 'Civil Services', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()]);
        $sscId = DB::table('exams')->insertGetId(['name' => 'SSC CGL', 'description' => 'Staff Selection Commission', 'duration' => 120, 'category' => 'Government', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()]);
        $bankId = DB::table('exams')->insertGetId(['name' => 'Banking (IBPS/SBI)', 'description' => 'Banking sector exams', 'duration' => 120, 'category' => 'Banking', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()]);

        // Subjects for UPSC
        $historyId = DB::table('subjects')->insertGetId(['exam_id' => $upscId, 'name' => 'History', 'description' => 'Indian History & Culture', 'created_at' => now(), 'updated_at' => now()]);
        $polityId = DB::table('subjects')->insertGetId(['exam_id' => $upscId, 'name' => 'Polity', 'description' => 'Indian Constitution & Governance', 'created_at' => now(), 'updated_at' => now()]);

        // Chapters for History
        $ancientId = DB::table('chapters')->insertGetId(['subject_id' => $historyId, 'name' => 'Ancient India', 'chapter_number' => 1, 'created_at' => now(), 'updated_at' => now()]);
        $modernId = DB::table('chapters')->insertGetId(['subject_id' => $historyId, 'name' => 'Modern History', 'chapter_number' => 2, 'created_at' => now(), 'updated_at' => now()]);

        // Lessons
        DB::table('lessons')->insert([
            ['chapter_id' => $ancientId, 'name' => 'Indus Valley Civilization', 'video_url' => 'https://www.youtube.com/watch?v=dummy', 'duration' => 30, 'created_at' => now(), 'updated_at' => now()],
            ['chapter_id' => $ancientId, 'name' => 'Vedic Period', 'video_url' => 'https://www.youtube.com/watch?v=dummy', 'duration' => 45, 'created_at' => now(), 'updated_at' => now()],
            ['chapter_id' => $modernId, 'name' => 'Revolt of 1857', 'video_url' => 'https://www.youtube.com/watch?v=dummy', 'duration' => 60, 'created_at' => now(), 'updated_at' => now()]
        ]);

        // Subjects for SSC
        $quantId = DB::table('subjects')->insertGetId(['exam_id' => $sscId, 'name' => 'Quantitative Aptitude', 'description' => 'Maths and Numbers', 'created_at' => now(), 'updated_at' => now()]);
        
        $algebraId = DB::table('chapters')->insertGetId(['subject_id' => $quantId, 'name' => 'Algebra', 'chapter_number' => 1, 'created_at' => now(), 'updated_at' => now()]);
        
        DB::table('lessons')->insert([
            ['chapter_id' => $algebraId, 'name' => 'Basic Equations', 'video_url' => 'https://www.youtube.com/watch?v=dummy', 'duration' => 25, 'created_at' => now(), 'updated_at' => now()]
        ]);

        // Mock Tests
        $mockId = DB::table('mock_tests')->insertGetId([
            'exam_id' => $upscId,
            'title' => 'UPSC Prelims Full Mock 1',
            'description' => 'Complete coverage of GS Paper 1',
            'duration_minutes' => 120,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('questions')->insert([
            [
                'mock_test_id' => $mockId,
                'question_text' => 'Which of the following sites of Indus Valley Civilization is located in India?',
                'option_a' => 'Harappa',
                'option_b' => 'Mohenjodaro',
                'option_c' => 'Lothal',
                'option_d' => 'Mehrgarh',
                'correct_option' => 'C',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'mock_test_id' => $mockId,
                'question_text' => 'Who among the following was the founder of the Indian National Congress?',
                'option_a' => 'W.C. Banerjee',
                'option_b' => 'A.O. Hume',
                'option_c' => 'Mahatma Gandhi',
                'option_d' => 'Annie Besant',
                'correct_option' => 'B',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
        
        // News Articles (Current Affairs)
        DB::table('news_articles')->insert([
            [
                'title' => 'G20 Summit Highlights',
                'content' => 'The recent G20 summit concluded with major agreements on climate change.',
                'category' => 'Daily',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'New Economic Policy Announced',
                'content' => 'The government has announced a new economic policy focusing on digital growth.',
                'category' => 'Weekly',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
