<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exam;

class CourseController extends Controller
{
    public function index()
    {
        $exams = Exam::with('subjects.chapters.lessons')->get();
        return response()->json($exams);
    }
}
