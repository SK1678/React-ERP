<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Designation;

class DesignationController extends Controller
{
    public function index()
    {
        return response()->json(Designation::all());
    }

    public function store(Request $request)
    {
        $designation = Designation::create($request->all());
        return response()->json($designation, 201);
    }

    public function show($id)
    {
        return response()->json(Designation::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $designation = Designation::findOrFail($id);
        $designation->update($request->all());
        return response()->json($designation);
    }

    public function destroy($id)
    {
        Designation::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
