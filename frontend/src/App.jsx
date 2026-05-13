import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/footer';
import Accueil from './components/visitor/Vitrine';
import Login from './pages/Login';
import Register from './pages/Register';
import AutoLogin from './pages/AutoLogin';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ApprenantDashboard from './pages/dashboard/ApprenantDashboard';
import FormateurDashboard from './pages/dashboard/FormateurDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import SuiviEnfant from './components/dashboard/parent/SuiviEnfant';
import CoursePlayer from './pages/CoursePlayer';

import InscriptionFormation from './pages/InscriptionFormation';


const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Accueil />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <Routes>
          {/* Pages sans Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login/auto" element={<AutoLogin />} />
          {/* Dashboard (sans Navbar) */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/apprenant/*" element={<ApprenantDashboard />} />
          <Route path="/formateur/*" element={<FormateurDashboard />} />
          <Route path="/parent/*" element={<ParentDashboard />} />
          <Route path="/parent/suivi-enfant/:enfantId" element={<SuiviEnfant />} />
          <Route 
            path="/inscription/:formationId" 
            element={<PrivateRoute><InscriptionFormation /></PrivateRoute>} 
          />
          <Route path="/apprenant/formation/:id" element={<CoursePlayer />} />
          {/* Pages publiques avec Navbar */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;