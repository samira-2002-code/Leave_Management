<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveBalanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $balances = $request->user()
            ->leaveBalances()
            ->with('leaveType')
            ->get();

        return response()->json([
            'balances' => $balances->map(function ($balance) {
                return [
                    'id' => $balance->id,
                    'leave_type' => $balance->leaveType->name,
                    'total_days' => $balance->total_days,
                    'used_days' => $balance->used_days,
                    'remaining_days' => $balance->remaining_days,
                ];
            }),
        ]);
    }
}




