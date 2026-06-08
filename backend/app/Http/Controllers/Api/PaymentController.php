<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use App\Models\CinetpayTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    // 1. Initier un paiement CinetPay
    public function initiatePayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'inscription_id' => 'required|exists:inscriptions,id',
            'telephone' => 'required|string',
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $inscription = Inscription::with('formation')->findOrFail($request->inscription_id);
        
        $transactionId = 'PSCHOOL_' . time() . '_' . uniqid();
        
        $cinetpayTransaction = CinetpayTransaction::create([
            'transaction_id' => $transactionId,
            'inscription_id' => $inscription->id,
            'user_id' => auth()->id(),
            'amount' => $inscription->montant_paye,
            'currency' => 'XAF',
            'status' => 'pending',
            'customer_phone' => $request->telephone,
            'customer_email' => $request->email,
            'metadata' => [
                'formation_id' => $inscription->formation_id,
                'formation_titre' => $inscription->formation->titre
            ]
        ]);
        
        // À remplacer par les vraies valeurs en production
        $paymentData = [
            'apikey' => env('CINETPAY_API_KEY'),
            'site_id' => env('CINETPAY_API_PASSWORD'),
            'transaction_id' => $transactionId,
            'amount' => $inscription->montant_paye,
            'currency' => 'XAF',
            'description' => 'Inscription - ' . $inscription->formation->titre,
            'customer_name' => auth()->user()->nom,
            'customer_email' => $request->email,
            'customer_phone_number' => $request->telephone,
            'notify_url' => env('CINETPAY_NOTIFY_URL', 'https://ton-domaine.com/api/payment/callback'),
            'return_url' => env('CINETPAY_RETURN_URL', 'https://ton-domaine.com/api/payment/return'),
            'metadata' => json_encode(['inscription_id' => $inscription->id])
        ];
        
        try {
            $response = Http::timeout(30)->post('https://api-checkout.cinetpay.com/v2/payment', $paymentData);
            
            if ($response->successful() && $response->json('code') === '201') {
                return response()->json([
                    'success' => true,
                    'payment_url' => $response->json('payment_url'),
                    'transaction_id' => $transactionId
                ]);
            }
            
            $cinetpayTransaction->update(['status' => 'failed']);
            
            return response()->json([
                'success' => false,
                'message' => $response->json('message') ?? 'Erreur lors de l\'initialisation'
            ], 500);
        } catch (\Exception $e) {
            $cinetpayTransaction->update(['status' => 'failed']);
            Log::error('Erreur paiement CinetPay: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur de connexion au service de paiement'
            ], 500);
        }
    }
    
    // 2. Webhook - Callback reçu de CinetPay
    public function handleCallback(Request $request)
    {
        Log::channel('payment')->info('Callback CinetPay reçu', $request->all());
        
        $transactionId = $request->input('cpm_trans_id');
        $paymentStatus = $request->input('status');
        
        $transaction = CinetpayTransaction::where('transaction_id', $transactionId)->first();
        
        if (!$transaction) {
            Log::channel('payment')->error('Transaction non trouvée', ['transaction_id' => $transactionId]);
            return response()->json(['error' => 'Transaction not found'], 404);
        }
        
        if ($paymentStatus === 'PAID') {
            $transaction->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $request->input('payment_method')
            ]);
            
            $inscription = $transaction->inscription;
            $inscription->update([
                'statut_paiement' => 'paye',
                'statut' => 'confirmee',
                'paiement_type' => 'cinetpay',
                'cinetpay_transaction_id' => $transaction->id
            ]);
        }
        
        return response()->json(['message' => 'OK'], 200);
    }
    
    // 3. Redirection après paiement
    public function handleReturn(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        $status = $request->input('status');
        
        if ($status === 'PAID') {
            return redirect()->to(env('FRONTEND_URL', 'http://localhost:3000') . '/paiement/succes?transaction_id=' . $transactionId);
        }
        
        return redirect()->to(env('FRONTEND_URL', 'http://localhost:3000') . '/paiement/erreur');
    }
}