<?php

namespace App\Http\Controllers\Products;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\ProductImage;
use App\Models\Purchase;

class ProductsController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['images', 'categories'])->where('accepted', true)->paginate(40);
        $trending_products = Product::with(['images', 'categories'])
            ->where('accepted', true)
            ->select('products.id', 'products.name', 'products.description', 'products.price', DB::raw('COUNT(purchases.id) as total_purchases'))
            ->join('purchases', 'products.id', '=', 'purchases.product_id')
            ->groupBy('products.id', 'products.name', 'products.description', 'products.price')
            ->orderBy('total_purchases', 'desc')
            ->limit(10)
            ->paginate(10);

        $latest_products = Product::where('accepted', true)
            ->orderBy('created_at', 'desc')->paginate(40);

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'products' => $products,
            'trending_products' => $trending_products,
            'latest_products' => $latest_products,
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
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'string', 'max:255'],
        ])->validate();

        $product = Product::with(['shop', 'images', 'categories', 'sizes'])->find($validator['id']);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        // $images = ProductImage::select('product_id', 'image')
        //     ->whereIn('product_id', [$product->id])
        //     ->get();
        // ->groupBy('product_id');

        return response()->json([
            'success' => true,
            'message' => 'Product fetched successfully',
            'product' => $product,
            // 'images' => $images,
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

    // public function buy(Request $request)
    // {
    //     $user = JWTAuth::user();

    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found',
    //         ], 404);
    //     }

    //     $owner = Shop::where('user_id', $user->id)->first();

    //     if ($owner) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'You are the owner of this shop, you cannot buy your own product',
    //         ], 404);
    //     }

    //     $validator = Validator::make(['product_id' => $request->id, 'quantity' => $request->quantity], [
    //         'product_id' => ['required', 'string', 'max:255'],
    //         'quantity' => ['required', 'integer', 'min:1'],
    //     ])->validate();

    //     $product = Product::find($validator['product_id']);
    //     $product_shop = Shop::where('id', $product->shop_id)->first();

    //     if (!$product) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Product not found',
    //         ], 404);
    //     }

    //     if ($product->stock == 0) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Product out of stock',
    //         ], 404);
    //     }

    //     $product->stock -= $validator['quantity'];
    //     $product->save();

    //     $purchase = Purchase::create([
    //         'user_id' => $user->id,
    //         'shop_id' => $product_shop->id,
    //         'product_id' => $product->id,
    //         'quantity' => $validator['quantity'],
    //         'price' => $product->price,
    //         'total' => $product->price * $validator['quantity'],
    //         'status' => 'pending',
    //         'payment_method_id' => 1,
    //     ]);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Product bought successfully',
    //         'purchase' => $purchase,
    //     ]);
    // }

    public function cancel_or_return(string $id, string $action)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $validator = Validator::make(['id' => $id, 'action' => $action], [
            'id' => ['required', 'string', 'max:255'],
            'action' => ['required', 'string', 'in:Cancelled,Returned'],
        ])->validate();

        $purchase = Purchase::find($validator['id']);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase not found',
            ], 404);
        }

        $user_purchase = Purchase::where('user_id', $user->id)->where('status', 'delivered')->first();

        if ($user_purchase) {
            return response()->json([
                'success' => false,
                'message' => 'You have already received a purchase, you cannot cancel it',
            ], 404);
        }

        $purchase->status = $action;
        $purchase->product->stock = $purchase->product->stock + $purchase->quantity;
        $purchase->product->save();
        $purchase->save();

        \App\Models\Notification::create([
            'message' => $user->first_name . ' ' . $user->last_name . ' ' . strtolower($action) . ': #' . $purchase->order_id,
            'for' => 'seller',
            'user_id' => $purchase->shop->id
        ]);

        \App\Models\AdminNotification::create([
            'type' => 'order',
            'title' => 'Order Cancelled',
            'message' => "#" . $purchase->order_id . " has been cancelled by the customer.",
            'is_read' => false,
            'priority' => 'low',
            'action_required' => false
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Purchase ' . $action . ' successfully',
            'purchase' => $purchase,
        ]);
    }

    public function confirm_purchase(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'string', 'max:255'],
        ])->validate();

        $purchase = Purchase::find($validator['id']);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase not found',
            ], 404);
        }

        $is_user_received = Purchase::where('user_id', $user->id)->where('status', 'received')->first();

        if (!$is_user_received) {
            return response()->json([
                'success' => false,
                'message' => 'You have not received this purchase, you cannot confirm it.',
            ], 404);
        }

        if ($purchase->is_confirmed) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase already confirmed. You cannot confirm it again.',
            ], 404);
        }


        $purchase->is_confirmed = true;
        $purchase->save();

        // 


        return response()->json([
            'success' => true,
            'message' => 'Purchase confirmed successfully',
            'purchase' => $purchase,
        ]);
    }

    public function by_category(string $category, string $shop_id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $validator = Validator::make(['category' => $category], [
            'category' => ['required', 'string', 'max:255'],
            'shop_id' => ['required', 'string', 'max:255'],
        ])->validate();

        $products = Product::where('category', $validator['category'])
            ->where('shop_id', $validator['shop_id'])
            ->paginate(40);

        if ($products->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No matching products found for this category',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Products fetched by category successfully',
            'products' => $products,
        ]);
    }

    // public function by_price(string $price, string $direction, string $shop_id)
    // {
    //     $user = JWTAuth::user();

    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found',
    //         ], 404);
    //     }

    //     $validator = Validator::make(['price' => $price, 'direction' => $direction, 'shop_id' => $shop_id], [
    //         'price' => ['required', 'string', 'max:255'],
    //         'direction' => ['required', 'string', 'max:255', Rule::in(['asc', 'desc'])],
    //         'shop_id' => ['required', 'string', 'max:255'],
    //     ])->validate();


    //     $products = Product::where('price', '<', function ($query) {
    //         $query->select(DB::raw('MAX(price)'))->from('products');
    //     })->where('shop_id', $validator['shop_id'])->orderBy('price', $validator['direction'])->paginate(40);

    //     if ($products->isEmpty()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'No matching products found for this price',
    //         ], 404);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Products fetched by category successfully',
    //         'products' => $products,
    //     ]);
    // }

    // public function search(Request $request)
    // {
    //     $user = JWTAuth::user();

    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found',
    //         ], 404);
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'query' => ['required', 'string', 'max:255'],
    //     ])->validate();

    //     $products = Product::where('name', 'like', '%' . $validator['query'] . '%')
    //         ->orWhere('description', 'like', '%' . $validator['query'] . '%')
    //         ->paginate(40);

    //     $shop = Shop::where('name', 'like', '%' . $validator['query'] . '%')
    //         ->orWhere('description', 'like', '%' . $validator['query'] . '%')
    //         ->paginate(40);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Products fetched by search successfully',
    //         'products' => $products,
    //         'shops' => $shop,
    //     ]);
    // }

    public function return_purchase(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'string'],
        ])->validate();

        $purchase = Purchase::where('id', $id)
            ->where('product_id', $validator['id'])
            ->first();

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase not found',
            ], 404);
        }

        // Update the purchase status to "Returned"
        $purchase->status = 'Returned';
        $purchase->save();

        \App\Models\Notification::create([
            'message' => $user->email . ' returned ' . 'order: ' . $purchase->order_id,
            'user_id' => $purchase->shop->user->id,
            'for' => 'seller'
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Purchase status updated to Returned successfully',
            'purchase' => $purchase,
        ]);
    }

    // public function confirm_purchase_by_shop(string $product_id)
    // {
    //     $user = JWTAuth::user();

    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found',
    //         ], 404);
    //     }

    //     $validator = Validator::make(['product_id' => $product_id], [
    //         'product_id' => ['required', 'string', 'max:255'],
    //     ])->validate();

    //     $shop = Shop::where('user_id', $user->id)
    //         ->where('product_id', $product_id)
    //         ->first();

    //     $purchase = Purchase::where('shop_id', $shop->id)
    //         ->where('product_id', $validator['product_id'])
    //         ->where('user_id', $user->id)
    //         ->where('status', 'received')
    //         ->where('is_confirmed', false)
    //         ->first();

    //     if (!$purchase) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'No received purchases found',
    //         ], 404);
    //     }

    //     $purchase->is_confirmed = true;
    //     $purchase->save();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Purchase confirmed successfully',
    //         'purchase' => $purchase,
    //     ]);
    // }
    public function placeOrder(Request $request)
    {
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $rules = [
            'cart_items' => 'required|array|min:1',
            'cart_items.*.product_id' => 'required|integer|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.price' => 'required|numeric|min:0',
            'cart_items.*.discount' => 'nullable|numeric|min:0|max:100', // Add discount validation
            'address' => 'required|max:120|min:8',
            'city' => 'required|max:120',
            'state' => 'required|max:120',
            'payment_method' => 'required|in:gcash,cod',
            'phone' => ['required', 'regex:/^09\\d{9}$/', Rule::unique('users', 'phone')->ignore($user->id)],
            'email' => 'required|email',
        ];

        if ($request->payment_method === 'gcash') {
            $rules['receipt'] = 'required|image|mimes:jpeg,png,jpg,gif|max:5120';
        }

        $validator = Validator::make($request->all(), $rules, [
            'phone.regex' => 'Phone number must be 11 digits and start with 09.',
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'Invalid payment method selected.',
            'receipt.required' => 'Receipt image is required for GCash payments.',
            'receipt.image' => 'Receipt must be a valid image file.',
            'receipt.mimes' => 'Receipt must be a JPEG, PNG, JPG, or GIF file.',
            'receipt.max' => 'Receipt image must be less than 5MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        $receiptPath = null;
        if ($request->payment_method === 'gcash' && $request->hasFile('receipt')) {
            try {
                $receiptFile = $request->file('receipt');
                $receiptPath = $receiptFile->store('receipts', 'public');
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload receipt. Please try again.',
                ], 500);
            }
        }

        $purchases = [];
        $totalAmount = 0;
        $orderId = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
        $shippingFee = 150;

        foreach ($request->cart_items as $item) {
            $product = Product::find($item['product_id']);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => "Product not found: {$item['product_id']}",
                ], 404);
            }

            // Check if user is trying to buy their own product
            if ($product->shop->user_id == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot buy your own product',
                ], 400);
            }

            // Check stock availability
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => "Not enough stock for product: {$product->name}. Available: {$product->stock}, Requested: {$item['quantity']}",
                ], 400);
            }

            // Calculate prices properly
            $originalPrice = $product->price;
            $quantity = $item['quantity'];
            $discountPercentage = isset($item['discount']) ? floatval($item['discount']) : 0;

            // Calculate discount amount per unit
            $discountAmountPerUnit = ($originalPrice * $discountPercentage) / 100;

            // Calculate discounted price per unit
            $discountedPricePerUnit = $originalPrice - $discountAmountPerUnit;

            // Calculate total for this item (discounted price * quantity)
            $itemSubtotal = $discountedPricePerUnit * $quantity;

            // Add shipping fee (you might want to calculate this differently)
            $itemTotal = $itemSubtotal + $shippingFee;

            $totalAmount += $itemTotal;

            // Create purchase record
            $purchase = Purchase::create([
                'user_id' => $user->id,
                'shop_id' => $product->shop_id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $originalPrice, // Store original price
                'discount_percentage' => $discountPercentage, // Store discount percentage
                'discount_amount' => $discountAmountPerUnit * $quantity, // Total discount amount
                'subtotal' => $itemSubtotal, // Price after discount, before shipping
                'shipping_fee' => $shippingFee,
                'total' => $itemTotal, // Final total including shipping
                'status' => 'Processing',
                'payment_method' => $request->payment_method,
                'order_id' => $orderId,
                'address' => $validator->validated()['address'],
                'city' => $validator->validated()['city'],
                'state' => $validator->validated()['state'],
                'phone' => $validator->validated()['phone'],
            ]);

            // Create notification for shop owner
            \App\Models\Notification::create([
                'message' => $user->email . ' placed an order for ' . $product->name . ', order ID: ' . $purchase->order_id,
                'user_id' => $purchase->shop->user->id,
                'for' => 'seller'
            ]);

            \App\Models\AdminNotification::create([
                'type' => 'order',
                'title' => 'Order Placed',
                'message' => 'Order placed by ' . $user->email . ', order ID: ' . $purchase->order_id,
                'is_read' => false,
                'priority' => 'low',
                'action_required' => false
            ]);

            \App\Models\Activity::create([
                'type' => 'order',
                'user_id' => $user->id,
                'description' => 'Order placed by ' . $user->email . ', order ID: ' . $purchase->order_id,
                'purchase_id' => $purchase->id,
                'status' => 'completed'
            ]);

            $purchases[] = $purchase;

            // Update product stock
            $product->stock = $product->stock - $quantity;
            $product->save();

            // Create payment record for GCash
            if ($request->payment_method == 'gcash') {
                \App\Models\Payment::create([
                    'mode' => strtoupper($request->payment_method),
                    'receipt' => $receiptPath,
                    'purchase_id' => $purchase->id
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'purchases' => $purchases,
            'total_amount' => $totalAmount,
        ]);
    }
}
