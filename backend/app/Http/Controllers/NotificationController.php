<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function admin_notifications()
    {
        // $notifications = Notification::where('for', 'admin')->get();
        $notifications = Activity::orderBy('created_at', 'desc')->limit(3)->latest()->get();
        return response()->json($notifications);
    }


    public function user_notifications()
    {
        $notifications = Notification::orderBy('created_at', 'desc')->where('for', 'user')->get();
        return response()->json($notifications);
    }

      public function seller_notifications()
    {
        $notifications = Notification::where('for', 'seller')->get();
        return response()->json($notifications);
    }
}
