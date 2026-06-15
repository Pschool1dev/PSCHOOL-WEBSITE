import { useState, useEffect } from 'react';
import { HiOutlineHome, HiOutlineBookOpen, HiOutlineCreditCard, HiOutlineCog } from 'react-icons/hi';
import api from '../../../services/api'; 
import Statistiques from './Statistiques';

const AdminVueGenerale = () => {
  // 1. Initialisation de l'état avec toutes les propriétés indispensables aux graphiques
  const [realStats, setRealStats] = useState({
   
    totalFormations: 0,
    totalRevenus: 0,
    totalAdultes: 0,
    totalEnfants: 0,
    donneesEvolution: [],
    donneesFormations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
 

        if (response) {
          // 2. On passe directement l'objet complet reçu de Laravel
          setRealStats({
           
            totalFormations: response.totalFormations || 0,
            totalRevenus: response.totalRevenus || 0,
            totalAdultes: response.totalAdultes || 0,
            totalEnfants: response.totalEnfants || 0,
            donneesEvolution: response.donneesEvolution || [],
            donneesFormations: response.donneesFormations || []
          });
        }
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="p-12 text-center text-gray-400 italic">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      Chargement des statistiques de P.School
    </div>
  );

  return (
    <>


      
      <Statistiques data={realStats} />
    </>
  );
};

export default AdminVueGenerale;