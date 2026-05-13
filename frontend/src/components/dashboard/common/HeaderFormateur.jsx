import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { HiOutlineBell, HiOutlineLogout, HiChevronDown } from 'react-icons/hi';
import { CgProfile } from "react-icons/cg";
import api from '../../../services/api';
import toast from 'react-hot-toast';

const HeaderFormateur = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Formateur', initials: 'F' });
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      const rawData = localStorage.getItem('user');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const nameToDisplay = parsed.name || parsed.nom || parsed.username || "Formateur";
          
          const formattedName = nameToDisplay
            .split(' ')
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          const initials = formattedName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

          setUserData({ name: formattedName, initials: initials });
        } catch (e) { console.error("Erreur parsing", e); }
      }
    };
    syncUser();
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await api.logout(); 
      toast.success("À bientôt !");
    } catch (error) { console.error(error); } 
    finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-slate-100">
  {/* Élément 1 : Le message de bienvenue */}
  <div className="flex flex-col">
    <h1 className="text-xl font-medium text-slate-700">
      Bienvenue ,  <span className="text-emerald-600 font-semibold">{userData.name}</span>
    </h1>
  </div>

  {/* Élément 2 : Le bouton de notification (maintenant indépendant au centre) */}
  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative">
    <HiOutlineBell className="h-6 w-6" />
    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
  </button>

  {/* Élément 3 : Le menu profil (à droite) */}
  <div className="relative">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-slate-50 transition-all"
    >
      <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">
        {userData.initials}
      </div>
      <HiChevronDown
        className={`h-4 w-4 text-slate-400 transition-transform ${
          dropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* Contenu du Dropdown */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
        <Link
          to="/formateur/profil"
          className="flex items-center px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          onClick={() => setDropdownOpen(false)}
        >
          <CgProfile className="h-4 w-4 mr-3 text-slate-400" /> Mon profil
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <HiOutlineLogout className="h-4 w-4 mr-3" /> Déconnexion
        </button>
      </div>
    )}
  </div>
</header>

  );
};

export default HeaderFormateur; 