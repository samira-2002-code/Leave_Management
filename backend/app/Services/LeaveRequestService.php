<?php

namespace App\Services;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Models\LeaveBalance;
use App\Models\RequestHistory;
use App\Notifications\NewLeaveRequestNotification;
use App\Notifications\LeaveRequestStatusNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LeaveRequestService
{
    public function __construct(private LeaveBalanceService $leaveBalanceService) {}

    public function create(User $user, array $data): LeaveRequest
    {
        $this->leaveBalanceService->ensureForUser($user);
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

        $leaveRequest = LeaveRequest::create([
            'user_id' => $user->id,
            'leave_type_id' => $data['leave_type_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'duration' => $data['duration'],
            'period' => $data['period'],
            'reason' => $data['reason'] ?? null,
            'attachment' => $data['attachment'] ?? null,
            'status' => 'pending_manager',
            'replacement_user_id' => $data['replacement_user_id'] ?? null,
            'catch_up_date' => $data['catch_up_date'] ?? null,
        ]);

        RequestHistory::create([
            'leave_request_id' => $leaveRequest->id,
            'user_id' => $user->id,
            'old_status' => null,
            'new_status' => 'pending_manager',
            'comment' => 'Demande créée',
        ]);

        User::role('manager')->get()->each(fn (User $manager) =>
            $manager->notify(new NewLeaveRequestNotification($leaveRequest))
        );

        return $leaveRequest;
    }

    public function transition(LeaveRequest $leaveRequest, User $actor, string $targetStatus, ?string $comment = null): LeaveRequest
    {
        return DB::transaction(function () use ($leaveRequest, $actor, $targetStatus, $comment) {
            $allowed = [
                'pending_manager' => ['pending_hr', 'rejected'],
                'pending_hr' => ['approved', 'rejected'],
            ];

            if (!in_array($targetStatus, $allowed[$leaveRequest->status] ?? [], true)) {
                throw ValidationException::withMessages(['status' => ['Transition de statut interdite.']]);
            }

            $attributes = [
                'status' => $targetStatus,
                'rejection_reason' => $targetStatus === 'rejected' ? $comment : null,
            ];

            if ($targetStatus === 'pending_hr') {
                $attributes['manager_id'] = $actor->id;
            }

            if ($targetStatus === 'approved' || $targetStatus === 'rejected') {
                $attributes['hr_id'] = $actor->id;
            }

            if ($targetStatus === 'approved') {
                $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
                    ->where('leave_type_id', $leaveRequest->leave_type_id)
                    ->lockForUpdate()->first();

                if (!$balance || $balance->remaining_days < $leaveRequest->duration) {
                    throw ValidationException::withMessages(['duration' => ['Solde insuffisant.']]);
                }

                $balance->increment('used_days', $leaveRequest->duration);
            }

            $oldStatus = $leaveRequest->status;
            $leaveRequest->update($attributes);

            RequestHistory::create([
                'leave_request_id' => $leaveRequest->id,
                'user_id' => $actor->id,
                'old_status' => $oldStatus,
                'new_status' => $targetStatus,
                'comment' => $comment,
            ]);

            if ($targetStatus === 'pending_hr') {
                User::role('hr')->get()->each(fn (User $hr) => $hr->notify(new NewLeaveRequestNotification($leaveRequest)));
            }

            if (in_array($targetStatus, ['approved', 'rejected'], true)) {
                $leaveRequest->user->notify(new LeaveRequestStatusNotification($leaveRequest, $targetStatus, $comment));
            }

            return $leaveRequest->fresh()->load('leaveType', 'user.department');
        });
    }
}