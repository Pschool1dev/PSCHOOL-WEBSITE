import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const InscriptionFormation = () => {
  const { formationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [formation, setFormation] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        setChargement(true);
       
        const data = await api.get(`/formations/${formationId}`);
        setFormation(data);
        setErreur(false);
      } catch (err) {
        console.error("Erreur de récupération:", err);
        setErreur(true);
      } finally {
        setChargement(false);
      }
    };

    if (formationId) {
      fetchFormation();
    }
  }, [formationId]);
const handlePaiementApprenant = async () => {
  try {
    await api.post('/inscriptions', {
      formation_id: formation.id,
      montant: formation.prix
    });
    
    // Toast Succès avec style Dark
    toast.success("Demande d'inscription enregistrée !", {
      style: {
        borderRadius: '12px',
        background: '#1e293b', 
        color: '#fff',
        border: '1px solid #22c55e' // Bordure verte pour le succès
      },
    });

    setTimeout(() => {
      navigate('/apprenant');
    }, 2000);

  } catch (error) {
    // On récupère le message précis du backend (ex: "Vous êtes déjà inscrit")
    const messageErreur = error.response?.data?.message || "Erreur lors de l'inscription.";
    
    toast.error(messageErreur, {
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
        border: '1px solid #ef4444' // Bordure rouge pour l'erreur
      },
    });
    
    console.error("Détails erreur inscription:", error.response);
  }
};

  if (chargement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold">Chargement de la formation...</p>
      </div>
    );
  }

  if (erreur || !formation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-center px-4">
        <h2 className="text-2xl font-black text-white mb-2">Oups !</h2>
        <p className="text-slate-400 mb-6">Impossible de charger les détails de cette formation.</p>
        <Link to="/" className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg">
          Retourner à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800">
          <div className="flex flex-col md:flex-row">
            
            {/* Section Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={formation.image} 
                alt={formation.titre}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-green-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-xl">
                  {formation.categorie}
                </span>
              </div>
            </div>

            {/* Section Contenu */}
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <h1 className="text-3xl font-black text-white mb-4 leading-tight">
                Inscription à la formation : <br/>
                <span className="text-green-500">{formation.titre}</span>
              </h1>
              
              <div className="flex gap-4 mb-8">
                <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Durée</p>
                  <p className="text-sm font-bold text-slate-200">{formation.duree}</p>
                </div>
                <div className="bg-green-900/20 px-4 py-2 rounded-xl border border-green-500/20">
                  <p className="text-[9px] text-green-500 font-black uppercase">Tarif</p>
                  <p className="text-sm font-bold text-green-400">{Number(formation.prix).toLocaleString()} FCFA</p>
                </div>
              </div>

              <p className="text-slate-400 mb-10 text-sm leading-relaxed italic">
                "{formation.description}"
              </p>

              {/* LOGIQUE CONDITIONNELLE : PARENT VS APPRENANT */}
              {user?.role === 'parent' ? (
                <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
                  <p className="text-blue-400 text-xs font-bold mb-4 text-center">
                    Note aux parents : Veuillez inscrire vos enfants directement depuis votre espace de gestion.
                  </p>
                  <button 
                    onClick={() => navigate('/parent')}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                  >
                    Aller dans mon Espace Parent
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 text-[10px] font-bold mb-4 uppercase text-center tracking-widest">
                    Finaliser votre inscription personnelle
                  </p>
                  <button 
                    onClick={handlePaiementApprenant}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                  >
                    Confirmer votre inscription
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-500 hover:text-green-500 text-sm font-bold transition-colors">
            ← Retour aux formations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InscriptionFormation;