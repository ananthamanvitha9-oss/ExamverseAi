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
}
