<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\User;

class HREmployeeController extends Controller
{
    public function index()
    {
        $employees = User::with('department')->get();

        return response()->json($employees);
    }

    public function show(User $user)
    {
        return response()->json(
            $user->load('department')
        );
    }
}