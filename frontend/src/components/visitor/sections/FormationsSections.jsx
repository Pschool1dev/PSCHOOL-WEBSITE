import { useState, useEffect } from 'react';
import { 
  HiOutlineClock, HiStar, HiOutlineBookOpen, HiArrowRight, 
  HiOutlineInformationCircle, HiX 
} from 'react-icons/hi';
import { FaUserPlus, FaBookOpen, FaCreditCard, FaAward } from 'react-icons/fa';
import api from '../../../services/api'; 
import { useNavigate } from 'react-router-dom';

const steps = [
  { num: "01", title: "Créez votre compte", desc: "Inscrivez-vous gratuitement en quelques minutes", icon: <FaUserPlus /> },
  { num: "02", title: "Choisissez une formation", desc: "Parcourez notre catalogue et accédez aux modules gratuits", icon: <FaBookOpen /> },
  { num: "03", title: "Payez & Apprenez", desc: "Accédez à l'intégralité des cours après paiement sécurisé", icon: <FaCreditCard /> },
  { num: "04", title: "Obtenez votre certificat", desc: "Complétez tous les modules et recevez votre certification", icon: <FaAward /> },
];

const FormationsSection = () => {
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('Tous');
  const [formationSelectionnee, setFormationSelectionnee] = useState(null);

  useEffect(() => {
    const getFormations = async () => {
      try {
        const data = await api.get('/formations');
        setFormations(data);
      } catch (error) {
        console.error("Erreur chargement formations:", error);
      } finally {
        setChargement(false);
      }
    };
    getFormations();
  }, []);

  const categories = ['Tous', ...new Set(formations.map(f => f.categorie).filter(Boolean))];
  
  const filteredFormations = filtre === 'Tous' 
    ? formations 
    : formations.filter(f => f.categorie === filtre);

  return (
    <section id="formations" className="py-10 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-700 mb-4">Nos Formations</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-slate-500 max-w-xl font-medium">
              Développez vos compétences avec nos experts. Des programmes conçus pour 
              répondre aux exigences réelles du marché technologique. Inscrivez vos enfants pour leur offrir un avenir meilleur.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFiltre(cat)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filtre === cat 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {chargement ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin"></div>
             <p className="text-slate-400 font-bold animate-pulse">Chargement du catalogue...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFormations.map((formation) => (
              <div 
                key={formation.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2"
              >
                <div className="relative h-48 w-full mb-6 rounded-[2rem] overflow-hidden shadow-inner">
                  <img 
                    src={formation.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={formation.titre}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg shadow-xl">
                      {formation.public_cible}
                    </span>
                  </div>
                </div>

                <div className="px-2 pb-2">
                  <span className="text-orange-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 block">
                    {formation.categorie}
                  </span>
                  
                  <h3 className="text-lg font-black text-slate-700 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                    {formation.titre}
                  </h3>
                  
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed font-medium">
                    {formation.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <HiOutlineBookOpen className="w-4 h-4 text-slate-900" /> 
                      <span>{formation.nb_modules || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <HiOutlineClock className="w-4 h-4" /> {formation.duree}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => setFormationSelectionnee(formation)}
                      className="group/btn flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-300 border border-transparent hover:border-green-100"
                    >
                      <HiOutlineInformationCircle className="w-4 h-4" />
                      Voir Plus
                    </button>
                    
                    {/* CORRECTION ICI : Navigation via ID d'URL */}
                    <button 
                      onClick={() => navigate(`/inscription/${formation.id}`)} 
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white group-hover:bg-green-600 group-hover:rotate-[-10deg] transition-all duration-300 shadow-lg"
                    >
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <button className="group relative px-12 py-5 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest rounded-2xl overflow-hidden transition-all hover:text-white">
            <span className="absolute inset-0 w-0 bg-slate-900 transition-all duration-300 group-hover:w-full -z-10"></span>
            Télécharger le catalogue ici 
          </button>
        </div>
      </div>

      {formationSelectionnee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setFormationSelectionnee(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-10"
            >
              <HiX className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 h-64 rounded-[2rem] overflow-hidden shadow-lg">
                  <img 
                    src={formationSelectionnee.image} 
                    alt={formationSelectionnee.titre} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
                    {formationSelectionnee.categorie}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                    {formationSelectionnee.titre}
                  </h2>
                  <div className="inline-block bg-green-50 px-6 py-3 rounded-2xl border border-green-100 mb-6">
                    <p className="text-[10px] text-green-700 font-black uppercase tracking-widest mb-1">Frais de formation</p>
                    <div className="text-2xl font-black text-slate-900">
                      {Number(formationSelectionnee.prix).toLocaleString()} <span className="text-xs text-green-600">FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    À propos de ce cours
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {formationSelectionnee.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Durée totale</p>
                    <p className="text-sm font-black text-slate-900">{formationSelectionnee.duree}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Contenu</p>
                    <p className="text-sm font-black text-slate-900">{formationSelectionnee.nb_modules} Modules</p>
                  </div>
                </div>

                {/* CORRECTION ICI : Navigation via ID d'URL */}
                <button 
                  onClick={() => navigate(`/inscription/${formationSelectionnee.id}`)} 
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl"
                >
                  S'inscrire maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FormationsSection;