<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();

            // Order information
            $table->uuid('order_id')->nullable(); // Consider adding index() if used for searches
            $table->enum('status', ['Processing', 'Delivered', 'Accepted', 'Cancelled', 'Returned', 'Declined'])->default('Processing');
            $table->boolean('is_confirmed')->default(false);
            $table->string('payment_method');

            // Customer information
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('phone');

            // Product pricing
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(1);

            // Financial calculations
            $table->decimal('subtotal', 10, 2); // price * quantity
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0); // subtotal * discount_percentage/100
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('total', 10, 2); // subtotal - discount_amount + shipping_fee

            // Timestamps
            $table->softDeletes();
            $table->timestamps();

            $table->index('order_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
