<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'leave_type_id' => ['required', 'exists:leave_types,id'],

            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],

            'duration' => ['required', 'numeric', 'min:0.5'],

            'period' => ['required', 'in:full_day,half_day'],

            'reason' => ['nullable', 'string'],

            'attachment' => [
                'nullable',
                'string',
            ],

            'replacement_user_id' => [
                'nullable',
                'exists:users,id',
            ],

            'catch_up_date' => [
                'nullable',
                'date',
            ],
        ];
    }
}