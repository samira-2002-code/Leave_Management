<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Services\LeaveRequestService;
use Illuminate\Http\Request;

class HRLeaveRequestController extends Controller
{
    public function __construct(private LeaveRequestService $leaveRequestService) {}

    public function index(Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        $requests = LeaveRequest::with([
            'user',
            'leaveType',
            'manager',
            'hr',
            'replacementUser'
        ])->latest()->get();

        return response()->json($requests);
    }

    public function show(Request $request, LeaveRequest $leaveRequest)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
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

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']) && $leaveRequest->status === 'pending_hr', 403);
        return response()->json([
            'message' => 'Demande approuvée.',
            'request' => $this->leaveRequestService->transition($leaveRequest, $request->user(), 'approved'),
        ]);
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']) && $leaveRequest->status === 'pending_hr', 403);
        $request->validate(['rejection_reason' => ['required', 'string', 'max:1000']]);

        return response()->json([
            'message' => 'Demande refusée.',
            'request' => $this->leaveRequestService->transition($leaveRequest, $request->user(), 'rejected', $request->rejection_reason),
        ]);
    }
}