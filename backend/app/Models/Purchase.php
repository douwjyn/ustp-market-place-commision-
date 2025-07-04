<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Purchase extends Model
{
    use SoftDeletes, HasFactory;
    protected $guarded = [];
    // protected $fillable = [
    //     'user_id',
    //     'shop_id',
    //     'product_id',
    //     'status',
    //     'payment_method_id',
    //     'price',
    //     'quantity',
    //     'total',
    // ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities() {
        return $this->hasMany(Activity::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }
}
