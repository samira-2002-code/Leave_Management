<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class HREmployeeController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        $employees = User::with('department')->get();

        return response()->json($employees);
    }

    public function show(Request $request, User $user)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        return response()->json(
            $user->load('department')
        );
    }
}