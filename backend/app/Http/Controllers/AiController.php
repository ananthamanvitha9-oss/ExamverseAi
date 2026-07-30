<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'model' => 'nullable|string' // 'gemini', 'groq', 'openrouter'
        ]);

        $user = auth()->user();
        if ($user && !$user->consumeAiRequest()) {
            return response()->json(['error' => 'Daily AI limit reached. Upgrade to Pro for unlimited access.'], 402);
        }

        $selectedModel = $request->model ?? 'gemini';
        $systemInstruction = "You are Examverse AI, an expert and highly encouraging tutor for Indian competitive exams like UPSC and SSC. Keep your answers concise, structured, and strictly related to education.";
        $reply = "I'm sorry, I couldn't generate a response.";

        try {
            if ($selectedModel === 'groq') {
                // Groq API (Llama-3)
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                    'Content-Type' => 'application/json'
                ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama3-70b-8192',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemInstruction],
                        ['role' => 'user', 'content' => $request->message]
                    ]
                ]);
                if ($response->successful()) {
                    $reply = $response->json()['choices'][0]['message']['content'];
                }
            } elseif ($selectedModel === 'openrouter') {
                // OpenRouter API (Claude 3.5 / GPT-4o)
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                    'Content-Type' => 'application/json'
                ])->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => 'anthropic/claude-3.5-sonnet', // Defaulting to Claude 3.5 via OpenRouter
                    'messages' => [
                        ['role' => 'system', 'content' => $systemInstruction],
                        ['role' => 'user', 'content' => $request->message]
                    ]
                ]);
                if ($response->successful()) {
                    $reply = $response->json()['choices'][0]['message']['content'];
                }
            } else {
                // Gemini API (Default)
                $apiKey = env('GEMINI_API_KEY');
                $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";
                $payload = [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => "System Instruction: {$systemInstruction}\n\nStudent Question: {$request->message}"]
                            ]
                        ]
                    ]
                ];
                $response = Http::post($url, $payload);
                if ($response->successful()) {
                    $reply = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? $reply;
                }
            }

            // --- ElevenLabs TTS Logic ---
            $audioBase64 = null;
            if ($request->voice && env('ELEVENLABS_API_KEY') && $response->successful()) {
                $voiceId = 'pNInz6obpgDQGcFmaJcg'; 
                $elevenLabsUrl = "https://api.elevenlabs.io/v1/text-to-speech/{$voiceId}";
                
                $elevenResponse = Http::withHeaders([
                    'xi-api-key' => env('ELEVENLABS_API_KEY'),
                    'Content-Type' => 'application/json',
                    'Accept' => 'audio/mpeg'
                ])->post($elevenLabsUrl, [
                    'text' => $reply,
                    'model_id' => 'eleven_multilingual_v2',
                    'voice_settings' => ['stability' => 0.5, 'similarity_boost' => 0.5]
                ]);
                
                if ($elevenResponse->successful()) {
                    $audioBase64 = base64_encode($elevenResponse->body());
                }
            }

            if ($response->successful()) {
                return response()->json([
                    'reply' => $reply,
                    'audio' => $audioBase64 ? "data:audio/mpeg;base64,{$audioBase64}" : null
                ]);
            } else {
                return response()->json(['error' => 'Failed to reach AI service.', 'details' => $response->json()], 500);
            }

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function generateQuiz(Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:100'
        ]);

        $user = auth()->user();
        if ($user && !$user->consumeAiRequest()) {
            return response()->json(['error' => 'Daily AI limit reached. Upgrade to Pro for unlimited access.'], 402);
        }

        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";

        $prompt = "Generate a 5-question multiple choice quiz about {$request->topic}. 
        Return ONLY a JSON array of objects. Each object should have:
        - question: the question text
        - options: an array of 4 string options
        - correct_answer: the exact string of the correct option
        - explanation: a brief explanation of why the answer is correct
        Each object in the array must have exactly these keys: 'question' (string), 'options' (array of 4 strings), 'correct_answer' (string, exactly matching one of the options), 'explanation' (string).";

        try {
            $response = Http::post($url, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);
            
            if ($response->successful()) {
                $reply = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? "[]";
                
                // Clean up potential markdown formatting from Gemini
                $reply = str_replace(['```json', '```'], '', $reply);
                $quizData = json_decode(trim($reply), true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    return response()->json(['quiz' => $quizData]);
                } else {
                    return response()->json(['error' => 'Failed to parse AI response into JSON.', 'raw' => $reply], 500);
                }
            }

            return response()->json(['error' => 'Failed to generate quiz.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
