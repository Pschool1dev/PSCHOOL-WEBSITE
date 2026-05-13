import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { HiOutlineBell, HiOutlineLogout, HiChevronDown, HiOutlineMailOpen, HiX } from 'react-icons/hi';
import { CgProfile } from "react-icons/cg";
import api from '../../../services/api';
import toast from 'react-hot-toast';

const HeaderApprenant = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); // État pour le menu notifications
  const [userData, setUserData] = useState({ name: 'Apprenant', initials: 'A' });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Charger les infos utilisateur
  useEffect(() => {
    const syncUser = () => {
      const rawData = localStorage.getItem('user');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const nameToDisplay = parsed.name || parsed.nom || parsed.username || "Apprenant";
          const formattedName = nameToDisplay.split(' ').filter(Boolean).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
          const initials = formattedName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
          setUserData({ name: formattedName, initials: initials });
        } catch (e) { console.error("Erreur parsing", e); }
      }
    };
    syncUser();
  }, []);

  //  Charger les notifications depuis l'API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/apprenant/notifications');
      setNotifications(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Erreur chargement notifications", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Optionnel : rafraîchir toutes les 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.est_lu).length;

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

  const markAsRead = async (id) => {
  try {
    await api.put(`/notifications/${id}/lire`);
    
    // Mise à jour de l'état local
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === id ? { ...n, est_lu: 1 } : n 
      )
    );
  } catch (err) { 
    console.error("Erreur markAsRead:", err); 
  }
};
console.log("Notifs non lues :", notifications.filter(n => !n.est_lu));

  return (
    <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-[100]">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-slate-700">
          Bienvenue , <span className="text-emerald-600 font-semibold">{userData.name}</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-5">
        {/* SECTION NOTIFICATIONS */}
        <div className="relative">
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            className={`p-2 rounded-xl transition-all relative ${notifOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <HiOutlineBell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* MENU DÉROULANT DES NOTIFS */}
          {notifOpen && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="font-bold text-slate-700 text-sm">Notifications</span>
                <button onClick={() => setNotifOpen(false)}><HiX className="text-slate-400" /></button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-5 border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${!n.est_lu ? 'bg-emerald-50/40 hover:bg-emerald-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.est_lu ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                        <div>
                          <p className={`text-xs ${!n.est_lu ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{n.titre}</p>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-slate-400 mt-2 font-medium">
                            {new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <HiOutlineMailOpen className="mx-auto h-8 w-8 text-slate-200 mb-2" />
                    <p className="text-xs text-slate-400 italic">Aucun message pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* SECTION PROFIL */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-slate-50 transition-all"
          >
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">
              {userData.initials}
            </div>
            <HiChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
              <Link to="/apprenant/profil" className="flex items-center px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                <CgProfile className="h-4 w-4 mr-3 text-slate-400" /> Mon profil
              </Link>
              <button onClick={handleLogout} className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <HiOutlineLogout className="h-4 w-4 mr-3" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderApprenant;