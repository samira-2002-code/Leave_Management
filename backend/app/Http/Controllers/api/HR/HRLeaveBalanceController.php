<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use Illuminate\Http\Request;

class HRLeaveBalanceController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        $balances = LeaveBalance::with([
            'user',
            'leaveType'
        ])->get();

        return response()->json($balances);
    }

    public function show(Request $request, LeaveBalance $leaveBalance)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        return response()->json(
            $leaveBalance->load([
                'user',
                'leaveType'
            ])
        );
    }
}