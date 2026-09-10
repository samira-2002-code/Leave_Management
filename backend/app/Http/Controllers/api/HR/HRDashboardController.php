<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LeaveRequest;

class HRDashboardController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        return response()->json([
            'employees' => User::count(),
            'pending_requests' => LeaveRequest::whereIn('status', ['pending_hr', 'pending_manager'])->count(),
            'pending_hr_requests' => LeaveRequest::where('status', 'pending_hr')->count(),
            'approved_requests' => LeaveRequest::where('status', 'approved')->count(),
            'rejected_requests' => LeaveRequest::where('status', 'rejected')->count(),
        ]);
    }
}