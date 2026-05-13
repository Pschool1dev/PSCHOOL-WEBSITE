<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
   
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

 
    public function store(Request $request)
    {
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
           
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $service = Service::create($data);

        return response()->json([
            'message' => 'Service créé avec succès',
            'service' => $service
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // 1. Supprimer l'ancienne image physiquement du dossier services
            if ($service->image) {
                $oldPath = str_replace(asset('storage/'), '', $service->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            // 2. Stocker la nouvelle image
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $service->update($data);

        return response()->json([
            'message' => 'Service mis à jour avec succès', 
            'service' => $service
        ]);
    }

    
    public function destroy($id)
    {
        $service = Service::find($id);
        
        if ($service) {
            // Suppression de l'image avant de supprimer l'entrée en base
            if ($service->image) {
                $oldPath = str_replace(asset('storage/'), '', $service->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $service->delete();
            return response()->json(['message' => 'Service supprimé avec succès'], 200);
        }

        return response()->json(['message' => 'Service non trouvé'], 404);
    }
}