<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MockTest;

class MockTestController extends Controller
{
    public function index()
    {
        return response()->json(MockTest::with('questions')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'difficulty' => 'required|string|in:easy,medium,hard',
            'question_count' => 'required|integer|min:5|max:20'
        ]);

        $user = auth()->user();

        if (!$user->consumeAiRequest()) {
            return response()->json(['error' => 'Daily AI limit reached. Upgrade to Pro for unlimited access.'], 402);
        }

        $prompt = "Generate a multiple choice quiz about {$request->subject} at {$request->difficulty} difficulty. It must contain exactly {$request->question_count} questions. Return ONLY a JSON array, where each object has 'question' (string), 'options' (array of 4 strings), and 'correct_answer' (string matching one of the options).";

        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . env('GEMINI_API_KEY'), [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ],
                'generationConfig' => [
                    'temperature' => 0.2,
                ]
            ]);

            $result = $response->json();
            $responseText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
            $responseText = str_replace(['```json', '```'], '', $responseText);
            $questions = json_decode(trim($responseText), true);

            if (!$questions) {
                throw new \Exception("Failed to parse AI response");
            }

            $mockTest = MockTest::create([
                'title' => ucfirst($request->subject) . ' Mock Test',
                'description' => "AI generated test for {$request->subject}",
                'duration_minutes' => $request->question_count * 2, // 2 mins per question
            ]);

            foreach ($questions as $q) {
                $mockTest->questions()->create([
                    'question_text' => $q['question'],
                    'options' => json_encode($q['options']),
                    'correct_option' => $q['correct_answer'],
                    'marks' => 1
                ]);
            }

            return response()->json($mockTest->load('questions'));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate mock test: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $mockTest = MockTest::with('questions')->findOrFail($id);
        return response()->json($mockTest);
    }
}
