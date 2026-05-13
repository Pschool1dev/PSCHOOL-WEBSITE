import { Routes, Route } from 'react-router-dom';
import ApprenantLayout from '../../components/dashboard/common/ApprenantLayout';
import MesFormations from '../../components/dashboard/apprenant/MesFormations';


import MonProfil from '../../components/dashboard/apprenant/MonProfil';

const ApprenantDashboard = () => {
  return (
    <ApprenantLayout title="Tableau de bord">
      <Routes>
        <Route path="/" element={<MesFormations />} />
       

        <Route path="profil" element={<MonProfil />} />
      </Routes>
    </ApprenantLayout>
  );
};

export default ApprenantDashboard;