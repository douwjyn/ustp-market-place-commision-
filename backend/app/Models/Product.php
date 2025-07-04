<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use SoftDeletes, HasFactory;
    protected $guarded = [];
    // protected $fillable = [
    //     'shop_id',
    //     'name',
    //     'description',
    //     'image',
    //     'price',
    //     'quantity',
    //     'discount',
    //     'category',
    // ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_size');
    }

    public function activities() {
        return $this->hasMany(Activity::class);
    }
}
