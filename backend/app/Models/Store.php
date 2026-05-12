<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = [
        'parent_id',
        'name',
        'logo',
        'prefix',
        'code',
        'tin',
        'bin',
        'address',
        'state',
        'city',
        'type',
        'phone',
        'pin_code',
        'start_time',
        'end_time',
        'weekend',
        'is_active',
        'is_inventory_location',
        'share_customer_details'
    ];

    public function parent()
    {
        return $this->belongsTo(Store::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Store::class, 'parent_id');
    }
}
