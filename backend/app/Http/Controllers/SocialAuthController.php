<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Find existing user by google_id or email
            $user = User::where('google_id', $googleUser->getId())
                        ->orWhere('email', $googleUser->getEmail())
                        ->first();

            if ($user) {
                // Update google_id and avatar if they exist by email but don't have google_id yet
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }
            } else {
                // Create a new user
                $user = User::create([
                    'full_name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                    // A random password is required if password column is not strictly nullable across all flows, 
                    // though we made it nullable. Setting it random is a safe fallback.
                    'password' => bcrypt(Str::random(24))
                ]);
            }

            // Generate Sanctum Token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect back to frontend with the token
            // Ensure this matches your frontend URL (could be parameterized via env)
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/login?error=GoogleAuthFailed');
        }
    }
}
