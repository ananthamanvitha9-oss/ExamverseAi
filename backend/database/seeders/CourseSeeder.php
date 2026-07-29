<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\Subject;
use App\Models\Chapter;
use App\Models\Lesson;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $upsc = Exam::create([
            'name' => 'UPSC Civil Services',
            'description' => 'Comprehensive preparation for IAS, IPS, and IFS.',
            'duration' => 120,
            'eligibility' => 'Graduate',
            'category' => 'Civil Services',
            'status' => 'active'
        ]);

        $polity = Subject::create([
            'exam_id' => $upsc->id,
            'name' => 'Indian Polity'
        ]);

        $chapter1 = Chapter::create([
            'subject_id' => $polity->id,
            'name' => 'Fundamental Rights'
        ]);

        Lesson::create([
            'chapter_id' => $chapter1->id,
            'name' => 'Right to Equality',
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'duration' => 15
        ]);

        Lesson::create([
            'chapter_id' => $chapter1->id,
            'name' => 'Article 21 Explained',
            'pdf_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'duration' => 5
        ]);
    }
}
