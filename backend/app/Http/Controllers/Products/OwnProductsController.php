<?php

namespace App\Http\Controllers\Products;

use App\Models\Activity;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Shop;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\Purchase;
use App\Models\Category;

class OwnProductsController
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

        $shop = Shop::where('user_id', $user->id)->first();

        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        $products = Product::with('images')->where('shop_id', $shop->id)->paginate(40);

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'products' => $products,
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

        $shop = Shop::where('user_id', $user->id)->first();
        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found',
            ], 404);
        }

        $validated = Validator::make(array_merge($request->all(), ['shop_id' => $shop->id]), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'variation' => 'nullable|string',
            'color' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'discount' => 'required|integer|min:0|max:100',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,name', // assuming categories are IDs
            'sizes' => 'required|array',
            'sizes.*' => 'string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ])->validate();


        $product = Product::create([
            'shop_id' => $shop->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'variation' => $validated['variation'] ?? null,
            'color' => $validated['color'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'discount' => $validated['discount']
            //'accepted' => false
        ]);

        Activity::create([
            'type' => 'product',
            'user_id' => $user->id,
            'description' => 'Product approval requested.',
            'status' => 'pending',
            'product_id' => $product->id,
        ]);

        \App\Models\AdminNotification::create([
            'type' => 'product_request',
            'title' => 'New Product Publish Request',
            'message' => $user->first_name . " has submitted a new product " . '"' .  $product->name . '" for approval.',
            'is_read' => false,
            'priority' => 'high',
            'action_required' => true
        ]);

        // $category = Category::find($validated['categories'][0]) ;

        // $product->categories()->sync($validated['categories']);

        foreach ($validated['categories'] as $categoryName) {
            $category = Category::firstOrCreate(['name' => $categoryName]);
            $product->categories()->attach($category->id);
        }

        // if (!empty($validated['sizes'])) {
        //     $product->sizes = $validated['sizes'];
        //     $product->save();
        // }

        foreach ($validated['sizes'] as $sizeName) {
            $size = \App\Models\Size::firstOrCreate(['name' => $sizeName]);
            $product->sizes()->attach($size->id);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $path,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'product' => $product,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
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

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'string'],
        ])->validate();

        $product = Product::with(['images', 'categories', 'sizes'])->find($validator['id']);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product fetched successfully',
            'product' => $product,
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

        $product = Product::with(['images', 'categories', 'sizes'])->where('shop_id', $shop->id)->find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'variation' => 'nullable|string',
            'color' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'discount' => 'required|numeric|min:0|max:100',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,name',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'integer',
        ];

        $validated = Validator::make($request->all(), $rules)->validate();

        // Update product fields
        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'variation' => $validated['variation'] ?? null,
            'color' => $validated['color'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'discount' => $validated['discount']
        ]);

        // Update categories
        if (isset($validated['categories'])) {
            $categoryIds = [];
            foreach ($validated['categories'] as $categoryName) {
                $category = \App\Models\Category::firstOrCreate(['name' => $categoryName]);
                $categoryIds[] = $category->id;
            }
            $product->categories()->sync($categoryIds);
        }

        // Update sizes
        if (isset($validated['sizes'])) {
            $sizeIds = [];
            foreach ($validated['sizes'] as $sizeName) {
                $size = \App\Models\Size::firstOrCreate(['name' => $sizeName]);
                $sizeIds[] = $size->id;
            }
            $product->sizes()->sync($sizeIds);
        }

        // Remove images
        if (isset($validated['removed_images'])) {
            foreach ($validated['removed_images'] as $imageId) {
                $image = \App\Models\ProductImage::find($imageId);
                if ($image && $image->product_id == $product->id) {
                    $image->delete();
                }
            }
        }

        // Add new images
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('product_images', 'public');
                \App\Models\ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $path,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product->fresh(['images', 'categories', 'sizes']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
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

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'string'],
        ])->validate();

        $product = Product::find($validator['id']);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }



    public function update_purchase_status(string $id, string $status)
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

        $validator = Validator::make(['id' => $id, 'status' => $status], [
            'id' => ['required', 'string'],
            'status' => ['required', 'string', Rule::in(['Processing', 'Accepted', 'Delivered', 'Cancelled', 'Returned', 'Declined'])],
        ])->validate();

        $purchase = Purchase::where('shop_id', $shop->id)
            ->where('id', $validator['id'])
            ->first();

        // if ($purchase->status == 'Delivered' || $purchase->status == 'Cancelled' || $purchase->status == 'Returned' || $purchase->status == 'Accepted') {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Purchase already ' . $purchase->status . '. You cannot update it again.',
        //     ], 404);
        // }

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase not found',
            ], 404);
        }

        $purchase->status = $validator['status'];
        $purchase->save();

        \App\Models\Activity::create([
            'type' => 'order',
            'user_id' => $user->id,
            'description' => 'Order #' . $purchase->order_id . ' has been marked as ' . strtolower($status) . ' by ' . $user->email,
            // 'description' => 'Order #' . $purchase->order_id . ' placed.',
            'purchase_id' => $purchase->id,
            'status' => 'completed'
        ]);

        \App\Models\Notification::create([
            'user_id' => $purchase->user->id,
            'message' => 'Order #' . $purchase->order_id . ' has been ' . strtolower($validator['status']) . ($validator['status'] === 'Delivered' ? '.' : ', please visit purchase history to track your order.'),
            'for' => 'user'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Purchase status updated successfully',
            'purchase' => $purchase,
        ]);
    }
}
