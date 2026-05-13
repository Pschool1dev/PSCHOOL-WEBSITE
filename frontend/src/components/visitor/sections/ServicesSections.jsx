import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import { HiOutlineInformationCircle, HiX } from 'react-icons/hi';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services')
      .then(res => {
        const visiblesuniquement = res.data.filter(s => s.statut === 'actif');
        setServices(visiblesuniquement);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      purple: 'bg-purple-600'
    };
    return colors[color] || colors.white;
  };

  // Fonction pour scroller vers le formulaire de contact
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-10 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête */}
         {/* En-tête */}
        {/* En-tête corrigée */}
<div className="mb-16 flex flex-col items-center text-center">
  <h2 className="text-4xl font-black text-slate-700 mb-4">
    Nos Services
  </h2>
  <p className="text-slate-500 max-w-xl font-medium mx-auto">
    Des solutions informatiques de pointe pour accompagner la transformation numérique de votre entreprise.
  </p>
</div>

        {/* Grille des services */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2"
              >
                <div className="px-2">
                  <div className={`w-8 h-1 ${getColorClass(service.color)} rounded-full mb-4`}></div>
                  
                  <h3 className="text-xl font-black text-green-600 mb-3 group-hover:text-green-600 transition-colors font-heading tracking-tight">
                    {service.titre}
                  </h3>
                  <div className="relative h-44 w-full mb-6 rounded-[2rem] overflow-hidden">
                  <img 
                    src={service.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={service.titre}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
                  <p className="text-slate-500 text-xs mb-6 leading-relaxed line-clamp-3 font-medium">
                    {service.description}
                  </p>
                  
                  <button 
                    onClick={() => setServiceSelectionne(service)}
                    className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all"
                  >
                    Détails du service <FaArrowRight className="text-[8px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- NOUVELLE SECTION APPEL À L'ACTION --- */}
        <div className="mt-8 p-4 md:p-12  flex flex-col items-center text-center">
          <p className="text-slate-600 text-lg md:text-xl font-medium mb-8 max-w-2xl">
            Pour en savoir plus sur les différents services que P.school propose , laissez-nous un message.
          </p>
          <button 
            onClick={scrollToContact}
            className="group flex items-center gap-2 px-7 py-3 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 hover:shadow-2xl hover:shadow-green-200 transition-all duration-300"
          >
            Nous contacter
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* --- MODALE DÉTAILS --- */}
        {serviceSelectionne && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300">
              
              <button 
                onClick={() => setServiceSelectionne(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/80 text-slate-900 hover:bg-slate-900 hover:text-white transition-all z-20 shadow-lg"
              >
                <HiX className="w-6 h-6" />
              </button>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2 h-64 rounded-[2rem] overflow-hidden shadow-2xl">
                    <img 
                      src={serviceSelectionne.image} 
                      alt={serviceSelectionne.titre} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className={`w-12 h-1 ${getColorClass(serviceSelectionne.color)} rounded-full mb-4`}></div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading leading-tight tracking-tighter">
                      {serviceSelectionne.titre}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                      {serviceSelectionne.description}
                    </p>
                  </div>
                </div>

                <div className="mt-10 grid sm:grid-cols-2 gap-4">
                  <a 
                    href={`https://wa.me/22607571645?text=${encodeURIComponent('Bonjour, je souhaite échanger sur : ' + serviceSelectionne.titre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 transition-all"
                  >
                    <FaWhatsapp className="text-xl" />
                    WhatsApp
                  </a>

                  <a 
                    href="#contact" 
                    onClick={() => {
                      setServiceSelectionne(null);
                      scrollToContact();
                    }}
                    className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all"
                  >
                    <FaEnvelope className="text-lg" />
                    Envoyer un mail
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;