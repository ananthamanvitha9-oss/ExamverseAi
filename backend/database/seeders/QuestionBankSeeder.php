<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Topic;
use App\Models\Question;
use App\Models\Option;
use App\Models\Answer;

class QuestionBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find or create a default topic to attach questions to
        $topic = Topic::firstOrCreate(
            ['name' => 'General Practice Topic'],
            ['chapter_id' => 1] // Assuming chapter 1 exists from our previous seeder
        );

        $questionsData = [
            [
                'question_text' => 'Which of the following sites had a dockyard?',
                'type' => 'mcq',
                'difficulty' => 'medium',
                'options' => [
                    ['text' => 'Harappa', 'is_correct' => false],
                    ['text' => 'Lothal', 'is_correct' => true],
                    ['text' => 'Mohenjodaro', 'is_correct' => false],
                    ['text' => 'Kalibangan', 'is_correct' => false],
                ],
                'explanation' => 'Lothal, located in Gujarat, was a major port city of the Indus Valley Civilization featuring a massive dockyard connected to the Sabarmati river.'
            ],
            [
                'question_text' => 'Who among the following was the founder of the Indian National Congress?',
                'type' => 'mcq',
                'difficulty' => 'easy',
                'options' => [
                    ['text' => 'Mahatma Gandhi', 'is_correct' => false],
                    ['text' => 'A.O. Hume', 'is_correct' => true],
                    ['text' => 'Lokmanya Tilak', 'is_correct' => false],
                    ['text' => 'Surendranath Banerjee', 'is_correct' => false],
                ],
                'explanation' => 'Allan Octavian Hume, a retired British civil servant, founded the Indian National Congress in 1885 to provide a platform for civic and political dialogue.'
            ],
            [
                'question_text' => 'Consider the following statements regarding the "Right to Education" (RTE) Act:\n1. It provides free and compulsory education to all children of the age of 6 to 14 years.\n2. It was inserted in the Constitution via the 86th Amendment Act.\nWhich of the statements given above is/are correct?',
                'type' => 'mcq',
                'difficulty' => 'hard',
                'options' => [
                    ['text' => '1 only', 'is_correct' => false],
                    ['text' => '2 only', 'is_correct' => false],
                    ['text' => 'Both 1 and 2', 'is_correct' => true],
                    ['text' => 'Neither 1 nor 2', 'is_correct' => false],
                ],
                'explanation' => 'The 86th Constitutional Amendment Act, 2002 inserted Article 21-A, which made the right to education a fundamental right for children aged 6 to 14. The RTE Act 2009 implemented this provision.'
            ]
        ];

        foreach ($questionsData as $qData) {
            $question = Question::create([
                'topic_id' => $topic->id,
                'question_text' => $qData['question_text'],
                'type' => $qData['type'],
                'difficulty' => $qData['difficulty']
            ]);

            foreach ($qData['options'] as $opt) {
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => $opt['text'],
                    'is_correct' => $opt['is_correct']
                ]);
            }

            Answer::create([
                'question_id' => $question->id,
                'explanation' => $qData['explanation']
            ]);
        }
    }
}
