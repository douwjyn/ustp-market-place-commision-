<?php

namespace App\Http\Controllers\Store;

use Illuminate\Http\Request;
use App\Models\Shop;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

use App\Models\Product;

class StoreController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shops = Shop::paginate(40);
        $trending_shops = DB::table('purchases')
            ->join('shops', 'purchases.shop_id', '=', 'shops.id')
            ->select('shops.id', 'shops.name', 'shops.description', 'shops.image', DB::raw('COUNT(purchases.id) as total_purchases'))
            ->groupBy('shops.id', 'shops.name', 'shops.description', 'shops.image')
            ->orderBy('total_purchases', 'desc')
            ->limit(10)
            ->paginate(10);

        if ($trending_shops->isEmpty()) {
            $trending_shops = Shop::orderBy('created_at', 'desc')->paginate(40);
        }

        $latest_shops = Shop::orderBy('created_at', 'desc')->paginate(40);

        return response()->json([
            'success' => true,
            'message' => 'Shops fetched successfully',
            'shops' => $shops,
            'trending_shops' => $trending_shops,
            'latest_shops' => $latest_shops,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'string'],
        ])->validate();

        $shop = Shop::with(['products.images', 'products.categories', 'user'])->find($validator['id']);

        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Shop fetched successfully',
            'shop' => $shop,
        ]);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    
    public function search(string $shop_id, string $query)
    {
        $validator = Validator::make(['query' => $query, 'shop_id' => $shop_id], [
            'query' => ['required', 'string', 'max:255'],
            'shop_id' => ['required', 'string'],
        ])->validate();

        $products = Product::where('shop_id', $validator['shop_id'])
            ->where('name', 'like', '%' . $validator['query'] . '%')
            ->orWhere('description', 'like', '%' . $validator['query'] . '%')
            ->orWhere('price', 'like', '%' . $validator['query'] . '%')
            ->paginate(40);

        return response()->json([
            'success' => true,
            'message' => 'Products in store fetched successfully',
            'products' => $products,
        ]);
    }
}
