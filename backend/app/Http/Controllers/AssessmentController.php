<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Topic;
use App\Models\Question;

class AssessmentController extends Controller
{
    /**
     * Get practice questions for a specific topic
     */
    public function getTopicQuestions($topicId)
    {
        $questions = Question::with(['options', 'answer'])
            ->where('topic_id', $topicId)
            ->inRandomOrder()
            ->limit(10)
            ->get();
            
        return response()->json($questions, 200);
    }
    
    /**
     * Get PYQs for a specific exam and year
     */
    public function getPyqs(Request $request, $examId)
    {
        $year = $request->query('year');
        
        $query = Question::with(['options', 'answer', 'pyq'])
            ->whereHas('pyq', function($q) use ($examId, $year) {
                $q->where('exam_id', $examId);
                if ($year) {
                    $q->where('year', $year);
                }
            });
            
        $pyqs = $query->get();
        return response()->json($pyqs, 200);
    }
}
