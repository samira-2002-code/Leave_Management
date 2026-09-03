<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequest;
use App\Models\LeaveBalance;
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
        if ($user->hasAnyRole(['Manager', 'Admin'])) {
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
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Cette demande a déjà été traitée.',
            ], 422);
        }

        $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
            ->where('leave_type_id', $leaveRequest->leave_type_id)
            ->first();

        if (!$balance) {
            return response()->json([
                'message' => 'Solde introuvable.',
            ], 422);
        }

        if ($balance->remaining_days < $leaveRequest->duration) {
            return response()->json([
                'message' => 'Solde insuffisant.',
            ], 422);
        }

        $balance->increment(
            'used_days',
            $leaveRequest->duration
        );

        $leaveRequest->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Demande approuvée avec succès.',
            'request' => $leaveRequest->fresh()->load('leaveType'),
            'remaining_days' => $balance->fresh()->remaining_days,
        ]);
    }

    public function reject(
        Request $request,
        LeaveRequest $leaveRequest
    ): JsonResponse {
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Cette demande a déjà été traitée.',
            ], 422);
        }

        $leaveRequest->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Demande rejetée.',
            'request' => $leaveRequest->fresh()->load('leaveType'),
        ]);
    }
}
