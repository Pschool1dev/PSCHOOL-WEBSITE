import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext'; 

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    setShowDropdown(false);
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        
        {/* LOGO */}
        <div className="flex items-center z-50">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-12 md:h-16" />
          </Link>
        </div>
        
        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <button onClick={() => handleNavClick('hero')} className={`text-xl transition hover:text-green-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>Accueil</button>
          <button onClick={() => handleNavClick('apropos')} className={`text-xl transition hover:text-green-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>À propos</button>

          {/* DROPDOWN */}
          <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <button className={`flex items-center gap-1 text-xl transition hover:text-green-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              Formations <HiChevronDown className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-md py-2 border border-gray-100 text-gray-800">
                <Link to="/elearning" className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition">
                  <span className="block font-bold">E-learning</span>
                </Link>
                <button onClick={() => handleNavClick('formations-programmees')} className="w-full text-left px-4 py-3 hover:bg-green-50 hover:text-green-600 transition">
                  <span className="block font-bold">Sessions Programmées</span>
                </button>
              </div>
            )}
          </div>

          <button onClick={() => handleNavClick('evenements')} className={`text-xl transition hover:text-green-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>Évènements</button>
          <button onClick={() => handleNavClick('temoignages')} className={`text-xl transition hover:text-green-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>Témoignages</button>
          <button onClick={() => handleNavClick('contact')} className={`text-xl transition hover:text-green-500 ${scrolled ? 'text-gray-700' : 'text-white'}`}>Contact</button>
        </div>

        {/* ACTIONS & AUTH */}
        <div className="flex items-center z-50 space-x-4">
          <div className="hidden md:flex space-x-3">
           
            
                <Link to="/login" className={`px-5 py-2 rounded-md font-bold transition ${scrolled ? 'border border-gray-300 text-gray-600' : 'border border-white/30 text-white'}`}>Se connecter</Link>
                <Link to="/register" className="px-5 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition">S'inscrire</Link>
             
            
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${scrolled || isOpen ? 'text-gray-800' : 'text-white'}`}>
            {isOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div className={`md:hidden fixed inset-0 bg-white z-40 flex flex-col pt-24 pb-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center space-y-4 font-semibold text-xl px-8 overflow-y-auto">
          <button onClick={() => handleNavClick('hero')} className="w-full py-2 border-b">Accueil</button>
          <button onClick={() => handleNavClick('apropos')} className="w-full py-2 border-b">À propos</button>
          <Link to="/elearning" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-green-600 italic">E-learning</Link>
          <button onClick={() => handleNavClick('formations-programmees')} className="w-full py-2 border-b">Sessions Programmées</button>
          <button onClick={() => handleNavClick('evenements')} className="w-full py-2 border-b">Évènements</button>
          <button onClick={() => handleNavClick('temoignages')} className="w-full py-2 border-b">Témoignages</button>
          <button onClick={() => handleNavClick('contact')} className="w-full py-2 border-b">Contact</button>
        </div>

        <div className="flex flex-col space-y-3 px-8 w-full mt-4">
        
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-md font-bold text-gray-700 border">Se connecter</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-md font-bold text-white bg-green-600">S'inscrire</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;