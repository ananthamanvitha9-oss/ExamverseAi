<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function generatePlan(Request $request)
    {
        $request->validate([
            'weak_subjects' => 'required|string',
            'exam_date' => 'required|date',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";

        $prompt = "Generate a highly customized 7-day study plan for a student preparing for Indian competitive exams (UPSC/SSC). 
        The student's weak subjects are: {$request->weak_subjects}. 
        Their exam date is: {$request->exam_date}. 
        Output the response STRICTLY as a JSON array of objects, where each object has 'day' (e.g., 'Day 1'), 'topic' (what to study), and 'duration' (e.g., '2 hours'). Do not include markdown formatting or backticks around the JSON.";

        $payload = [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ];

        try {
            $response = Http::post($url, $payload);
            
            if ($response->successful()) {
                $data = $response->json();
                $rawText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';
                
                // Clean up any markdown block formatting the AI might have accidentally added
                $cleanJson = str_replace(['```json', '```'], '', $rawText);
                $planArray = json_decode(trim($cleanJson), true);

                if (is_array($planArray)) {
                    // Save to DB
                    $planId = DB::table('ai_study_plans')->insertGetId([
                        'weak_subjects' => $request->weak_subjects,
                        'exam_date' => $request->exam_date,
                        'plan_data' => json_encode($planArray),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    return response()->json([
                        'message' => 'Plan generated successfully',
                        'plan' => $planArray
                    ]);
                } else {
                    return response()->json(['error' => 'Failed to parse AI response as JSON'], 500);
                }
            } else {
                return response()->json(['error' => 'Failed to reach AI service'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
