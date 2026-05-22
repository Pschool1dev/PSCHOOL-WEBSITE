<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InscriptionSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InscriptionSessionController extends Controller
{   public function store(Request $request)
    {
        // 1. Validation stricte
        $validator = Validator::make($request->all(), [
            'session_id' => 'required',
            'parent_nom' => 'required',
            'parent_adresse' => 'required',
            'parent_contact' => 'required',
            'zone' => 'required',
            'session_choisie' => 'required',
            'source_information' => 'required|in:Proche,Réseaux sociaux,Médias', // FORCÉ
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // 2. Création sécurisée
            $data = $request->only([
                'session_id', 'parent_nom', 'parent_adresse', 'parent_contact', 
                'eleve_nom', 'eleve_age', 'eleve_niveau', 'eleve_etablissement', 
                'zone', 'session_choisie', 'source_information'
            ]);
            
            $data['user_id'] = auth()->id();
            $data['statut'] = 'en_attente';

            $inscription = InscriptionSession::create($data);

            return response()->json(['message' => 'Inscription réussie', 'data' => $inscription], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'enregistrement', 'details' => $e->getMessage()], 500);
        }
    }
    public function mesInscriptionsSessions()
    {
        return InscriptionSession::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
    }
}