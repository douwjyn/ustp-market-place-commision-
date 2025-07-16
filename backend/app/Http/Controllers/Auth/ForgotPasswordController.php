<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use App\Notifications\CustomResetPassword;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No user found with that email.'], 404);
        }

        $token = Password::createToken($user);

        $user->notify(new CustomResetPassword($token, $user->email));

        return response()->json(['message' => 'Reset link sent to your email.']);
    }
}
