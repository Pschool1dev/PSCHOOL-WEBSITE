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
      
      toast.success("Demande d'inscription enregistrée !");
      setTimeout(() => {
        navigate('/apprenant');
      }, 2000);

    } catch (error) {
      const messageErreur = error.response?.data?.message || "Erreur lors de l'inscription.";
      toast.error(messageErreur);
      console.error("Détails erreur inscription:", error.response);
    }
  };

  if (chargement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500">Chargement de la formation...</p>
      </div>
    );
  }

  if (erreur || !formation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oups !</h2>
        <p className="text-gray-500 mb-6">Impossible de charger les détails de cette formation.</p>
        <Link to="/" className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors">
          Retourner à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            
            {/* Section Image */}
            <div className="md:w-2/5 h-56 md:h-auto relative bg-gray-100">
              <img 
                src={formation.image} 
                alt={formation.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                  {formation.categorie}
                </span>
              </div>
            </div>

            {/* Section Contenu */}
            <div className="md:w-3/5 p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                Inscription à la formation
              </h1>
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                {formation.titre}
              </h2>
              
              <div className="flex gap-3 mb-6">
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  <p className="text-xs text-gray-500 uppercase font-medium">Durée</p>
                  <p className="text-sm font-semibold text-gray-700">{formation.duree}</p>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded-md border border-green-200">
                  <p className="text-xs text-green-600 uppercase font-medium">Tarif</p>
                  <p className="text-sm font-semibold text-green-700">{Number(formation.prix).toLocaleString()} FCFA</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {formation.description}
              </p>

              {/* LOGIQUE CONDITIONNELLE : PARENT VS APPRENANT */}
              {user?.role === 'parent' ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 text-sm mb-3">
                    Note aux parents : Veuillez inscrire vos enfants directement depuis votre espace de gestion.
                  </p>
                  <button 
                    onClick={() => navigate('/parent')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Aller dans mon espace parent
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-600 text-sm mb-3 text-center">
                    Finaliser votre inscription personnelle
                  </p>
                  <button 
                    onClick={handlePaiementApprenant}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                  >
                    Confirmer votre inscription
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
            ← Retour aux formations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InscriptionFormation;