<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequest;
use App\Models\LeaveRequest;
use App\Services\LeaveRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function __construct(
        private LeaveRequestService $leaveRequestService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Manager / Admin → voir toutes les demandes
        if ($user->hasAnyRole(['manager', 'admin'])) {
            $requests = LeaveRequest::with([
                'leaveType',
                'user.department',
            ])
                ->latest()
                ->get();
        } else {
            // Employé → voir uniquement ses demandes
            $requests = LeaveRequest::with([
                'leaveType',
                'user.department',
            ])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        return response()->json([
            'requests' => $requests,
        ]);
    }
    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $leaveRequest = $this->leaveRequestService->create(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Demande de congé créée avec succès.',
            'request' => $leaveRequest->load('leaveType'),
        ], 201);
    }

    public function show(
        Request $request,
        LeaveRequest $leaveRequest
    ): JsonResponse {
        if ($leaveRequest->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Non autorisé.',
            ], 403);
        }

        return response()->json([
            'request' => $leaveRequest->load('leaveType'),
        ]);
    }

    public function approve(
        Request $request,
        LeaveRequest $leaveRequest
    ): JsonResponse {
        if ($leaveRequest->status === 'pending_manager' && !$request->user()->hasAnyRole(['manager', 'admin'])) {
            return response()->json(['message' => 'Seul un manager peut valider cette étape.'], 403);
        }

        if ($leaveRequest->status === 'pending_hr' && !$request->user()->hasAnyRole(['hr', 'admin'])) {
            return response()->json(['message' => 'Seul le RH peut valider cette étape.'], 403);
        }

        $targetStatus = $leaveRequest->status === 'pending_manager' ? 'pending_hr' : 'approved';
        $updatedRequest = $this->leaveRequestService->transition($leaveRequest, $request->user(), $targetStatus);

        return response()->json([
            'message' => 'Demande approuvée avec succès.',
            'request' => $updatedRequest,
        ]);
    }

    public function reject(
        Request $request,
        LeaveRequest $leaveRequest
    ): JsonResponse {
        $request->validate(['rejection_reason' => ['required', 'string', 'max:1000']]);

        if ($leaveRequest->status === 'pending_manager' && !$request->user()->hasAnyRole(['manager', 'admin'])) {
            return response()->json(['message' => 'Seul un manager peut refuser cette demande.'], 403);
        }

        if ($leaveRequest->status === 'pending_hr' && !$request->user()->hasAnyRole(['hr', 'admin'])) {
            return response()->json(['message' => 'Seul le RH peut refuser cette demande.'], 403);
        }

        $updatedRequest = $this->leaveRequestService->transition(
            $leaveRequest,
            $request->user(),
            'rejected',
            $request->input('rejection_reason')
        );

        return response()->json([
            'message' => 'Demande rejetée.',
            'request' => $updatedRequest,
        ]);
    }
}
