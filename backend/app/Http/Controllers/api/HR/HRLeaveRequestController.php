<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;

class HRLeaveRequestController extends Controller
{
    public function index()
    {
        $requests = LeaveRequest::with([
            'user',
            'leaveType',
            'manager',
            'hr',
            'replacementUser'
        ])->get();

        return response()->json($requests);
    }

    public function show(LeaveRequest $leaveRequest)
    {
        return response()->json(
            $leaveRequest->load([
                'user',
                'leaveType',
                'manager',
                'hr',
                'replacementUser'
            ])
        );
    }
}