import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineUsers, 
  HiOutlineBookOpen, 
  HiOutlineClipboardList, 
  HiOutlineCreditCard 
} from 'react-icons/hi';

import api from '../../services/api'; 
import AdminLayout from '../../components/dashboard/common/AdminLayout';

import GestionUtilisateurs from '../../components/dashboard/admin/GestionUtilisateurs';
import GestionFormations from '../../components/dashboard/admin/GestionFormations';
import GestionServices from '../../components/dashboard/admin/GestionServices';
import GestionInscriptions from '../../components/dashboard/admin/GestionInscriptions';
import GestionPaiements from '../../components/dashboard/admin/GestionPaiements';
import GestionLogs from '../../components/dashboard/admin/GestionLogs';
import MonProfil from '../../components/dashboard/admin/MonProfil';

const AdminDashboard = () => {
  const [realStats, setRealStats] = useState({
    totalApprenants: 0,
    totalFormations: 0,
   
    totalRevenus: 0
  });

 useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      
      console.log("Données reçues directement :", response);

   
      if (response) {
        setRealStats({
          totalApprenants: response.totalApprenants || 0,
          totalFormations: response.totalFormations || 0,
       
          totalRevenus: response.totalRevenus || 0
        });
      }
    } catch (error) {
      console.error("Erreur API:", error);
    }
  };
  fetchStats();
}, []);

  return (
    <AdminLayout title="Tableau de bord">
      <Routes>
        <Route path="/" element={
          
          <div key={realStats.totalInscriptions} className="p-1">
            <h2 className="text-2xl font-bold text-blue-600">Bienvenue sur votre espace d'administration</h2>
            <p className="text-gray-600 mt-2">
              Gérez la plateforme <span className='font-bold text-black'>P.School</span> depuis ce tableau de bord.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Carte 1 */}
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Total apprenants</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-1">{realStats.totalApprenants}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg"><HiOutlineUsers className="h-6 w-6 text-blue-500" /></div>
                </div>
              </div>

              {/* Carte 2 */}
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Total formations</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-1">{realStats.totalFormations}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg"><HiOutlineBookOpen className="h-6 w-6 text-blue-600" /></div>
                </div>
              </div>

              {/* Carte 3 */}
              

              {/* Carte 4 */}
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase">Revenus</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-1">
                      {new Intl.NumberFormat('fr-FR').format(realStats.totalRevenus)} FCFA
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg"><HiOutlineCreditCard className="h-6 w-6 text-emerald-500" /></div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[10px] text-green-600 font-bold">
              Dernière synchro réussie : {new Date().toLocaleTimeString()}
            </div>
          </div>
        } />
        
        <Route path="utilisateurs" element={<GestionUtilisateurs />} />
        <Route path="formations" element={<GestionFormations />} />
        <Route path="services" element={<GestionServices />} />
        <Route path="inscriptions" element={<GestionInscriptions/>}/>
        <Route path="paiements" element={<GestionPaiements />} />
        <Route path="logs" element={<GestionLogs />} />
        <Route path="profil" element={<MonProfil />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;