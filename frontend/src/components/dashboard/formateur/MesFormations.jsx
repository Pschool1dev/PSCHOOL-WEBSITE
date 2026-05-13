import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api'; 
import { HiOutlineBookOpen, HiOutlineAcademicCap } from 'react-icons/hi';

const MesFormations = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyFormations = async () => {
      try {
        setLoading(true);
        const data = await api.get('/formateur/formations');
        setFormations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur :", error);
        setFormations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyFormations();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Mes Formations</h1>
        <p className="text-slate-500">Liste des formations qui vous sont attribuées</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.length > 0 ? (
            formations.map((formation) => (
              <div key={formation.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={formation.image || '/assets/placeholder-course.png'} 
                    alt={formation.titre} 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {formation.statut}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-2 truncate">{formation.titre}</h3>
                  <div className="flex items-center text-xs text-slate-500 mb-4">
                    <HiOutlineAcademicCap className="mr-1" />
                    <span>{formation.categorie}</span>
                  </div>
                  
                  {/* REDIRECTION VERS L'ONGLET GESTION DES COURS */}
                  <Link 
                    to={`/formateur/gestion-cours/${formation.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <HiOutlineBookOpen className="w-5 h-5" />
                    Gérer les chapitres
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <h3 className="text-slate-800 font-bold">Aucune formation attribuée</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MesFormations;