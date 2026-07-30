<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class LeaderboardController extends Controller
{
    public function index()
    {
        $topUsers = User::orderBy('points', 'desc')
                        ->take(10)
                        ->get(['id', 'full_name', 'points', 'avatar_url']);

        // Return the ranking position of the current user
        $currentUser = auth()->user();
        
        $currentUserRank = User::where('points', '>', $currentUser->points)->count() + 1;

        return response()->json([
            'leaderboard' => $topUsers,
            'current_user' => [
                'points' => $currentUser->points,
                'rank' => $currentUserRank
            ]
        ]);
    }
}
