<?php

namespace App\Services;

use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\User;

class LeaveBalanceService
{
	public function ensureForUser(User $user): void
	{
		LeaveType::query()->each(function (LeaveType $leaveType) use ($user) {
			LeaveBalance::firstOrCreate(
				['user_id' => $user->id, 'leave_type_id' => $leaveType->id],
				['total_days' => $leaveType->default_days, 'used_days' => 0]
			);
		});
	}
}
