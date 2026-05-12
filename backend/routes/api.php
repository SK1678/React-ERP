<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/test', function () {
    return response()->json(['message' => 'Successfully']);
});

Route::get('/users', function () {
    return response()->json(\App\Models\User::all());
});

Route::apiResource('companies', \App\Http\Controllers\Api\CompanyController::class);
Route::apiResource('stores', \App\Http\Controllers\Api\StoreController::class);
