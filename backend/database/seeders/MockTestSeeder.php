<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MockTest;
use App\Models\Question;
use App\Models\Exam;

class MockTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the UPSC Exam (assuming it was seeded by CourseSeeder)
        $upscExam = Exam::where('name', 'UPSC Civil Services')->first();
        if (!$upscExam) return;

        $mockTest = MockTest::create([
            'exam_id' => $upscExam->id,
            'title' => 'UPSC Prelims Grand Mock Test 1',
            'description' => 'A comprehensive test covering Polity, History, and Geography.',
            'duration_minutes' => 120
        ]);

        $questions = [
            [
                'question_text' => 'Which article of the Constitution of India safeguards one\'s right to marry the person of one\'s choice?',
                'option_a' => 'Article 19',
                'option_b' => 'Article 21',
                'option_c' => 'Article 25',
                'option_d' => 'Article 29',
                'correct_option' => '1', // B
                'explanation' => 'The right to marry a person of one\'s choice is integral to Article 21 of the Constitution, which guarantees the right to life and personal liberty.'
            ],
            [
                'question_text' => 'The Ninth Schedule was introduced in the Constitution of India during the prime ministership of:',
                'option_a' => 'Jawaharlal Nehru',
                'option_b' => 'Lal Bahadur Shastri',
                'option_c' => 'Indira Gandhi',
                'option_d' => 'Morarji Desai',
                'correct_option' => '0', // A
                'explanation' => 'The First Amendment Act, 1951, which added the Ninth Schedule, was enacted during the tenure of Prime Minister Jawaharlal Nehru.'
            ],
            [
                'question_text' => 'Consider the following statements regarding the Reserve Bank of India (RBI): 1. The RBI is a statutory body. 2. The RBI Governor is appointed by the Central Government.',
                'option_a' => '1 only',
                'option_b' => '2 only',
                'option_c' => 'Both 1 and 2',
                'option_d' => 'Neither 1 nor 2',
                'correct_option' => '2', // C
                'explanation' => 'RBI is a statutory body established under the RBI Act, 1934. The Governor is appointed by the Government of India.'
            ],
            [
                'question_text' => 'Which of the following national parks is completely in the temperate alpine zone?',
                'option_a' => 'Manas National Park',
                'option_b' => 'Namdapha National Park',
                'option_c' => 'Neora Valley National Park',
                'option_d' => 'Valley of Flowers National Park',
                'correct_option' => '3', // D
                'explanation' => 'The Valley of Flowers National Park in Uttarakhand is entirely in the temperate alpine zone.'
            ]
        ];

        foreach ($questions as $q) {
            Question::create([
                'mock_test_id' => $mockTest->id,
                'question_text' => $q['question_text'],
                'option_a' => $q['option_a'],
                'option_b' => $q['option_b'],
                'option_c' => $q['option_c'],
                'option_d' => $q['option_d'],
                'correct_option' => $q['correct_option'],
                'explanation' => $q['explanation'],
            ]);
        }
    }
}
