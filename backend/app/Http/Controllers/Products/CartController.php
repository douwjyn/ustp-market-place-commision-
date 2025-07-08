<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'selected_size' => 'required|in:XS,S,M,L,XL,XXL',
        ]);
        $user = JWTAuth::user();

        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Calculate discounted price per item
        $discountedPrice = $product->discount > 0
            ? $product->price * (1 - $product->discount / 100)
            : $product->price;

        // Check if cart item already exists
        $existingCartItem = Cart::where([
            'user_id' => $user->id,
            'selected_size' => $request->selected_size,
            'product_id' => $request->product_id,
        ])->first();

        // Calculate total quantity that would be in cart
        $totalQuantity = $existingCartItem ? $existingCartItem->quantity + $request->quantity : $request->quantity;

        // Calculate available stock (current stock + quantity already in this user's cart for this product)
        $availableStock = $product->stock + ($existingCartItem ? $existingCartItem->quantity : 0);

        if ($totalQuantity > $availableStock) {
            return response()->json(['error' => 'Insufficient stock'], 400);
        }

        if ($existingCartItem) {
            // Update existing cart item
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->price = $discountedPrice * $existingCartItem->quantity;
            $existingCartItem->save();

            // Only decrement stock by the new quantity being added
            $product->stock -= $request->quantity;
            $product->save();

            $cartItem = $existingCartItem;
        } else {
            // Create new cart item
            $cartItem = Cart::create([
                'user_id' => $user->id,
                'selected_size' => $request->selected_size,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $discountedPrice * $request->quantity,
            ]);

            // Decrement stock by the quantity being added
            $product->stock -= $request->quantity;
            $product->save();
        }

        return response()->json(['message' => 'Added to cart', 'item' => $cartItem]);
    }

    public function getCart()
    {
        $user = JWTAuth::user();
        $cartItems = Cart::with(['product.images', 'product.categories', 'product.sizes', 'product.shop'])->where('user_id', $user->id)->get();
        return response()->json($cartItems);
    }

    public function removeFromCart(Request $request)
    {
        $user = JWTAuth::user();
        $validator = Validator::make($request->all(), [
            'cart_id' => 'required|exists:carts,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItem = Cart::where('id', $validator->validated()['cart_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        // Return the full quantity back to stock
        $product = Product::find($cartItem->product_id);
        $product->stock += $cartItem->quantity;
        $product->save();

        $cartItem->delete();

        return response()->json(['message' => 'Removed from cart']);
    }

    public function incrementQuantity(Request $request)
    {
        $user = JWTAuth::user();
        $validator = Validator::make($request->all(), [
            'cart_id' => 'required|exists:carts,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItem = Cart::where('id', $validator->validated()['cart_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $product = Product::find($cartItem->product_id);

        // Check if there's available stock (current stock represents what's available)
        if ($product->stock < 1) {
            return response()->json(['error' => 'Insufficient stock'], 400);
        }

        $cartItem->increment('quantity');
        $discount = $product->discount ?? 0;
        $discount = floatval($discount);
        $discountedPrice = $discount > 0 ? $product->price * (1 - $discount / 100) : $product->price;
        $cartItem->price = $discountedPrice * $cartItem->quantity;
        $cartItem->save();

        // Decrement the product stock by 1
        $product->stock -= 1;
        $product->save();

        return response()->json(['message' => 'Quantity incremented successfully', 'item' => $cartItem]);
    }

    public function decrementQuantity(Request $request)
    {
        $user = JWTAuth::user();
        $validator = Validator::make($request->all(), [
            'cart_id' => 'required|exists:carts,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItem = Cart::where('id', $validator->validated()['cart_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        if ($cartItem->quantity <= 1) {
            return response()->json(['error' => 'Cannot decrement quantity below 1'], 400);
        }

        $product = Product::find($cartItem->product_id);

        // Increment the product stock
        $product->stock += 1;
        $product->save();

        $cartItem->decrement('quantity');
        $discount = $product->discount ?? 0;
        $discount = floatval($discount);
        $discountedPrice = $discount > 0 ? $product->price * (1 - $discount / 100) : $product->price;
        $cartItem->price = $discountedPrice * $cartItem->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Quantity decremented successfully', 'item' => $cartItem]);
    }

    public function clearCart()
    {
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Return all cart items' quantities back to stock before clearing
        $cartItems = Cart::where('user_id', $user->id)->get();
        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem->product_id);
            if ($product) {
                $product->stock += $cartItem->quantity;
                $product->save();
            }
        }

        DB::table('carts')->where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}
