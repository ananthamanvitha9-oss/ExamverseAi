<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $courses = [
            [
                'title' => 'UPSC Prelims Masterclass 2027',
                'description' => 'A comprehensive program covering General Studies Paper 1 and 2. Includes detailed lectures on History, Polity, Geography, Economy, and Science & Tech.',
                'instructor' => 'Dr. A. Sharma (Ex-IAS)',
                'price' => 4999.00,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'CSAT Aptitude Crash Course',
                'description' => 'Master quantitative aptitude, logical reasoning, and reading comprehension to comfortably clear the CSAT qualifying cutoff.',
                'instructor' => 'Prof. R. Kumar',
                'price' => 1999.00,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Mains Answer Writing Mastery',
                'description' => 'Learn the art of structuring perfect answers for GS Papers 1-4. Includes ethics case studies and essay writing frameworks.',
                'instructor' => 'Smriti Rao (Rank 12)',
                'price' => 2999.00,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1455309036818-605b90f14df8?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        DB::table('courses')->insert($courses);
    }
}
