<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class PaymentMethod extends Model
{
    use SoftDeletes, HasFactory;

    // protected $fillable = [
    //     'name',
    // ];

    protected $guarded = [];
}
