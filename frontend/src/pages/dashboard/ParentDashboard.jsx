import { Routes, Route } from 'react-router-dom';
import ParentLayout from '../../components/dashboard/common/ParentLayout';
import MesEnfants from '../../components/dashboard/parent/MesEnfants';
import ProfilParent from '../../components/dashboard/parent/ProfilParent';
import ParentPaiements from '../../components/dashboard/parent/ParentPaiements';
const ParentDashboard = () => {


  return (
    <ParentLayout title="Espace Parent">
      <Routes>

  <Route index element={<MesEnfants />} /> 
  

  <Route path="profil" element={<ProfilParent />} /> 
  

  <Route path="paiements" element={<ParentPaiements />} />
</Routes>
    </ParentLayout>
  );
};

export default ParentDashboard;