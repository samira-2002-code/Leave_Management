<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveBalanceController;
use App\Http\Controllers\Api\LeaveRequestController;

// HR Controllers
use App\Http\Controllers\Api\HR\HRDashboardController;
use App\Http\Controllers\Api\HR\HREmployeeController;
use App\Http\Controllers\Api\HR\HRLeaveRequestController;
use App\Http\Controllers\Api\HR\HRLeaveTypeController;
use App\Http\Controllers\Api\HR\HRLeaveBalanceController;


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    // Public
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});


/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Employee - Leave Management
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | HR
    |--------------------------------------------------------------------------
    */

    Route::prefix('hr')->group(function () {

        // Dashboard
        Route::get('/dashboard', [
            HRDashboardController::class,
            'index'
        ]);


        // Employees
        Route::get('/employees', [
            HREmployeeController::class,
            'index'
        ]);

        Route::get('/employees/{user}', [
            HREmployeeController::class,
            'show'
        ]);


        // Leave Requests
        Route::get('/leave-requests', [
            HRLeaveRequestController::class,
            'index'
        ]);

        Route::get('/leave-requests/{leaveRequest}', [
            HRLeaveRequestController::class,
            'show'
        ]);


        // Leave Types
        Route::get('/leave-types', [
            HRLeaveTypeController::class,
            'index'
        ]);

        Route::post('/leave-types', [
            HRLeaveTypeController::class,
            'store'
        ]);

        Route::put('/leave-types/{leaveType}', [
            HRLeaveTypeController::class,
            'update'
        ]);

        Route::delete('/leave-types/{leaveType}', [
            HRLeaveTypeController::class,
            'destroy'
        ]);


        // Leave Balances
        Route::get('/leave-balances', [
            HRLeaveBalanceController::class,
            'index'
        ]);

        Route::get('/leave-balances/{leaveBalance}', [
            HRLeaveBalanceController::class,
            'show'
        ]);
    });
});