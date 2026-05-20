import { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowRight, FaEnvelope, FaCode, FaRobot, FaCloud, FaShieldAlt, FaMobileAlt, FaDatabase } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import api from '../../../services/api';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);

  const getServiceIcon = (titre) => {
    const titreLower = titre?.toLowerCase() || '';
    if (titreLower.includes('web')) return <FaCode className="text-2xl" />;
    if (titreLower.includes('ia') || titreLower.includes('intelligence')) return <FaRobot className="text-2xl" />;
    if (titreLower.includes('cloud')) return <FaCloud className="text-2xl" />;
    if (titreLower.includes('sécurité')) return <FaShieldAlt className="text-2xl" />;
    if (titreLower.includes('mobile')) return <FaMobileAlt className="text-2xl" />;
    return <FaDatabase className="text-2xl" />;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get('/services');
        // On s'assure de filtrer les services actifs
        setServices(Array.isArray(data) ? data.filter(s => s.statut === 'actif') : []);
      } catch (err) {
        console.error("Erreur chargement services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=Service+P.School';
    // Si c'est déjà une URL complète (ex: Cloudinary), on la retourne
    if (imagePath.startsWith('http')) return imagePath;
    // Sinon, on pointe vers le stockage local
    return `http://127.0.0.1:8000/storage/${imagePath.replace('storage/', '')}`;
  };

  const getColorClass = (color) => {
    const colors = { blue: 'bg-blue-600', green: 'bg-green-600', orange: 'bg-orange-600', purple: 'bg-purple-600' };
    return colors[color] || 'bg-gray-600';
  };

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">Nos prestations</span>
          <h2 className="text-3xl font-bold text-gray-700 mt-2">Services professionnels</h2>
      
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img src={getImageUrl(service.image)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={service.titre} />
                  <div className={`absolute top-3 left-3 w-8 h-0.5 ${getColorClass(service.color)}`}></div>
                </div>
                <div className="p-5">
                  <div className="text-green-600 mb-3">{getServiceIcon(service.titre)}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{service.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                  <button onClick={() => setServiceSelectionne(service)} className="text-green-600 text-sm font-medium inline-flex items-center gap-1">
                    En savoir plus <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Service */}
        {serviceSelectionne && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
              <button onClick={() => setServiceSelectionne(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                <HiX className="w-5 h-5" />
              </button>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/5 h-48 rounded-md overflow-hidden bg-gray-100">
                  <img src={getImageUrl(serviceSelectionne.image)} className="w-full h-full object-cover" alt={serviceSelectionne.titre} />
                </div>
                <div className="w-full md:w-3/5">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{serviceSelectionne.titre}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{serviceSelectionne.description}</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 grid sm:grid-cols-2 gap-3">
                <a 
                  href={`https://wa.me/22607571645?text=${encodeURIComponent(serviceSelectionne.whatsapp_message || 'Bonjour, je souhaite échanger sur : ' + serviceSelectionne.titre)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-md font-medium"
                >
                  <FaWhatsapp className="text-lg" /> WhatsApp
                </a>
                <button onClick={() => { setServiceSelectionne(null); scrollToContact(); }} className="flex items-center justify-center gap-2 py-3 bg-gray-700 text-white rounded-md font-medium">
                  <FaEnvelope className="text-base" /> Formulaire
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;