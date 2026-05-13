<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\Enfant; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    public function getStats()
    {
        try {
            // 1. Total Apprenants = Adultes (inscriptions) + Enfants
            $totalAdultes = Inscription::whereHas('user', function($q) {
                $q->whereNotIn('role', ['parent', 'admin']);
            })->count();
            
            $totalEnfants = Enfant::count();

           
            $revenusAdultes = Inscription::where('statut', 'confirmee')->sum('montant_paye');
            $revenusEnfants = Enfant::count() * 50000; 

            return response()->json([
                'totalApprenants' => $totalAdultes + $totalEnfants,
                'totalFormations' => Formation::count(),
                'totalInscriptions' => $totalAdultes + $totalEnfants,
                'totalRevenus' => $revenusAdultes + $revenusEnfants,
                'totalEnfants' => $totalEnfants, 
                'totalAdultes' => $totalAdultes, 
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
public function getFormateurDashboard()
{
    $formateurId = auth()->id();
    $formationIds = Formation::where('formateur_id', $formateurId)->pluck('id');

    if ($formationIds->isEmpty()) {
        return response()->json([
            'stats' => ['apprenants' => 0, 'formations' => 0, 'reussite' => '0%'],
            'apprenants' => []
        ]);
    }

    // 1. Nombre total d'inscriptions
    $totalInscriptions = DB::table('inscriptions')
        ->whereIn('formation_id', $formationIds)
        ->count();

    // 2. Nombre d'apprenants ayant terminé (ex: progression > 80%)
    $apprenantsTermines = DB::table('inscriptions')
        ->whereIn('formation_id', $formationIds)
        ->where('progression', '>=', 80) // Seuil de réussite
        ->count();

    // 3. Calcul du pourcentage de réussite
    $tauxReussite = $totalInscriptions > 0 
        ? round(($apprenantsTermines / $totalInscriptions) * 100) 
        : 0;

    // 4. Liste des apprenants (identique à avant)
    $suiviApprenants = DB::table('inscriptions')
        ->join('users', 'inscriptions.user_id', '=', 'users.id')
        ->join('formations', 'inscriptions.formation_id', '=', 'formations.id')
        ->whereIn('inscriptions.formation_id', $formationIds)
        ->select(
            'users.id',
            'users.nom as nom',
            'formations.titre as formation',
            'inscriptions.progression',
            'inscriptions.updated_at as derniereActivite'
        )
        ->orderBy('inscriptions.updated_at', 'desc')
        ->get();

    return response()->json([
        'stats' => [
            'apprenants' => DB::table('inscriptions')->whereIn('formation_id', $formationIds)->distinct('user_id')->count(),
            'formations' => $formationIds->count(),
            'reussite' => $tauxReussite . '%',
        ],
        'apprenants' => $suiviApprenants
    ]);
}
}