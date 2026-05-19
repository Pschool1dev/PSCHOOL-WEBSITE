<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function index()
    {
        try {
            return response()->json(Service::all(), 200);
        } catch (\Exception $e) {
            Log::error('Index services error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Store service - Données reçues:', $request->all());
            
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'statut' => 'required|in:actif,inactif',
                'color' => 'nullable|string',
                'whatsapp_message' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['_method']);

            // Upload sur Cloudinary
            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image');
                $upload = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'pschool/services',
                    'transformation' => [
                        'width' => 800,
                        'height' => 600,
                        'crop' => 'limit'
                    ]
                ]);
                $data['image'] = $upload->getSecurePath();
                $data['public_id'] = $upload->getPublicId();
            }

            $service = Service::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Service créé avec succès',
                'service' => $service
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Store service error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Update service - ID: ' . $id);
            Log::info('Update service - Données reçues:', $request->all());
            
            $service = Service::find($id);
            
            if (!$service) {
                return response()->json(['message' => 'Service non trouvé'], 404);
            }

            $validator = Validator::make($request->all(), [
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'statut' => 'sometimes|required|in:actif,inactif',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['_method', 'image']);

            // Gestion de l'image sur Cloudinary
            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image de Cloudinary
                if ($service->public_id) {
                    try {
                        Cloudinary::destroy($service->public_id);
                        Log::info('Ancienne image supprimée: ' . $service->public_id);
                    } catch (\Exception $e) {
                        Log::warning('Erreur suppression ancienne image: ' . $e->getMessage());
                    }
                }
                
                $uploadedFile = $request->file('image');
                $upload = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'pschool/services',
                    'transformation' => [
                        'width' => 800,
                        'height' => 600,
                        'crop' => 'limit'
                    ]
                ]);
                $data['image'] = $upload->getSecurePath();
                $data['public_id'] = $upload->getPublicId();
            }

            $service->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Service mis à jour avec succès', 
                'service' => $service->fresh()
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Update service error: ' . $e->getMessage() . ' - Trace: ' . $e->getTraceAsString());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $service = Service::find($id);
            
            if (!$service) {
                return response()->json(['message' => 'Service non trouvé'], 404);
            }
            
            // Supprimer l'image de Cloudinary
            if ($service->public_id) {
                try {
                    Cloudinary::destroy($service->public_id);
                    Log::info('Image Cloudinary supprimée: ' . $service->public_id);
                } catch (\Exception $e) {
                    Log::warning('Erreur suppression image Cloudinary: ' . $e->getMessage());
                }
            }
            
            $service->delete();
            
            return response()->json(['message' => 'Service supprimé avec succès'], 200);
            
        } catch (\Exception $e) {
            Log::error('Destroy service error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $service = Service::find($id);
            if (!$service) {
                return response()->json(['message' => 'Service non trouvé'], 404);
            }
            return response()->json($service, 200);
        } catch (\Exception $e) {
            Log::error('Show service error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}