<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class GamificationController extends Controller
{
    public function logStudy(Request $request)
    {
        $user = auth()->user();
        $today = Carbon::today();
        
        $pointsEarned = 10; // Default points for logging a study session
        
        // Streak Logic
        if (!$user->last_study_date) {
            // First time studying ever
            $user->current_streak = 1;
            $user->highest_streak = 1;
            $pointsEarned += 50; // Bonus for starting!
        } else {
            $lastStudy = Carbon::parse($user->last_study_date)->startOfDay();
            
            if ($lastStudy->eq($today)) {
                // Already studied today, don't increment streak, maybe award minor points for extra activity
                $pointsEarned = 2; 
            } elseif ($lastStudy->eq($today->copy()->subDay())) {
                // Studied yesterday, increment streak!
                $user->current_streak += 1;
                if ($user->current_streak > $user->highest_streak) {
                    $user->highest_streak = $user->current_streak;
                }
                $pointsEarned += ($user->current_streak * 2); // Bonus points for higher streaks
            } else {
                // Missed a day, reset streak
                $user->current_streak = 1;
            }
        }

        $user->last_study_date = $today;
        $user->points += $pointsEarned;
        $user->save();

        return response()->json([
            'message' => 'Study session logged!',
            'points_earned' => $pointsEarned,
            'total_points' => $user->points,
            'current_streak' => $user->current_streak
        ]);
    }
}
