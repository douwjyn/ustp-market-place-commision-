<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function register(Request $request)
    {
        $validator = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string|min:8|same:password',
            'phone' => 'required|string|size:13|unique:users',
        ]);

        $validator['password'] = bcrypt($request->password);
        $validator['role'] = 'admin'; // Set the role to admin by default
        $user = User::create([
            'first_name' => $validator['first_name'],
            'last_name' => $validator['last_name'],
            'email' => $validator['email'],
            'password' => $validator['password'],
            'phone' => $validator['phone'],
            'role' => $validator['role'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin registered successfully',
            'user' => $user,
        ]);
    }

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
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ])->validate();

        if (!$token = JWTAuth::attempt($validator)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        return $this->generate_token($token, Auth::user());
    }

    public function change_password(Request $request)
    {
        $validator = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
            'new_password_confirmation' => 'required|string|min:8|same:new_password',
        ]);

        $user = User::find(Auth::id());

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 400);
        }

        // Update password
        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    public function accept_product(string $id, string $user_id)
    {
        $product = Product::findOrFail($id);
        $product->accepted = true;
        $product->save();

        $activity = Activity::where('product_id', $id)
            ->where('user_id', $user_id)
            ->first();
        $activity->status = 'completed';
        $activity->save();

        return response()->json('Product accepted');
    }

    public function update_profile(Request $request)
    {
        $user = User::find(Auth::id());

        $validator = Validator::make($request->all(), [
            'first_name' => ['sometimes', 'string', 'nullable', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'profile_image' => ['sometimes', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        $updateData = $validator->validated();


        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $updateData['image_path'] = $path; 
        }

        $user->update($updateData);


        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
    public function profile(Request $request)
    {
        $user = User::find(Auth::id());

        return response()->json($user);
    }
}
