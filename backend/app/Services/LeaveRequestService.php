<?php

namespace App\Services;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Models\LeaveBalance;
use Illuminate\Validation\ValidationException;

class LeaveRequestService
{
    public function create(User $user, array $data): LeaveRequest
    {
        $balance = LeaveBalance::where('user_id', $user->id)
            ->where('leave_type_id', $data['leave_type_id'])
            ->first();

        if (!$balance) {
            throw ValidationException::withMessages([
                'leave_type_id' => ['Aucun solde trouvé pour ce type de congé.'],
            ]);
        }

        if ($balance->remaining_days < $data['duration']) {
            throw ValidationException::withMessages([
                'duration' => [
                    'Solde insuffisant. Solde disponible : '
                    . $balance->remaining_days
                    . ' jours.'
                ],
            ]);
        }

        return LeaveRequest::create([
            'user_id' => $user->id,
            'leave_type_id' => $data['leave_type_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'duration' => $data['duration'],
            'period' => $data['period'],
            'reason' => $data['reason'] ?? null,
            'attachment' => $data['attachment'] ?? null,
            'status' => 'pending',
            'replacement_user_id' => $data['replacement_user_id'] ?? null,
            'catch_up_date' => $data['catch_up_date'] ?? null,
        ]);
    }
}