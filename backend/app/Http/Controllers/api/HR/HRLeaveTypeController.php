<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;

class HRLeaveTypeController extends Controller
{
    public function index()
    {
        return response()->json(
            LeaveType::all()
        );
    }

    public function store(Request $request)
    {
        $leaveType = LeaveType::create([
            'name' => $request->name,
            'description' => $request->description,
            'requires_document' => $request->requires_document ?? false,
            'is_half_day_allowed' => $request->is_half_day_allowed ?? false,
            'default_days' => $request->default_days ?? 0,
        ]);

        return response()->json($leaveType, 201);
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        $leaveType->update([
            'name' => $request->name,
            'description' => $request->description,
            'requires_document' => $request->requires_document ?? false,
            'is_half_day_allowed' => $request->is_half_day_allowed ?? false,
            'default_days' => $request->default_days ?? 0,
        ]);

        return response()->json($leaveType);
    }

    public function destroy(LeaveType $leaveType)
    {
        $leaveType->delete();

        return response()->json([
            'message' => 'Type de congé supprimé'
        ]);
    }
}