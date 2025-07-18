<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Auth\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Middleware\Auth\AuthProvider;
use App\Http\Controllers\Products\ProductsController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Products\OwnProductsController;
use App\Http\Controllers\Store\StoreController;
use App\Http\Controllers\Store\OwnStoreController;
use App\Http\Controllers\Products\CartController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;



Route::prefix('v1')->group(function () {

  Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
  Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

  // Auth routes
  Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
  });

  Route::post('/admin/register', [AdminController::class, 'register']);
  Route::post('/admin/login', [AdminController::class, 'login']);

  Route::middleware([AuthProvider::class])->group(function () {
    // Admin routes
    Route::get('/admin/activities', [ActivityController::class, 'index']);
    Route::put('/admin/product/{id}/accepted/{user_id}', [AdminController::class, 'accept_product']);
    Route::put('/admin/change_password', [AdminController::class, 'change_password']);
    Route::get('/admin/profile', [AdminController::class, 'profile']);
    Route::post('/admin/profile', [AdminController::class, 'update_profile']);
    Route::get('/admin/notifications', [AdminNotificationController::class, 'index']);
    Route::post('/admin/notifications/mark-read/{id}', [AdminNotificationController::class, 'mark_as_read']);
    Route::post('/admin/notifications/mark-all-read', [AdminNotificationController::class, 'mark_all_as_read']);

    // User routes  
    Route::prefix('user')->group(function () {
      Route::post('/status', [UserController::class, 'update_status']);
      // Route::get('/users', [UserController::class, 'users']);
      Route::get('/', [UserController::class, 'me']);
      Route::get('/fetch-users', [UserController::class, 'fetch_users']);
      Route::get('/active-users', [UserController::class, 'active_users']);
      Route::post('/', [UserController::class, 'update']);
      Route::delete('/', [UserController::class, 'delete']);
      Route::get('/purchases', [UserController::class, 'user_purchases']);
    });

    // Own Products routes
    Route::prefix('own-products')->group(function () {
      Route::get('/', [OwnProductsController::class, 'index']);
      Route::post('/', [OwnProductsController::class, 'store']);
      Route::get('/{id}', [OwnProductsController::class, 'show']);
      Route::post('/{id}', [OwnProductsController::class, 'update']);
      Route::delete('/{id}', [OwnProductsController::class, 'destroy']);
      Route::put('/{id}/purchase-status/{status}', [OwnProductsController::class, 'update_purchase_status']);
    });

    // Global Products routes
    Route::prefix('products')->group(function () {
      Route::get('/', [ProductsController::class, 'index']);
      Route::get('/search', [ProductsController::class, 'search']);
      Route::get('/{id}', [ProductsController::class, 'show']);
      Route::post('/{id}', [ProductsController::class, 'update']);
      // Route::post('/{id}/purchase/{quantity}', [ProductsController::class, 'buy']);
      Route::post('/products/placeorder', [ProductsController::class, 'placeOrder']);
      // Route::post('/{id}/purchase/cancel', [ProductsController::class, 'cancel_purchase']);
      Route::post('/{id}/purchase/{action}', [ProductsController::class, 'cancel_or_return']);
      // Route::post('/{id}/confirm-purchase', [ProductsController::class, 'confirm_purchase']);
      // Route::get('/{category}/{shop_id}', [ProductsController::class, 'by_category']);
      // Route::get('/{price}/{direction}/{shop_id}', [ProductsController::class, 'by_price']);
      // Route::get('/search', [ProductsController::class, 'search']);
      // Route::post('/{id}/confirm-purchase-by-shop', [ProductsController::class, 'confirm_purchase_by_shop']);
    });

    // Own Store routes
    Route::prefix('own-store')->group(function () {
      Route::get('/', [OwnStoreController::class, 'index']);
      Route::post('/', [OwnStoreController::class, 'store']);
      Route::post('/{id}', [OwnStoreController::class, 'update']);
      Route::delete('/', [OwnStoreController::class, 'destroy']);
      Route::get('/orders', [OwnStoreController::class, 'orders']);
      Route::get('/earnings/{date}/{direction}', [OwnStoreController::class, 'earnings']);
    });

    // Global Store routes
    Route::prefix('store')->group(function () {
      Route::get('/', [StoreController::class, 'index']);
      Route::get('/{id}', [StoreController::class, 'show']);
      Route::get('/search/{shop_id}/{query}', [StoreController::class, 'search']);
    });

    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/remove', [CartController::class, 'removeFromCart']);
    Route::post('/cart/clear', [CartController::class, 'clearCart']);
    Route::post('/cart/increment', [CartController::class, 'incrementQuantity']);
    Route::post('/cart/decrement', [CartController::class, 'decrementQuantity']);

    Route::prefix('addresses')->group(function () {
      Route::post('/', [\App\Http\Controllers\Address\AddressController::class, 'store']);
      Route::put('/{id}', [\App\Http\Controllers\Address\AddressController::class, 'update']);
      Route::get('/', [\App\Http\Controllers\Address\AddressController::class, 'index']);
      Route::get('/user/{id}', [\App\Http\Controllers\Address\AddressController::class, 'showUserAddresses']);
    });
  });
});
