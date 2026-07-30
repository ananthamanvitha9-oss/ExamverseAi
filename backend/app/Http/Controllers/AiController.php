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
                
                $audioBase64 = null;
                
                // If frontend requests voice, generate it with ElevenLabs
                if ($request->voice && env('ELEVENLABS_API_KEY')) {
                    $voiceId = 'pNInz6obpgDQGcFmaJcg'; // Adam (or any default voice ID)
                    $elevenLabsUrl = "https://api.elevenlabs.io/v1/text-to-speech/{$voiceId}";
                    
                    $elevenResponse = Http::withHeaders([
                        'xi-api-key' => env('ELEVENLABS_API_KEY'),
                        'Content-Type' => 'application/json',
                        'Accept' => 'audio/mpeg'
                    ])->post($elevenLabsUrl, [
                        'text' => $reply,
                        'model_id' => 'eleven_multilingual_v2',
                        'voice_settings' => [
                            'stability' => 0.5,
                            'similarity_boost' => 0.5
                        ]
                    ]);
                    
                    if ($elevenResponse->successful()) {
                        // Get raw audio bytes and base64 encode them
                        $audioBase64 = base64_encode($elevenResponse->body());
                    } else {
                        \Illuminate\Support\Facades\Log::error('ElevenLabs Error: ' . $elevenResponse->body());
                    }
                }

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
}
