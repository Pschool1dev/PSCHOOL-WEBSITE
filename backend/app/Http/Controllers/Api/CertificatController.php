<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificat;
use App\Models\Inscription;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificatController extends Controller
{
    // Vérifier si l'utilisateur peut générer un certificat
    public function verifierDisponibilite($formationId)
    {
        try {
            $user = auth()->user();
            
            $inscription = Inscription::where('user_id', $user->id)
                ->where('formation_id', $formationId)
                ->first();
            
            if (!$inscription) {
                return response()->json([
                    'disponible' => false,
                    'message' => 'Vous n\'êtes pas inscrit à cette formation'
                ], 404);
            }
            
            // Vérifier si le certificat existe déjà
            $certificatExistant = Certificat::where('inscription_id', $inscription->id)->first();
            
            if ($certificatExistant) {
                return response()->json([
                    'disponible' => true,
                    'certificat' => $certificatExistant,
                    'message' => 'Certificat déjà généré'
                ]);
            }
            
            // Vérifier les conditions
            $peutGenerer = $inscription->progression >= 100 && $inscription->statut_paiement === 'paye';
            
            return response()->json([
                'disponible' => $peutGenerer,
                'progression' => $inscription->progression,
                'statut_paiement' => $inscription->statut_paiement,
                'message' => $peutGenerer ? 'Vous pouvez générer votre certificat' : 'Conditions non remplies'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur vérification certificat: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // Générer un certificat (à compléter dans la prochaine étape)
public function generer(Request $request)
{
    $validator = Validator::make($request->all(), [
        'inscription_id' => 'required|exists:inscriptions,id'
    ]);
    
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }
    
    $inscription = Inscription::with(['user', 'formation'])
        ->where('user_id', auth()->id())
        ->findOrFail($request->inscription_id);
    
    // Vérifier les conditions
    if (!$inscription->peutGenererCertificat()) {
        return response()->json([
            'message' => 'Conditions non remplies pour générer le certificat'
        ], 400);
    }
    
    // Vérifier si le certificat n'existe pas déjà
    $certificatExistant = Certificat::where('inscription_id', $inscription->id)->first();
    
    if ($certificatExistant) {
        return response()->json([
            'message' => 'Certificat déjà généré',
            'certificat' => $certificatExistant
        ], 200);
    }
    
    // Générer le numéro de certificat unique
    $numeroCertificat = $this->genererNumeroCertificat($inscription->formation_id);
    
    // Créer l'enregistrement du certificat
    $certificat = Certificat::create([
        'inscription_id' => $inscription->id,
        'user_id' => $inscription->user_id,
        'formation_id' => $inscription->formation_id,
        'numero_certificat' => $numeroCertificat,
        'date_delivrance' => now(),
        'statut' => 'valide',
        'note' => $this->calculerNote($inscription->id)
    ]);
    
    // Générer le QR code
    $this->genererQrCode($certificat);
    
    // Générer le PDF
    $pdf = Pdf::loadView('pdf.certificat', ['certificat' => $certificat]);
    $pdfContent = $pdf->output();
    
    // Définir le chemin du fichier
    $fileName = 'certificats/' . $certificat->numero_certificat . '.pdf';
    
    // Stocker le PDF
    Storage::disk('public')->put($fileName, $pdfContent);
    
    // Mettre à jour le certificat avec le chemin du fichier
    $certificat->update([
        'fichier_pdf' => $fileName
    ]);
    
    return response()->json([
        'success' => true,
        'message' => 'Certificat généré avec succès',
        'certificat' => $certificat
    ], 201);
}
    
    // Récupérer tous les certificats de l'utilisateur connecté
    public function mesCertificats()
    {
        try {
            $certificats = Certificat::with(['formation'])
                ->where('user_id', auth()->id())
                ->orderBy('date_delivrance', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'certificats' => $certificats
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur récupération certificats: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // Récupérer un certificat spécifique
    public function show($id)
    {
        try {
            $certificat = Certificat::with(['formation', 'user'])
                ->where('user_id', auth()->id())
                ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'certificat' => $certificat
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Certificat non trouvé'], 404);
        }
    }
    
public function telecharger($id)
{
    try {
        $certificat = Certificat::with(['formation', 'user'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);
        
        if (!$certificat->fichier_pdf || !Storage::disk('public')->exists($certificat->fichier_pdf)) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }
        
        return response()->download(
            Storage::disk('public')->path($certificat->fichier_pdf),
            'certificat_' . $certificat->numero_certificat . '.pdf'
        );
        
    } catch (\Exception $e) {
        return response()->json(['error' => 'Certificat non trouvé'], 404);
    }
}
    
    // Vérifier l'authenticité d'un certificat (public)
    public function verifierAuthenticite($numeroCertificat)
    {
        try {
            $certificat = Certificat::with(['user', 'formation'])
                ->where('numero_certificat', $numeroCertificat)
                ->first();
            
            if (!$certificat) {
                return response()->json([
                    'valide' => false,
                    'message' => 'Certificat introuvable'
                ], 404);
            }
            
            return response()->json([
                'valide' => true,
                'certificat' => [
                    'numero' => $certificat->numero_certificat,
                    'apprenant' => $certificat->user->nom,
                    'formation' => $certificat->formation->titre,
                    'date_delivrance' => $certificat->date_delivrance->format('d/m/Y'),
                    'statut' => $certificat->statut
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // --- Méthodes privées ---
    
    private function genererNumeroCertificat($formationId)
    {
        $prefix = 'PSC';
        $year = date('Y');
        $count = Certificat::whereYear('created_at', $year)->count() + 1;
        
        return $prefix . '-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
    private function genererQrCode($certificat)
{
    // Pour l'instant, on garde cette méthode vide
    // On ajoutera la génération du QR code plus tard
    return;
}
    
    private function calculerNote($inscriptionId)
    {
        // À implémenter : calculer la note moyenne des quiz
        // Pour l'instant, retourner une note par défaut
        return 85;
    }
}