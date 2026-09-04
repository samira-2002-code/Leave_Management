<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LeaveRequest;

class HRDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'employees' => User::count(),
            'pending_requests' => LeaveRequest::where('status', 'pending')->count(),
            'approved_requests' => LeaveRequest::where('status', 'approved')->count(),
            'rejected_requests' => LeaveRequest::where('status', 'rejected')->count(),
        ]);
    }
}