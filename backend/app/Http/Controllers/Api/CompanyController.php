<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json(Company::all());
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            // Process file fields
            $fileFields = ['logo', 'photo', 'favicon', 'trade_license'];
            foreach ($fileFields as $field) {
                if (isset($data[$field]) && str_starts_with($data[$field], 'data:')) {
                    $data[$field] = $this->saveBase64File($data[$field], $field);
                }
            }

            $company = Company::create($data);
            return response()->json($company, 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Company Store Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Company $company)
    {
        return response()->json($company);
    }

    public function update(Request $request, Company $company)
    {
        try {
            $data = $request->all();

            // Process file fields
            $fileFields = ['logo', 'photo', 'favicon', 'trade_license'];
            foreach ($fileFields as $field) {
                if (isset($data[$field]) && str_starts_with($data[$field], 'data:')) {
                    $data[$field] = $this->saveBase64File($data[$field], $field);
                }
            }

            $company->update($data);
            return response()->json($company);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Company Update Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function saveBase64File($base64String, $prefix)
    {
        try {
            // Extract the mime type and the base64 data
            if (!preg_match('/^data:(\w+\/\w+);base64,(.+)$/', $base64String, $matches)) {
                return $base64String;
            }

            $mimeType = $matches[1];
            $data = base64_decode($matches[2]);
            
            // Determine extension
            $extension = 'bin';
            if ($mimeType == 'image/jpeg' || $mimeType == 'image/jpg') $extension = 'jpg';
            elseif ($mimeType == 'image/png') $extension = 'png';
            elseif ($mimeType == 'application/pdf') $extension = 'pdf';
            elseif ($mimeType == 'application/msword') $extension = 'doc';
            elseif ($mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') $extension = 'docx';

            $filename = $prefix . '_' . time() . '_' . \Illuminate\Support\Str::random(10) . '.' . $extension;
            $path = 'uploads/companies/' . $filename;
            
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $data);
            
            // Return the URL path
            return '/storage/' . $path;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('File Save Error: ' . $e->getMessage());
            return $base64String; // Fallback to base64 if saving fails
        }
    }

    public function destroy(Company $company)
    {
        $company->delete();
        return response()->json(['message' => 'Company deleted successfully']);
    }
}
