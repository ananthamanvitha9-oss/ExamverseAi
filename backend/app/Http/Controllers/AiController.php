<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";

        // System instructions to shape the AI's persona
        $systemInstruction = "You are Examverse AI, an expert and highly encouraging tutor for Indian competitive exams like UPSC and SSC. Keep your answers concise, structured, and strictly related to education.";
        
        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => "System Instruction: {$systemInstruction}\n\nStudent Question: {$request->message}"]
                    ]
                ]
            ]
        ];

        try {
            $response = Http::post($url, $payload);
            
            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "I'm sorry, I couldn't generate a response.";
                
                return response()->json([
                    'reply' => $reply
                ]);
            } else {
                return response()->json(['error' => 'Failed to reach AI service.', 'details' => $response->json()], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
