<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdvancedDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Add Users for Leaderboard
        $names = ['Aarav Patel', 'Priya Sharma', 'Rahul Kumar', 'Neha Gupta', 'Aditya Singh', 'Kavya Desai', 'Rohan Verma', 'Ananya Reddy', 'Vikram Malhotra', 'Sneha Iyer'];
        
        foreach ($names as $index => $name) {
            DB::table('users')->insert([
                'full_name' => $name,
                'email' => 'user' . $index . '@example.com',
                'password' => Hash::make('password123'),
                'points' => rand(100, 5000), // Random points for leaderboard
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Add more comprehensive Courses
        $jeeId = DB::table('exams')->insertGetId([
            'name' => 'IIT JEE Advanced',
            'description' => 'Engineering entrance exam',
            'duration' => 180,
            'category' => 'Engineering',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $physicsId = DB::table('subjects')->insertGetId(['exam_id' => $jeeId, 'name' => 'Physics', 'description' => 'Mechanics & Electromagnetism', 'created_at' => now(), 'updated_at' => now()]);
        $kinematicsId = DB::table('chapters')->insertGetId(['subject_id' => $physicsId, 'name' => 'Kinematics', 'chapter_number' => 1, 'created_at' => now(), 'updated_at' => now()]);
        
        DB::table('lessons')->insert([
            ['chapter_id' => $kinematicsId, 'name' => 'Motion in 1D', 'video_url' => 'https://www.youtube.com/watch?v=2ebJgviKcz4', 'duration' => 45, 'created_at' => now(), 'updated_at' => now()],
            ['chapter_id' => $kinematicsId, 'name' => 'Projectile Motion', 'video_url' => 'https://www.youtube.com/watch?v=2ebJgviKcz4', 'duration' => 60, 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 3. Add more mock tests
        $mockId2 = DB::table('mock_tests')->insertGetId([
            'exam_id' => $jeeId,
            'title' => 'JEE Advanced Physics Full Test',
            'description' => 'Complete coverage of Physics Syllabus',
            'duration_minutes' => 180,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('questions')->insert([
            [
                'mock_test_id' => $mockId2,
                'question_text' => 'A particle moves in a circle of radius R with constant speed v. What is its acceleration?',
                'option_a' => 'Zero',
                'option_b' => 'v^2 / R',
                'option_c' => 'v / R',
                'option_d' => 'v^2 * R',
                'correct_option' => 'B',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
