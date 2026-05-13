import { Link } from 'react-router-dom';
// Ajout de FaTiktok dans l'import
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaChevronRight, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Colonne 1 - Branding */}
          <div className="space-y-6">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              La référence de la formation numérique au Burkina Faso. Maîtrisez le code, 
              la robotique et le futur du numérique avec P.School.
            </p>
       
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1JXcCfP7QV/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all">
                <FaFacebookF size={16} />
              </a>
            
              <a href="https://www.tiktok.com/@mamatech_bf?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all">
                <FaTiktok size={16} />
              </a>
              <a href="https://www.linkedin.com/company/programming-school/ " className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all">
                <FaLinkedinIn size={16} />
              </a>
              <a href="https://wa.me/22607571645" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all">
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* ... Reste du code inchangé ... */}
          
          {/* Colonne 2 - Navigation */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-green-500 mb-6">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Formations', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => scrollToSection(item.toLowerCase())} 
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-medium"
                  >
                    <FaChevronRight className="w-2 h-2 text-green-500 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-green-500 mb-6">Nos Services</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li className="hover:text-slate-200 transition-colors">Développement Web & Mobile</li>
              <li className="hover:text-slate-200 transition-colors">Maintenance Informatique</li>
              <li className="hover:text-slate-200 transition-colors">Installation Réseaux</li>
             
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-green-500 mb-6">Nous trouver</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <FaMapMarkerAlt className="text-green-500 mt-1 shrink-0" />
                <span className="leading-relaxed">Ouaga 2000, Secteur 53,<br/>Boulevard Muammar Khadafi</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FaPhoneAlt className="text-green-500 shrink-0" />
                <a href="tel:+22607571645" className="hover:text-white transition">+226 07 57 16 45</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FaEnvelope className="text-green-500 shrink-0" />
                <a href="mailto:infos@pschool.pro" className="hover:text-white transition">infos@pschool.pro</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]">
          <p>&copy; 2026 Programming School. Burkina Faso.</p>
          <div className="flex gap-8">
            <Link to="/politique" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/mentions" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;