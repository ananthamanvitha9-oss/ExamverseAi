<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MockTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $polityQuestions = [
            [
                "id" => 1,
                "question" => "Which of the following Fundamental Rights is available only to citizens of India and not to foreigners?",
                "options" => [
                    "Equality before the law (Article 14)",
                    "Protection of life and personal liberty (Article 21)",
                    "Freedom of speech and expression (Article 19)",
                    "Right against exploitation (Article 23)"
                ],
                "correct_answer" => "Freedom of speech and expression (Article 19)",
                "explanation" => "Articles 15, 16, 19, 29, and 30 are available ONLY to citizens. Article 14, 20, 21, 21A, 22, 23, 24, 25, 26, 27, and 28 are available to both citizens and foreigners."
            ],
            [
                "id" => 2,
                "question" => "Consider the following statements regarding the President's Rule under Article 356:\n1. It can be imposed without the Governor's report.\n2. The maximum period for which it can be extended is 1 year.\nWhich of the above is/are correct?",
                "options" => ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
                "correct_answer" => "1 only",
                "explanation" => "Statement 1 is correct. The President can act either on a report of the Governor or otherwise. Statement 2 is incorrect. The maximum period is 3 years, subject to Parliamentary approval every 6 months."
            ]
        ];

        $historyQuestions = [
            [
                "id" => 1,
                "question" => "Who among the following was the founder of the 'Satya Shodhak Samaj'?",
                "options" => [
                    "B.R. Ambedkar",
                    "Jyotirao Phule",
                    "Raja Ram Mohan Roy",
                    "Swami Vivekananda"
                ],
                "correct_answer" => "Jyotirao Phule",
                "explanation" => "Jyotirao Phule founded the Satyashodhak Samaj (Truth Seekers' Society) in 1873 in Pune, Maharashtra, to secure human rights and social justice for low-caste people."
            ],
            [
                "id" => 2,
                "question" => "The 'Cabinet Mission' of 1946 included which of the following members?",
                "options" => [
                    "Lord Pethick-Lawrence, Sir Stafford Cripps, and A.V. Alexander",
                    "Lord Mountbatten, Clement Attlee, and Sir Stafford Cripps",
                    "Winston Churchill, Lord Linlithgow, and A.V. Alexander",
                    "Lord Wavell, Sir John Simon, and Lord Pethick-Lawrence"
                ],
                "correct_answer" => "Lord Pethick-Lawrence, Sir Stafford Cripps, and A.V. Alexander",
                "explanation" => "The Cabinet Mission to India in 1946 consisted of Lord Pethick-Lawrence, Sir Stafford Cripps, and A.V. Alexander."
            ]
        ];

        $mockTests = [
            [
                'title' => 'Polity Sectional Mock Test 1',
                'description' => 'A rigorous sectional test focusing on Fundamental Rights, DPSP, and Union Executive.',
                'duration_minutes' => 30,
                'total_questions' => 2,
                'difficulty_level' => 'medium',
                'questions_json' => json_encode($polityQuestions),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Modern History Grand Test',
                'description' => 'Comprehensive evaluation of Modern Indian History spanning from the 1857 Revolt to Independence.',
                'duration_minutes' => 45,
                'total_questions' => 2,
                'difficulty_level' => 'hard',
                'questions_json' => json_encode($historyQuestions),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        DB::table('mock_tests')->insert($mockTests);
    }
}
