<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'duration',
        'period',
        'reason',
        'attachment',
        'status',
        'manager_id',
        'hr_id',
        'rejection_reason',
        'replacement_user_id',
        'catch_up_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'catch_up_date' => 'date',
        'duration' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function hr()
    {
        return $this->belongsTo(User::class, 'hr_id');
    }

    public function replacement()
    {
        return $this->belongsTo(User::class, 'replacement_user_id');
    }

    public function histories()
    {
        return $this->hasMany(RequestHistory::class);
    }
}