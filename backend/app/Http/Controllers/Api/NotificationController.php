<?php

namespace App\Http\Controllers\Api; // Namespace mis à jour

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Envoyer une notification (Utilisé par le Formateur)
    public function envoyerNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'titre' => 'required|string',
            'message' => 'required|string'
        ]);

        Notification::create([
            'user_id' => $request->user_id,
            'titre' => $request->titre,
            'message' => $request->message,
            'type' => 'message',
            'est_lu' => false
        ]);

        return response()->json(['success' => true]);
    }

    // Récupérer les notifications (Utilisé par l'Apprenant)
    public function index()
    {
        return Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Marquer une notification comme lue
    public function marquerCommeLu($id)
    {
        try {
            $notification = Notification::where('id', $id)
                ->where('user_id', auth()->id())
                ->first();

            if ($notification) {
                $notification->update(['est_lu' => true]);
                return response()->json(['success' => true]);
            }

            return response()->json(['error' => 'Notification non trouvée'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}