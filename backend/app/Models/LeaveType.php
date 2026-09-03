<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'requires_document',
        'is_half_day_allowed',
        'default_days',
    ];

    protected $casts = [
        'requires_document' => 'boolean',
        'is_half_day_allowed' => 'boolean',
        'default_days' => 'decimal:2',
    ];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }
}