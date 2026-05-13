<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Formation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EnfantController extends Controller
{
    public function index()
    {
        return response()->json(User::where('parent_id', auth()->id())->get());
    }

  public function store(Request $request)
{
    return DB::transaction(function () use ($request) {
        
        // 1. Création du compte dans 'users'
            $username = strtolower($request->prenom) . rand(100, 999);
            $userEnfant = User::create([
            'nom' => $request->prenom . ' ' . $request->nom,
            'username' => $username,
            'email' => $username . '@pschool.ci',
            'password' => Hash::make('pschool2026'),
            'type' => 'apprenant',
            'role' => 'user',
            'parent_id' => auth()->id(), 
            
          
            'age' => $request->age,
            'nom_ecole' => $request->nom_ecole,
            'niveau_etude' => $request->niveau_etude,
            'localite' => $request->localite_ecole, 
        ]);

    
        if ($request->has('formations_interet')) {
           
            $formations = \App\Models\Formation::whereIn('titre', $request->formations_interet)->get();

            foreach ($formations as $formation) { 
                DB::table('inscriptions')->insert([
                    'user_id' => $userEnfant->id,
                    'formation_id' => $formation->id,
                    'montant_paye' => $formation->prix, 
                    'date_inscription' => now(),
                    'statut' => 'en_attente',
                    //'paiement_statut' => 'en_attente',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'credentials' => [
                'username' => $username,
                'password' => 'pschool2026'
            ]
        ], 201);
    });
}
}