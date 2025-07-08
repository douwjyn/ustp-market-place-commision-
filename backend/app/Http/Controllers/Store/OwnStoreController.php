<?php

namespace App\Http\Controllers\Store;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class OwnStoreController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $shop = Shop::with('user')->where('user_id', $user->id)->first();

        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'shop' => $shop,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        // $shop = Shop::where('user_id', $user->id)->first();

        // if (!$shop) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Shop not found',
        //     ], 404);
        // }

        $already_has_shop = Shop::where('user_id', $user->id)->first();

        if ($already_has_shop) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a shop',
            ], 400);
        }

        $validator = Validator::make(array_merge(
            $request->all(),
            ['user_id' => $user->id]
        ), [
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255', 'unique:shops'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:shops'],
            'phone' => ['required', 'regex:/^09\\d{9}$/', Rule::unique('shops')],
            'id_type' => ['required', 'string', 'max:255'],
            'id_number' => ['required', 'string', 'max:255', 'unique:shops'],
            'district_province' => ['required', 'string', 'max:255'],
            'house_ward' => ['required', 'string', 'max:255'],
            // 'description' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'image', 'max:2048'],
        ])->validate();

        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('shop_images', 'public');
            $validator['image'] = $imagePath;
        }

        $shop = Shop::create($validator);
        $user->role = 'shop_owner';
        $user->save();

        \App\Models\AdminNotification::create([
            'type' => 'user_registration',
            'title' => 'New User Registration',
            'message' => $user->first_name . " has registered as new seller on the platform.",
            'is_read' => false,
            'priority' => 'low',
            'action_required' => false
        ]);


        \App\Models\Activity::create([
            'user_id' => $user->id,
            'description' => $user->name . ' registered as a seller.',
            'type' => 'registration',
            'status' => 'completed'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shop created successfully',
            'shop' => $shop,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_number)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        // $shop = Shop::where('user_id', $user->id)->first();
        $shop = Shop::where('id_number', $id_number)->first();
        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        $rules = [
            'name' => ['nullable', 'string', 'max:255', Rule::unique('shops')->ignore($shop->id)],
            'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('shops')->ignore($shop->id)],
            'phone' => ['nullable', 'string', 'max:255', Rule::unique('shops')->ignore($shop->id)],
            'id_type' => ['nullable', 'string', 'max:255'],
            'id_number' => ['nullable', 'string', 'max:255', Rule::unique('shops')->ignore($shop->id)],
            'district_province' => ['nullable', 'string', 'max:255'],
            'house_ward' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'image', 'max:2048'],
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('shop_images', 'public');
            $data['image'] = $imagePath;
        }

        $shop->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Shop updated successfully',
            'shop' => $shop,
            'photo_id_url' => $shop->image ?? null,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $shop = Shop::where('user_id', $user->id)->first();

        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        $shop->delete();

        return response()->json([
            'success' => true,
            'message' => 'Shop deleted successfully',
        ]);
    }

    public function earnings(string $date, string $direction)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $shop = Shop::where('user_id', $user->id)->first();

        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        $validator = Validator::make(['date' => $date, 'direction' => $direction], [
            'date' => ['required', 'date_format:Y-m-d H:i:s'],
            'direction' => ['required', 'string', 'in:asc,desc'],
        ])->validate();

        $filter_query = Purchase::where('shop_id', $shop->id)->where('status', 'received')
            ->where('is_confirmed', true)
            ->where('created_at', 'like', '%' . $validator['date'] . '%');

        $earnings = DB::table('purchases')
            ->join('products', 'purchases.product_id', '=', 'products.id')
            ->select('purchases.total', 'products.name', 'products.image', 'products.price', 'purchases.quantity')
            ->where('purchases.shop_id', $shop->id)
            ->where('purchases.status', 'received')
            ->where('purchases.is_confirmed', true)
            ->where('purchases.created_at', 'like', '%' . $validator['date'] . '%')
            ->groupBy('purchases.total', 'products.name', 'products.image', 'products.price', 'purchases.quantity', 'purchases.created_at')
            ->orderBy('purchases.created_at', $validator['direction'])
            ->paginate(40);

        $total_earnings = (clone $filter_query)->sum('total');

        return response()->json([
            'success' => true,
            'message' => 'Earnings fetched successfully',
            'earnings' => $earnings,
            'total_earnings' => $total_earnings,
        ]);
    }

    public function orders()
    {
        // Get all the purchased products for the shop
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }
        $shop = Shop::where('user_id', $user->id)->first();
        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        $orders = Purchase::with(['product.images', 'user', 'payment'])->where('shop_id', $shop->id)->get();
        if ($orders->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No orders found for this shop',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Orders fetched successfully',
            'orders' => $orders,
        ]);
    }
}
