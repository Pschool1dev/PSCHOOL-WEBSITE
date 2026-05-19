<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'statut' => 'required|string',
                'color' => 'nullable|string',
                'whatsapp_message' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();

            if ($request->hasFile('image')) {
                $upload = cloudinary()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'pschool/services'
                ]);
                $data['image'] = $upload->getSecurePath();
            }

            $service = Service::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Service créé avec succès',
                'service' => $service
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'titre' => 'sometimes|required|string|max:255', // Changé 'nom' en 'titre' pour correspondre au store
                'description' => 'sometimes|required|string',
                'statut' => 'sometimes|required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['image', '_method']);

            if ($request->hasFile('image')) {
                $upload = cloudinary()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'pschool/services'
                ]);
                $data['image'] = $upload->getSecurePath();
            }

            $service->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Service mis à jour avec succès', 
                'service' => $service
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $service = Service::find($id);
        if ($service) {
            $service->delete();
            return response()->json(['message' => 'Service supprimé'], 200);
        }
        return response()->json(['message' => 'Service non trouvé'], 404);
    }
}