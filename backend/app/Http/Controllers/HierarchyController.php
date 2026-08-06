<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exam;

class HierarchyController extends Controller
{
    /**
     * Fetch the entire learning hierarchy for a specific exam.
     * This eager loads all nested relationships.
     */
    public function getHierarchy($examId)
    {
        $exam = Exam::with([
            'subjects.units.chapters.topics.subTopics.learningMaterials'
        ])->find($examId);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        return response()->json($exam, 200);
    }
}
