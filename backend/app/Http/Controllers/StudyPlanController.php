<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StudyPlanController extends Controller
{
    public function generatePlan(Request $request)
    {
        $request->validate([
            'exam_date' => 'required|date|after:today',
            'weak_subjects' => 'required|string|max:500'
        ]);

        $user = auth()->user();

        if (!$user->consumeAiRequest()) {
            return response()->json(['error' => 'Daily AI limit reached. Upgrade to Pro for unlimited access.'], 402);
        }

        $daysUntilExam = Carbon::now()->diffInDays(Carbon::parse($request->exam_date));

        $prompt = "I am a student preparing for an exam on {$request->exam_date} (in {$daysUntilExam} days). My weakest subjects are: {$request->weak_subjects}. 
        Please generate a highly structured, day-by-day study plan. 
        Return ONLY a JSON array, where each object has 'day' (e.g., 'Day 1'), 'date' (YYYY-MM-DD), 'focus_subject', 'topics_to_cover' (string), and 'estimated_hours' (integer). Generate a plan for exactly 7 days, assuming it's a rolling weekly schedule.";

        try {
            $apiKey = env('GEMINI_API_KEY');
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ],
                'generationConfig' => [
                    'temperature' => 0.2,
                ]
            ]);

            $result = $response->json();
            $responseText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Clean markdown JSON formatting if present
            $responseText = str_replace(['```json', '```'], '', $responseText);
            $planData = json_decode(trim($responseText), true);

            if (!$planData) {
                throw new \Exception("Failed to parse AI response");
            }

            // Save to DB
            DB::table('ai_study_plans')->updateOrInsert(
                ['user_id' => $user->id],
                [
                    'weak_subjects' => $request->weak_subjects,
                    'exam_date' => $request->exam_date,
                    'plan_data' => json_encode($planData),
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            return response()->json([
                'message' => 'Plan generated successfully',
                'plan' => $planData
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate plan: ' . $e->getMessage()], 500);
        }
    }

    public function getPlan(Request $request)
    {
        $plan = DB::table('ai_study_plans')->where('user_id', auth()->id())->first();
        if ($plan) {
            $plan->plan_data = json_decode($plan->plan_data, true);
        }
        return response()->json($plan);
    }
}
