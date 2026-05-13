import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { HiOutlineAcademicCap, HiOutlineArrowLeft } from 'react-icons/hi';

const SuiviEnfant = () => {
    const { enfantId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuivi = async () => {
            try {
                const res = await api.get(`/parent/suivi-enfant/${enfantId}`);
                setData(res);
            } catch (error) {
                console.error("Erreur de suivi", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuivi();
    }, [enfantId]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!data || !data.enfant) return <div className="p-8 text-center text-gray-500">Données indisponibles.</div>;

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen">
            {/* Bouton Retour */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8 text-sm font-medium"
            >
                <HiOutlineArrowLeft /> Retour à la liste
            </button>

            <div className="mb-10">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Tableau de bord de <span className="text-orange-500">{data.enfant.nom}</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Aperçu de la progression pédagogique</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.inscriptions?.map((ins) => (
                    <div key={ins.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        {/* Image de la formation */}
                        <div className="relative h-48 bg-gray-100">
                            {ins.formation?.image ? (
                               <img 
                                src={ins.formation.image.startsWith('http') 
                                    ? ins.formation.image 
                                    : `http://localhost:8000/storage/${ins.formation.image}`
                                } 
                                alt={ins.formation.titre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                
                                    e.target.style.display = 'none'; 
                                    e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-100"><svg class="w-12 h-12 text-blue-500" ...></svg></div>';
                                }}
                                    />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <HiOutlineAcademicCap className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                            
                            {/* Badge de statut plus discret */}
                            <div className="absolute top-4 left-4">
                                <span className={`text-[10px] font-medium px-3 py-1 rounded-full shadow-sm ${
                                    ins.statut === 'en_attente' 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {ins.statut === 'en_attente' ? 'Vérification en cours' : 'Formation active'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="font-medium text-gray-800 text-lg mb-4 line-clamp-1">
                                {ins.formation?.titre}
                            </h3>

                            {/* Barre de progression épurée */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Avancement</span>
                                    <span className="text-sm font-semibold text-gray-700">0%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-orange-500 h-full rounded-full transition-all duration-700" 
                                        style={{ width: '0%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuiviEnfant;