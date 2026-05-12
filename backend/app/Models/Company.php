<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'address',
        'country',
        'state',
        'city',
        'default_language',
        'tin',
        'bin',
        'phone',
        'is_active',
        'logo',
        'owner_name',
        'nid',
        'favicon',
        'photo',
        'trade_license'
    ];
}
