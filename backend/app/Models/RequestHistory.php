<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RequestHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_request_id',
        'user_id',
        'old_status',
        'new_status',
        'comment',
    ];

    public function leaveRequest()
    {
        return $this->belongsTo(LeaveRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}