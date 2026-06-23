import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineMenu, HiOutlineBookOpen,
  HiOutlineUser, HiOutlineLogout, HiChevronRight, HiX
} from 'react-icons/hi';
import { useAuth } from '../../../contexts/AuthContext';

const SidebarApprenant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('Apprenant');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserName(userData.nom || userData.username || 'Apprenant');
        } catch (e) { console.error(e); }
      }
    };
    syncUser();

    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: '/apprenant', name: 'Mes formations', icon: HiOutlineBookOpen },
    { path: '/apprenant/profil', name: 'Mon profil', icon: HiOutlineUser },
  ];

  return (
    <>
      {/* Bouton hamburger - visible uniquement sur mobile */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <HiOutlineMenu className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        
        {/* Logo Section avec bouton fermeture mobile */}
        <div className="px-8 py-10 flex flex-col items-center border-b border-slate-50 relative">
          {/* Bouton fermeture - visible uniquement sur mobile */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiX className="h-5 w-5 text-gray-500" />
            </button>
          )}
          <img src="/assets/logo.png" alt="Logo" className="h-20 w-auto mb-4" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-600 font-bold">Espace Apprenant</span>
          <span className="text-xs text-slate-500 mt-2">{userName}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium tracking-tight">{item.name}</span>
                </div>
                {isActive && <HiChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center px-5 py-4 w-full rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-[11px] font-semibold uppercase tracking-widest"
          >
            <HiOutlineLogout className="h-4 w-4 mr-3" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30" 
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SidebarApprenant;