<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MassiveCoursesSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            [
                'name' => 'UPSC Civil Services 2026',
                'description' => 'Complete coverage for Prelims & Mains (GS + CSAT)',
                'duration' => 600,
                'category' => 'Civil Services',
                'subjects' => [
                    [
                        'name' => 'History',
                        'chapters' => [
                            ['name' => 'Ancient India', 'lessons' => ['Indus Valley Civilization', 'Vedic Period', 'Mauryan Empire']],
                            ['name' => 'Medieval India', 'lessons' => ['Delhi Sultanate', 'Mughal Empire', 'Bhakti Movement']],
                            ['name' => 'Modern India', 'lessons' => ['Revolt of 1857', 'Indian National Congress', 'Freedom Struggle']]
                        ]
                    ],
                    [
                        'name' => 'Polity',
                        'chapters' => [
                            ['name' => 'Constitution', 'lessons' => ['Making of Constitution', 'Preamble', 'Fundamental Rights']],
                            ['name' => 'Union Government', 'lessons' => ['President', 'Parliament', 'Supreme Court']]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'SSC CGL Tier 1 & 2',
                'description' => 'Maths, Reasoning, English, and General Awareness',
                'duration' => 300,
                'category' => 'Staff Selection',
                'subjects' => [
                    [
                        'name' => 'Quantitative Aptitude',
                        'chapters' => [
                            ['name' => 'Arithmetic', 'lessons' => ['Percentages', 'Profit and Loss', 'Time and Work']],
                            ['name' => 'Advanced Math', 'lessons' => ['Algebra', 'Geometry', 'Trigonometry']]
                        ]
                    ],
                    [
                        'name' => 'English Comprehension',
                        'chapters' => [
                            ['name' => 'Grammar', 'lessons' => ['Noun & Pronoun', 'Tenses', 'Subject-Verb Agreement']],
                            ['name' => 'Vocabulary', 'lessons' => ['Synonyms & Antonyms', 'Idioms and Phrases', 'One Word Substitution']]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'IBPS PO / Clerk Complete',
                'description' => 'Banking exams prep including Data Interpretation',
                'duration' => 250,
                'category' => 'Banking',
                'subjects' => [
                    [
                        'name' => 'Reasoning Ability',
                        'chapters' => [
                            ['name' => 'Puzzles & Seating', 'lessons' => ['Linear Seating', 'Circular Seating', 'Floor based Puzzles']],
                            ['name' => 'Logical Reasoning', 'lessons' => ['Syllogism', 'Blood Relations', 'Direction Sense']]
                        ]
                    ],
                    [
                        'name' => 'Data Interpretation',
                        'chapters' => [
                            ['name' => 'Charts', 'lessons' => ['Pie Charts', 'Bar Graphs', 'Line Graphs']],
                            ['name' => 'Caselets', 'lessons' => ['Basic Caselets', 'Advanced Caselets']]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'NDA / NA Mathematics',
                'description' => 'National Defence Academy Mathematics Paper',
                'duration' => 150,
                'category' => 'Defence',
                'subjects' => [
                    [
                        'name' => 'Algebra & Matrices',
                        'chapters' => [
                            ['name' => 'Set Theory', 'lessons' => ['Sets and Relations', 'Functions', 'Complex Numbers']],
                            ['name' => 'Matrices', 'lessons' => ['Types of Matrices', 'Determinants', 'Inverse Matrix']]
                        ]
                    ],
                    [
                        'name' => 'Calculus',
                        'chapters' => [
                            ['name' => 'Differential Calculus', 'lessons' => ['Limits', 'Continuity', 'Derivatives']],
                            ['name' => 'Integral Calculus', 'lessons' => ['Indefinite Integrals', 'Definite Integrals', 'Area under curves']]
                        ]
                    ]
                ]
            ]
        ];

        // Some sample free YouTube videos for educational content that allow embedding
        $videoUrls = [
            'https://www.youtube.com/watch?v=Yocja_N5s1I', // Crash Course History
            'https://www.youtube.com/watch?v=8jPQjjsBbIc', // Crash Course Science
            'https://www.youtube.com/watch?v=Xn7KPN9vCG4', // Crash Course World History
            'https://www.youtube.com/watch?v=mO5M3q9x_y0', // Crash Course Geography
            'https://www.youtube.com/watch?v=3aM4q_1fE5U', // Economics
            'https://www.youtube.com/watch?v=rfscVS0vtbw', // Learn Python freeCodeCamp
            'https://www.youtube.com/watch?v=kYJv4Z9Q8wE', // Logical Reasoning
            'https://www.youtube.com/watch?v=hJ3m15qE8C8', // Quantitative Aptitude
        ];

        foreach ($courses as $c) {
            $examId = DB::table('exams')->insertGetId([
                'name' => $c['name'],
                'description' => $c['description'],
                'duration' => $c['duration'],
                'category' => $c['category'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            foreach ($c['subjects'] as $s) {
                $subjectId = DB::table('subjects')->insertGetId([
                    'exam_id' => $examId,
                    'name' => $s['name'],
                    'description' => 'Comprehensive coverage of ' . $s['name'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                foreach ($s['chapters'] as $idx => $chap) {
                    $chapterId = DB::table('chapters')->insertGetId([
                        'subject_id' => $subjectId,
                        'name' => $chap['name'],
                        'chapter_number' => $idx + 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    foreach ($chap['lessons'] as $lessonName) {
                        DB::table('lessons')->insert([
                            'chapter_id' => $chapterId,
                            'name' => $lessonName,
                            'video_url' => $videoUrls[array_rand($videoUrls)],
                            'duration' => rand(20, 120),
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                }
            }
        }
    }
}
