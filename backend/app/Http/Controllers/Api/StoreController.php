<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(\App\Models\Store::with('parent')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:stores,code',
            'type' => 'required|in:head office,Warehouse,Retail,Restaurant',
            'is_active' => 'boolean',
        ]);

        $store = \App\Models\Store::create($request->all());
        return response()->json($store, 201);
    }

    public function show(string $id)
    {
        $store = \App\Models\Store::with('parent', 'children')->findOrFail($id);
        return response()->json($store);
    }

    public function update(Request $request, string $id)
    {
        $store = \App\Models\Store::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|unique:stores,code,' . $id,
        ]);

        $store->update($request->all());
        return response()->json($store);
    }

    public function destroy(string $id)
    {
        $store = \App\Models\Store::findOrFail($id);
        $store->delete();
        return response()->json(['message' => 'Store deleted successfully']);
    }
}
