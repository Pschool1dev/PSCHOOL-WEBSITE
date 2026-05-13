import { Routes, Route, Navigate } from 'react-router-dom';
import FormateurLayout from '../../components/dashboard/common/FormateurLayout';


import MesFormations from '../../components/dashboard/formateur/MesFormations';
import GestionCours from '../../components/dashboard/formateur/GestionCours';
import CoursDetails from '../../components/dashboard/formateur/CoursDetails';
import VueEnsemble from '../../components/dashboard/formateur/VueEnsemble';
import Monprofile from '../../components/dashboard/formateur/Monprofile';


const FormateurDashboard = () => {
  return (
    <FormateurLayout title="Tableau de bord Formateur">
      <Routes>
        {/* LA CORRECTION : Utilise path="" ou path="/" pour la page d'accueil du dashboard */}
        <Route path="/" element={<VueEnsemble />} />
        
        {/* Tes autres routes restent identiques */}
        <Route path="mes-formations" element={<MesFormations />} />
        <Route path="gestion-cours" element={<GestionCours />} />
        <Route path="gestion-cours/:id" element={<CoursDetails />} />
        <Route path="profil" element={<Monprofile />} />

        {/* Redirection si la route est inconnue vers la racine du dashboard */}
        <Route path="*" element={<Navigate to="/formateur" replace />} />
      </Routes>
    </FormateurLayout>
  );
};

export default FormateurDashboard;