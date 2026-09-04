<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;

class HRLeaveBalanceController extends Controller
{
    public function index()
    {
        $balances = LeaveBalance::with([
            'user',
            'leaveType'
        ])->get();

        return response()->json($balances);
    }

    public function show(LeaveBalance $leaveBalance)
    {
        return response()->json(
            $leaveBalance->load([
                'user',
                'leaveType'
            ])
        );
    }
}