<?php

namespace App\Http\Controllers\Api\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class HRReportController extends Controller
{
    public function calendar(Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin', 'manager']), 403);
        $requests = LeaveRequest::with(['user', 'leaveType'])
            ->where('status', 'approved')
            ->when($request->filled('start'), fn ($query) => $query->whereDate('end_date', '>=', $request->start))
            ->when($request->filled('end'), fn ($query) => $query->whereDate('start_date', '<=', $request->end))
            ->get();

        return response()->json($requests->map(fn (LeaveRequest $leaveRequest) => [
            'id' => $leaveRequest->id,
            'title' => $leaveRequest->user->name.' - '.$leaveRequest->leaveType->name,
            'start' => $leaveRequest->start_date->toDateString(),
            'end' => $leaveRequest->end_date->copy()->addDay()->toDateString(),
        ]));
    }

    public function csv(Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['hr', 'admin']), 403);
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);
        $rows = LeaveRequest::with(['user.department', 'leaveType'])
            ->where('status', 'approved')
            ->whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->get();

        return response()->streamDownload(function () use ($rows) {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, ['Employe', 'Departement', 'Type', 'Date debut', 'Date fin', 'Jours', 'Statut']);
            foreach ($rows as $row) {
                fputcsv($stream, [$row->user->name, $row->user->department?->name, $row->leaveType->name, $row->start_date->toDateString(), $row->end_date->toDateString(), $row->duration, $row->status]);
            }
            fclose($stream);
        }, "absences-{$year}-{$month}.csv", ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
