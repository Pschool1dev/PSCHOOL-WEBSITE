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
    // On crée la requête de base
    $query = Formation::query();

    // Si le paramètre 'cible' est présent dans l'URL (ex: ?cible=enfant)
    if ($request->has('cible')) {
        $query->where('public_cible', $request->cible);
    }

    // On retourne les résultats filtrés
    return response()->json($query->get());
}

    /**
     * Enregistre une nouvelle formation avec son statut
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'duree' => 'required|string',
            'nb_modules' => 'required|integer|min:0',
            'categorie' => 'required|string',
            'public_cible' => 'required|string',
            'formateur_id' => 'nullable|integer',
            'statut' => 'required|in:actif,inactif', // Validation du nouveau champ
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('formations', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $formation = Formation::create($data);

        return response()->json([
            'message' => 'Formation créée avec succès',
            'formation' => $formation
        ], 201);
    }

    /**
     * Met à jour une formation (incluant le changement de statut)
     */
    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'duree' => 'required|string',
            'nb_modules' => 'required|integer|min:0',
            'categorie' => 'required|string',
            'public_cible' => 'required|string',
            'statut' => 'required|in:actif,inactif', 
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // On prend toutes les données sauf l'image pour le moment
        $data = $request->except('image'); 

        if ($request->hasFile('image')) {
            // 1. Supprimer l'ancienne image physiquement
            if ($formation->image) {
                $oldPath = str_replace(asset('storage/'), '', $formation->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            // 2. Stocker la nouvelle
            $path = $request->file('image')->store('formations', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $formation->update($data);

        return response()->json([
            'message' => 'Mise à jour réussie', 
            'formation' => $formation
        ], 200);
    }

    /**
     * Supprime une formation
     */
    public function destroy($id)
    {
        $formation = Formation::find($id);
        if ($formation) {
            if ($formation->image) {
                $oldPath = str_replace(asset('storage/'), '', $formation->image);
                Storage::disk('public')->delete($oldPath);
            }
            $formation->delete();
            return response()->json(['message' => 'Supprimée'], 200);
        }
        return response()->json(['message' => 'Non trouvée'], 404);
    }
    public function show($id)
    {
        
        $formation = Formation::find($id);

        
        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée'], 404);
        }

       
        return response()->json($formation, 200);
    }
    public function getFormateurFormations()
{
    // auth()->id() récupère l'ID du formateur connecté via le token
    $formations = Formation::where('formateur_id', auth()->id())->get();

    return response()->json($formations, 200);
}
public function cours()
{
    // Permet de faire $formation->cours pour obtenir la liste
    return $this->hasMany(Cours::class)->orderBy('ordre', 'asc');
}
}