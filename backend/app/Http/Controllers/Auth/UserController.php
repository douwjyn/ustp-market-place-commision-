<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Purchase;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function users()
    {
        // Get the authenticated user
        $user = JWTAuth::user();

        // Check if the user role is not 'admin'
        if ($user->role !== 'admin') {
            // Send a 403 Forbidden response if the user is not an admin
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        // Fetch all users if the user is an admin
        $users = User::where('role', '!=', 'admin')->get();

        // Return the list of users
        return response()->json(['users' => $users], 200);
    }

    public function me()
    {
        $user = JWTAuth::user();
        $user->load(['notifications' => function ($query) {
            $query->latest()->limit(5);
        }]);
        // $owner =null;
        $shop = null;

        if ($user->role === 'shop_owner') {
            $shop = DB::table('shops')->where('user_id', $user->id)->first();
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'shop' => $shop ? $shop : null,
            'user' => $user,
        ]);
    }

    public function user_purchases()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $purchases = Purchase::with('product.images')->where('user_id', $user->id)->get();
        $total_purchases = Purchase::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'User purchases',
            'total_purchases' => $total_purchases,
            'purchases' => $purchases,
        ]);
    }

    public function delete()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }

    public function update_status(Request $request)
    {
        $user = JWTAuth::user();
        $request->validate(['status' => 'required|in:online,offline']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        if ($request->status == 'online') {
            $user->is_online = true;
        } else {
            $user->is_online = false;
        }
        $user->save();
        return response()->json(['message' => 'status set', 'user' => $user]);
    }

    public function update(Request $request)
    {
        $user = JWTAuth::user();

        $validator = Validator::make($request->all(), [
            'first_name' => ['sometimes', 'string', 'nullable', 'max:255'],
            'middle_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'phone' => ['sometimes', 'nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'state' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        $data = array_filter($validator->validated(), function ($value) {
            return !is_null($value);
        });

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('profile_images', 'public');
            $data['image_path'] = $path;
        }
        $user->update($data);
        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => $user->fresh(),
        ]);
    }


    public function fetch_users()
    {
        return response()->json(['users' => User::where('role', '!=', 'admin')->get(), 'users_count' => User::where('role', '!=', 'admin')->count(), 'sellers_count' => User::where('role', 'shop_owner')->count()]);
    }

    // public function active_users() {
    //     $activeUsers = User::where('role', 'user')
    //                 // ->where('is_online', true)
    //                 ->get();

    //     return response()->json($activeUsers);
    // }
}
