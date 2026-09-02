<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveBalanceController;

Route::prefix('auth')->group(function () {

    // Routes publiques
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Dashboard - solde des congés
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/leave-balances', [LeaveBalanceController::class, 'index']);
});