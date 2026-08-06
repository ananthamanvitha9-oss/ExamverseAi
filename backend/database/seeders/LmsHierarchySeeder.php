<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\Subject;
use App\Models\Unit;
use App\Models\Chapter;
use App\Models\Topic;
use App\Models\SubTopic;
use App\Models\LearningMaterial;

class LmsHierarchySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = '{
          "exam": {
            "name": "UPSC Civil Services Examination",
            "overview": "India\'s premier central civil service exam for recruitment to IAS, IPS, IFS, and other allied services.",
            "eligibility": {
              "age": "21-32 Years",
              "education": "Graduate degree from a recognized university",
              "attempts": 6
            },
            "exam_pattern": {
              "prelims": ["GS Paper 1 (200 Marks)", "CSAT (200 Marks)"],
              "mains": ["9 Papers", "Total 1750 Marks"],
              "interview": "275 Marks"
            },
            "subjects": [
              {
                "name": "Indian History",
                "weightage_percentage": 15,
                "units": [
                  {
                    "name": "Ancient Indian History",
                    "description": "From prehistoric times to early medieval India.",
                    "chapters": [
                      {
                        "name": "Indus Valley Civilization",
                        "description": "The first major urban civilization in South Asia.",
                        "topics": [
                          {
                            "name": "Town Planning and Architecture",
                            "learning_objectives": ["Understand grid system", "Analyze drainage infrastructure"],
                            "ncert_references": ["Class 11 Ancient India (RS Sharma) - Chapter 6"],
                            "standard_books": ["A.L. Basham - The Wonder That Was India"],
                            "difficulty_level": "Intermediate",
                            "estimated_time_minutes": 120,
                            "tags": ["Architecture", "Harappa", "Mohenjodaro"],
                            "sub_topics": [
                              {
                                "name": "The Great Bath",
                                "description": "The earliest public water tank in the ancient world.",
                                "materials": [
                                  {
                                    "type": "video",
                                    "title": "Uncovering the Great Bath",
                                    "content_data": "https://www.youtube.com/embed/dQw4w9WgXcQ"
                                  },
                                  {
                                    "type": "pyq",
                                    "title": "UPSC Prelims 2013 Question",
                                    "content_data": "Which of the following characterizes the people of Indus Civilization?",
                                    "metadata": {
                                      "options": ["They possessed great palaces and temples", "They worshipped both male and female deities", "They employed horse-drawn chariots in warfare"],
                                      "answer": 1
                                    }
                                  },
                                  {
                                    "type": "ai_prompt",
                                    "title": "Debate with AI Tutor",
                                    "content_data": "Act as an archaeologist. Quiz me on the waterproofing techniques used in the Great Bath."
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }';

        $data = json_decode($json, true);

        // 1. Create Exam
        $examData = $data['exam'];
        $exam = Exam::firstOrCreate(
            ['name' => $examData['name']],
            [
                'overview' => $examData['overview'],
                'eligibility' => $examData['eligibility'],
                'exam_pattern' => $examData['exam_pattern'],
            ]
        );

        // 2. Create Subjects
        foreach ($examData['subjects'] as $subjectData) {
            $subject = Subject::firstOrCreate(
                ['exam_id' => $exam->id, 'name' => $subjectData['name']],
                ['weightage_percentage' => $subjectData['weightage_percentage'] ?? null]
            );

            // 3. Create Units
            foreach ($subjectData['units'] as $unitIdx => $unitData) {
                $unit = Unit::firstOrCreate(
                    ['subject_id' => $subject->id, 'name' => $unitData['name']],
                    ['description' => $unitData['description'] ?? null, 'order' => $unitIdx]
                );

                // 4. Create Chapters
                foreach ($unitData['chapters'] as $chapterIdx => $chapterData) {
                    $chapter = Chapter::firstOrCreate(
                        ['unit_id' => $unit->id, 'name' => $chapterData['name']],
                        ['description' => $chapterData['description'] ?? null, 'order' => $chapterIdx]
                    );

                    // 5. Create Topics
                    foreach ($chapterData['topics'] as $topicIdx => $topicData) {
                        $topic = Topic::firstOrCreate(
                            ['chapter_id' => $chapter->id, 'name' => $topicData['name']],
                            [
                                'learning_objectives' => $topicData['learning_objectives'] ?? null,
                                'ncert_references' => $topicData['ncert_references'] ?? null,
                                'standard_books' => $topicData['standard_books'] ?? null,
                                'difficulty_level' => $topicData['difficulty_level'] ?? null,
                                'estimated_time_minutes' => $topicData['estimated_time_minutes'] ?? null,
                                'tags' => $topicData['tags'] ?? null,
                                'order' => $topicIdx
                            ]
                        );

                        // 6. Create Sub Topics
                        foreach ($topicData['sub_topics'] as $subIdx => $subData) {
                            $subTopic = SubTopic::firstOrCreate(
                                ['topic_id' => $topic->id, 'name' => $subData['name']],
                                ['description' => $subData['description'] ?? null, 'order' => $subIdx]
                            );

                            // 7. Create Learning Materials
                            foreach ($subData['materials'] as $matIdx => $matData) {
                                LearningMaterial::firstOrCreate(
                                    [
                                        'sub_topic_id' => $subTopic->id,
                                        'title' => $matData['title'],
                                        'type' => $matData['type']
                                    ],
                                    [
                                        'content_data' => $matData['content_data'] ?? null,
                                        'metadata' => $matData['metadata'] ?? null,
                                        'order' => $matIdx
                                    ]
                                );
                            }
                        }
                    }
                }
            }
        }
    }
}
