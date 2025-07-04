<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Models\Activity;
use App\Models\Notification;

class AuthController extends Controller
{
    protected function generate_token($token, $user)
    {
        return response()->json([
            'success' => true,
            'user' => $user->email,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200, ['Content-Type' => 'application/json']);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'string'],
        ])->validate();

        $user = User::where('email', $validator['email'])->first();
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized role',
            ], 401);
        }
            
        if (!$token = JWTAuth::attempt($validator)) {
            return response()->json([
                'success' => false,
                'message' => 'Email or password is incorrect.',
            ], 401);
        }

        return $this->generate_token($token, Auth::user());
    }


    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['required', 'regex:/^09\\d{9}$/', Rule::unique('users')],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'birthdate' => ['required', 'date', 'string', 'max:255'],
        ],[
            'phone.regex' => 'Phone number must be 11 digits and start with 09.',
        ])->validated();

        $validator['password'] = Hash::make($validator['password']);
       
        if ($request->has('role')) {
            $validator['role'] = $request->input('role');
        } else {
            $validator['role'] = 'user'; // Default role
        }

        $user = User::create($validator);

        Activity::create([
            'user_id' => $user->id,
            'description' => 'New user registered',
            'type' => 'registration',
            'status' => 'completed'
        ]);

        // Notification::create([
        //     'message' => 'New user registered —' . $user->email, 
        //     'for' => 'admin'
        // ]);

      
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
        ]);
    }
}
