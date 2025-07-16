<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements JWTSubject

{
    use SoftDeletes, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'role',
        'phone',
        'city',
        'state',
        'address',
        'password',
        'birthdate',
        'image_path'
    ];

    protected $hidden = [
        'password',
    ];


    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function shop() {
        return $this->hasOne(Shop::class);
    }

    public function addresses() {
        return $this->hasMany(Address::class);
    }

    public function activities() {
        return $this->hasMany(Activity::class);
    }

    public function notifications() {
        return $this->hasMany(Notification::class);
    }
}
