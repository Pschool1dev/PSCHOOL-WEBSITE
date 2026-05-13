import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between px-8 py-4">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-16" />
          </Link>
        </div>
        
        {/* Menu desktop */}
        <div className="hidden md:flex space-x-6 font-medium">
          <button 
            onClick={() => scrollToSection('hero')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            Accueil
          </button>
          <button 
            onClick={() => scrollToSection('apropos')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            À propos
          </button>
          <button 
            onClick={() => scrollToSection('formations')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            Formations
          </button>
          <button 
            onClick={() => scrollToSection('services')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('evenements')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            Évènements
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            Contact
          </button>
          <button 
            onClick={() => scrollToSection('temoignages')} 
            className={`transition cursor-pointer text-xl ${
              scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
            }`}
          >
            Témoignages
          </button>
        </div>

        {/* Boutons */}
        <div className="flex space-x-4">
          <Link 
            to="/register"
            className="px-6 py-2 rounded-md font-bold transition bg-green-600 text-white"
          >
            Créer un compte
          </Link>
          <Link 
            to="/login"
            className={`px-6 py-2 rounded-md font-bold transition ${
              scrolled 
                ? 'border border-gray-300 text-gray-600 hover:bg-gray-50' 
                : 'border border-white/30 text-white hover:bg-white/10'
            }`}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;