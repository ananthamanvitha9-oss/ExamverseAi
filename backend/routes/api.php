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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getProfile']);
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);
});

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/mock-tests', [MockTestController::class, 'index']);
Route::get('/mock-tests/{id}', [MockTestController::class, 'show']);
Route::post('/chat', [AiController::class, 'chat']);
Route::get('/news', [NewsController::class, 'index']);
Route::post('/study-plan/generate', [AnalyticsController::class, 'generatePlan']);
