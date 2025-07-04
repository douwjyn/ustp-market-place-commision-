<?php

namespace App\Http\Controllers;

use App\Models\AdminNotification;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{

    public function index()
    {
        return response()->json(['notifications_limited' => AdminNotification::orderBy('id', 'desc')->limit(4)->get() ,'notifications' => AdminNotification::all()]);
    }


    public function mark_as_read($id)
    {
        $notification = AdminNotification::find($id);
        $notification->is_read = true;
        $notification->save();
        return response()->json(['message' => 'Notification marked as read.']);
    }


    public function mark_all_as_read()
    {
        $notifications = AdminNotification::where('is_read', false)->get();
      
        foreach($notifications as $notification) {
            $notification->is_read = true;
            $notification->save();
        }

        return response()->json(['message' => 'Notification marked as read.']);
    }
}
