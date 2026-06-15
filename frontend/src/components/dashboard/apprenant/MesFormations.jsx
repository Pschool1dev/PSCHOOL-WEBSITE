import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineBookOpen, 
  HiOutlineClock, 
  HiOutlineCheckCircle,
  HiOutlinePlay,
  HiOutlineBadgeCheck,
  HiOutlineDownload
} from 'react-icons/hi';
import api from '../../../services/api'; 
import toast from 'react-hot-toast';

const MesFormations = () => {
  const navigate = useNavigate(); 
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cours');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await api.get('/mes-inscriptions');
        setFormations(response);
      } catch (err) {
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const totalInscrit = formations.length;
  const formationsTerminees = formations.filter(f => f.progression === 100);
  const numFormationsEnCours = formations.filter(f => f.progression < 100 && f.progression > 0).length;
  const numCertificats = formationsTerminees.length;

  const handleDownload = async (certificatId, formationTitre) => {
    if (!certificatId) {
      toast.error("Certificat non disponible");
      return;
    }
    
    try {
      toast.loading("Préparation du téléchargement...");
      
      const response = await api.get(`/certificat/${certificatId}/telecharger`, {
        responseType: 'blob'
      });
      
      toast.dismiss();
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificat_${formationTitre.replace(/\s/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Téléchargement démarré");
    } catch (error) {
      toast.dismiss();
      console.error("Erreur téléchargement:", error);
      toast.error("Erreur lors du téléchargement du certificat");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FBFDFB]">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-8 w-8 border-b-2 border-emerald-500 rounded-full"></div>
            <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">P.School</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Inscriptions" value={totalInscrit} icon={<HiOutlineBookOpen />} color="blue" />
        <StatCard label="En cours" value={numFormationsEnCours} icon={<HiOutlinePlay />} color="blue" />
        <StatCard label="Terminées" value={numCertificats} icon={<HiOutlineCheckCircle />} color="emerald" />
        <StatCard label="Certificats" value={numCertificats} icon={<HiOutlineBadgeCheck />} color="emerald" />
      </div>
      
      <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-2xl shadow-sm w-fit border border-slate-100">
        <button 
          onClick={() => setActiveTab('cours')}
          className={`px-8 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'cours' ? 'bg-blue-50 text-blue-600 shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Mes Cours
        </button>
        <button 
          onClick={() => setActiveTab('certificats')}
          className={`px-8 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'certificats' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600'
          }`}
        >
          Mes Certificats
        </button>
      </div>

      {activeTab === 'cours' ? (
        formations.length === 0 ? (
          // Message quand aucune formation
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineBookOpen className="text-3xl text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune inscription</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Vous n'êtes actuellement inscrit à aucune formation.<br />
              Découvrez notre catalogue et commencez votre apprentissage.
            </p>
            <button 
              onClick={() => navigate('/elearning')}
              className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              Explorer les formations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formations.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                <div className="h-48 relative overflow-hidden bg-slate-50">
                   {item.formation?.image ? (
                     <img src={item.formation.image} alt={item.formation.titre} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-200"><HiOutlineBookOpen className="text-5xl" /></div>
                   )}
                   <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${
                        item.statut === 'en_attente' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.statut === 'en_attente' ? 'Vérification en cours' : 'Inscription Active'}
                      </span>
                   </div>
                </div>

                <div className="p-7">
                  <h3 className="text-base font-semibold text-slate-800 mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.formation?.titre}
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                      <span>Avancement</span>
                      <span className="text-blue-600">{item.progression || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${item.progression || 0}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                    <div className="flex items-center text-slate-400 text-[10px] font-medium gap-1.5 uppercase">
                      <HiOutlineClock className="text-sm text-blue-400" />
                      <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <button 
                      disabled={item.statut === 'en_attente'}
                      onClick={() => navigate(`/apprenant/formation/${item.formation_id}`)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all uppercase ${
                        item.statut === 'en_attente' ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100'
                      }`}
                    >
                      {item.statut === 'en_attente' ? 'Patientez' : item.progression > 0 ? 'Continuer' : 'Commencer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formationsTerminees.length > 0 ? formationsTerminees.map((cert) => (
            <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <HiOutlineBadgeCheck className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm uppercase">{cert.formation?.titre}</h3>
                  <p className="text-[10px] text-emerald-600/60 font-bold uppercase mt-1 tracking-wider">
                    Certifié par P.School
                  </p>
                  {cert.certificat && (
                    <p className="text-[9px] text-slate-400 mt-1">
                      N° {cert.certificat.numero_certificat} • Délivré le {new Date(cert.certificat.date_delivrance).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => cert.certificat && handleDownload(cert.certificat.id, cert.formation?.titre)}
                disabled={!cert.certificat}
                className={`p-3 rounded-xl transition-all ${
                  cert.certificat 
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer' 
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <HiOutlineDownload className="text-lg" />
              </button>
            </div>
          )) : (
            <div className="col-span-2 py-20 bg-white rounded-3xl border border-slate-100 text-center">
                <HiOutlineBadgeCheck className="text-5xl text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-medium text-xs tracking-widest uppercase">Aucun certificat disponible</p>
                <p className="text-slate-300 text-[10px] mt-1">Terminez vos formations pour obtenir vos certificats</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
    const colorClasses = color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500';
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${colorClasses}`}>
            {icon}
          </div>
        </div>
    );
};

export default MesFormations;