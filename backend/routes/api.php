<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveBalanceController;
use App\Http\Controllers\Api\LeaveRequestController;

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});


/*
|--------------------------------------------------------------------------
| Leave Management
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Leave balances
    Route::get('/leave-balances', [
        LeaveBalanceController::class,
        'index'
    ]);

    // Leave requests
    Route::get('/leave-requests', [
        LeaveRequestController::class,
        'index'
    ]);

    Route::post('/leave-requests', [
        LeaveRequestController::class,
        'store'
    ]);

    Route::get('/leave-requests/{leaveRequest}', [
        LeaveRequestController::class,
        'show'
    ]);

    // Approve request
    Route::patch('/leave-requests/{leaveRequest}/approve', [
        LeaveRequestController::class,
        'approve'
    ]);

    // Reject request
    Route::patch('/leave-requests/{leaveRequest}/reject', [
        LeaveRequestController::class,
        'reject'
    ]);
});