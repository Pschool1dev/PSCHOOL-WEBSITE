<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormationController extends Controller
{
    public function index(Request $request)
    {
        $query = Formation::query();
        if ($request->get('mode') === 'vitrine') {
            $query->where('statut', 'actif');
        }
        if ($request->has('cible')) {
            $query->where('public_cible', $request->cible);
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric',
                'duree' => 'required|string',
                'nb_modules' => 'required|integer|min:0',
                'categorie' => 'required|string',
                'public_cible' => 'required|string',
                'formateur_id' => 'nullable|integer',
                'statut' => 'required|in:actif,inactif', 
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();

            if ($request->hasFile('image')) {
                $upload = cloudinary()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'pschool/formations'
                ]);
                $data['image'] = $upload->getSecurePath();
            }

            $formation = Formation::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Formation créée avec succès',
                'formation' => $formation
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $formation = Formation::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'prix' => 'sometimes|required',
                'duree' => 'sometimes|required|string',
                'nb_modules' => 'sometimes|required',
                'categorie' => 'sometimes|required|string',
                'public_cible' => 'sometimes|required|string',
                'statut' => 'sometimes|required|in:actif,inactif', 
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // On exclut l'image et le _method du remplissage automatique
            $data = $request->except(['image', '_method']);

            if ($request->hasFile('image')) {
                $upload = cloudinary()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'pschool/formations'
                ]);
                $data['image'] = $upload->getSecurePath();
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
        $formation = Formation::find($id);
        if ($formation) {
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
        $formations = Formation::where('formateur_id', auth()->id())->get();
        return response()->json($formations, 200);
    }
}