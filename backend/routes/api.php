<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MockTestController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Google OAuth Routes
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getProfile']);
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);
    Route::post('/user/fcm-token', [UserController::class, 'saveFcmToken']);

    Route::post('/payment/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payment/verify', [PaymentController::class, 'verifyPayment']);
    Route::get('/payment/history', [PaymentController::class, 'getHistory']);

    Route::get('/leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'index']);

    Route::post('/study-plan/generate', [\App\Http\Controllers\StudyPlanController::class, 'generatePlan']);
    Route::get('/study-plan', [\App\Http\Controllers\StudyPlanController::class, 'getPlan']);

    Route::post('/chat', [AiController::class, 'chat']);
    Route::post('/quiz/generate', [AiController::class, 'generateQuiz']);

    // Super Admin Routes
    Route::middleware([\App\Http\Middleware\IsAdmin::class])->group(function () {
        Route::get('/admin/stats', [\App\Http\Controllers\AdminController::class, 'stats']);
    });
});

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/mock-tests', [MockTestController::class, 'index']);
Route::get('/mock-tests/{id}', [MockTestController::class, 'show']);
Route::get('/news', [NewsController::class, 'index']);
Route::post('/study-plan/generate', [AnalyticsController::class, 'generatePlan']);
Route::post('/study-plan/generate', [AnalyticsController::class, 'generatePlan']);
