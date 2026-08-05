<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function stats()
    {
        $totalUsers = User::count();
        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get(['id', 'full_name', 'email', 'created_at']);
        
        $totalRevenue = Payment::where('status', 'successful')->sum('amount');
        $totalPayments = Payment::where('status', 'successful')->count();
        $recentPayments = Payment::with('user:id,full_name,email')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_revenue' => $totalRevenue / 100, // Assuming amount is in paise/cents
                'total_transactions' => $totalPayments
            ],
            'recent_users' => $recentUsers,
            'recent_payments' => $recentPayments
        ]);
    }

    public function getCourses()
    {
        // For admin we want all exams, maybe with subject count
        $exams = \App\Models\Exam::withCount('subjects')->orderBy('created_at', 'desc')->get();
        return response()->json($exams);
    }

    public function createCourse(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'duration' => 'required|integer',
            'status' => 'required|in:active,inactive,draft'
        ]);

        $exam = new \App\Models\Exam();
        $exam->name = $request->name;
        $exam->description = $request->description;
        $exam->category = $request->category;
        $exam->duration = $request->duration;
        $exam->status = $request->status;
        $exam->save();

        return response()->json(['message' => 'Course created successfully', 'course' => $exam], 201);
    }

    public function updateCourse(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'duration' => 'required|integer',
            'status' => 'required|in:active,inactive,draft'
        ]);

        $exam = \App\Models\Exam::findOrFail($id);
        $exam->name = $request->name;
        $exam->description = $request->description;
        $exam->category = $request->category;
        $exam->duration = $request->duration;
        $exam->status = $request->status;
        $exam->save();

        return response()->json(['message' => 'Course updated successfully', 'course' => $exam]);
    }

    public function deleteCourse($id)
    {
        $exam = \App\Models\Exam::findOrFail($id);
        $exam->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }
}
