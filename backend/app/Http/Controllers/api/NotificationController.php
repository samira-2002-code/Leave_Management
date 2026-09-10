<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->notifications()->latest()->limit(30)->get());
    }

    public function unreadCount(Request $request)
    {
        return response()->json(['count' => $request->user()->unreadNotifications()->count()]);
    }

    public function markAsRead(Request $request, string $notification)
    {
        $item = $request->user()->notifications()->whereKey($notification)->firstOrFail();
        $item->markAsRead();
        return response()->json(['message' => 'Notification lue.']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->each->markAsRead();
        return response()->json(['message' => 'Notifications marquées comme lues.']);
    }
}
