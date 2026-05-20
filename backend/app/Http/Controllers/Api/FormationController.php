<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class FormationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Formation::query();

            // 1. Filtrage par mode_formation
            if ($request->has('mode_formation')) {
                $mode = $request->get('mode_formation');
                
                if ($mode === 'elearning') {
                    $query->where(function($q) {
                        $q->where('mode_formation', 'elearning')
                          ->orWhereNull('mode_formation');
                    });
                } else {
                    $query->where('mode_formation', $mode);
                }
            }

            // 2. Mode vitrine (seulement les formations actives)
            if ($request->get('mode') === 'vitrine') {
                $query->where('statut', 'actif');
            }

            // 3. Filtrage par cible
            if ($request->has('cible')) {
                $query->where('public_cible', $request->get('cible'));
            }

            return response()->json($query->orderBy('id', 'desc')->get());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

public function store(Request $request)
{
    try {
        // 1. Correction du validateur pour accepter 'type' et les nouveaux champs
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:elearning,session', // On utilise 'type' comme dans ton front
            'titre' => 'required|string',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',
            'duree' => 'nullable|string',
            'categorie' => 'nullable|string',
            'public_cible' => 'nullable|string',
            'statut' => 'required|in:actif,inactif',
            'nb_modules' => 'nullable|integer', // Ajout
            'formateur_id' => 'nullable|exists:users,id', // Ajout
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Utilisation de $request->all() pour simplifier l'assignation
        $data = $request->all();
        
        // Renommer 'type' en 'mode_formation' si c'est le nom de ta colonne en DB
        $data['mode_formation'] = $request->input('type');
        
        // Gestion de l'image
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('formations', $filename, 'public');
            $data['image'] = asset('storage/' . $path);
        }

        // 3. Création
        $formation = Formation::create($data);

        return response()->json([
            'status' => 'success',
            'formation' => $formation
        ], 201);

    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

    public function update(Request $request, $id)
    {
        try {
            $formation = Formation::find($id);
            if (!$formation) {
                return response()->json(['message' => 'Formation non trouvée'], 404);
            }

            $validator = Validator::make($request->all(), [
                'mode_formation' => 'sometimes|required|in:elearning,session',
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'prix' => 'sometimes|required|numeric',
                'duree' => 'sometimes|required|string',
                'nb_modules' => 'required_if:mode_formation,elearning|nullable|integer',
                'categorie' => 'sometimes|required|string',
                'public_cible' => 'sometimes|required|string',
                'statut' => 'sometimes|required|in:actif,inactif',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['_method', 'image']);

            if ($request->hasFile('image')) {
                if ($formation->image) {
                    $oldPath = str_replace(asset('storage/'), '', $formation->image);
                    Storage::disk('public')->delete($oldPath);
                }
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('formations', $filename, 'public');
                $data['image'] = asset('storage/' . $path);
            }

            $formation->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Mise à jour réussie',
                'formation' => $formation
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $formation = Formation::find($id);
            if ($formation) {
                if ($formation->image) {
                    $oldPath = str_replace(asset('storage/'), '', $formation->image);
                    Storage::disk('public')->delete($oldPath);
                }
                $formation->delete();
                return response()->json(['message' => 'Supprimée avec succès'], 200);
            }
            return response()->json(['message' => 'Non trouvée'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $formation = Formation::find($id);
        return $formation ? response()->json($formation, 200) : response()->json(['message' => 'Non trouvée'], 404);
    }

    public function getFormateurFormations()
    {
        $user = auth()->user();
        return $user ? response()->json(Formation::where('formateur_id', $user->id)->get(), 200) : response()->json(['message' => 'Non authentifié'], 401);
    }
}