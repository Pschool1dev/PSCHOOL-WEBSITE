import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AutoLogin = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        
        const token = searchParams.get('token');

        if (token) {
            const handleAutoLogin = async () => {
                // On utilise la fonction de ton AuthContext
                const result = await loginWithToken(token);

                if (result.success) {
                    toast.success("Connexion réussie !");
                    // On envoie l'enfant vers son espace
                    navigate('/apprenant/dashboard');
                } else {
                    toast.error("Badge invalide ou expiré");
                    navigate('/login');
                }
            };
            handleAutoLogin();
        } else {
            // Si pas de token, retour au login classique
            navigate('/login');
        }
    }, [searchParams, loginWithToken, navigate]);

    // Un bel écran de transition "Dark Modern"
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
            <h2 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-xs">
                P.School Academy
            </h2>
            <p className="text-gray-500 text-[10px] mt-2">VÉRIFICATION DU BADGE...</p>
        </div>
    );
};

export default AutoLogin;