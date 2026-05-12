<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'address',
        'country',
        'tin',
        'bin',
        'phone',
        'is_active',
        'logo',
        'owner_name',
        'nid',
        'image',
        'photo',
        'trade_license'
    ];
}
