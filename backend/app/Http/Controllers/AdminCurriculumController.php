<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exam;
use App\Models\Subject;
use App\Models\Unit;
use App\Models\Chapter;
use App\Models\Topic;

class AdminCurriculumController extends Controller
{
    // Exam CRUD
    public function storeExam(Request $request) {
        $data = $request->validate(['name' => 'required|string', 'description' => 'nullable|string', 'category' => 'required|string']);
        return response()->json(Exam::create($data), 201);
    }
    public function deleteExam($id) {
        Exam::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Subject CRUD
    public function storeSubject(Request $request) {
        $data = $request->validate(['exam_id' => 'required|exists:exams,id', 'name' => 'required|string', 'description' => 'nullable|string']);
        return response()->json(Subject::create($data), 201);
    }
    public function deleteSubject($id) {
        Subject::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Unit CRUD
    public function storeUnit(Request $request) {
        $data = $request->validate(['subject_id' => 'required|exists:subjects,id', 'name' => 'required|string', 'description' => 'nullable|string', 'order' => 'integer']);
        return response()->json(Unit::create($data), 201);
    }
    public function deleteUnit($id) {
        Unit::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Chapter CRUD
    public function storeChapter(Request $request) {
        $data = $request->validate(['unit_id' => 'required|exists:units,id', 'name' => 'required|string', 'description' => 'nullable|string', 'order' => 'integer']);
        return response()->json(Chapter::create($data), 201);
    }
    public function deleteChapter($id) {
        Chapter::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Topic CRUD
    public function storeTopic(Request $request) {
        $data = $request->validate(['chapter_id' => 'required|exists:chapters,id', 'name' => 'required|string', 'description' => 'nullable|string', 'order' => 'integer']);
        return response()->json(Topic::create($data), 201);
    }
    public function deleteTopic($id) {
        Topic::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
