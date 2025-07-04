<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $addresses = Address::where('user_id', $user->id)->get();

        return response()->json(['addresses' => $addresses], 200);
    }
    public function store(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'house_ward' => 'required|string|max:255',
            'district_province' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'postal_code' => 'required|string|max:10',
        ]);

        $data['user_id'] = $user->id;

        Address::create($data);

        return response()->json(['message' => 'Address created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $address = Address::where('id', $id)->where('user_id', $user->id)->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'house_ward' => 'required|string|max:255',
            'district_province' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'postal_code' => 'required|string|max:10',
        ]);

        $address->update($data);

        return response()->json(['message' => 'Address updated successfully'], 200);
    }

    public function showUserAddresses($id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $addresses = Address::where('user_id', $id)->get();

        if ($addresses->isEmpty()) {
            return response()->json(['message' => 'No addresses found for this user'], 404);
        }

        return response()->json(['addresses' => $addresses], 200);
    }
}
