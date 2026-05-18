import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap, 
  HiOutlineChartBar, 
  HiOutlineMail,
  HiX 
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const VueEnsemble = () => {
  // Structure initiale pour éviter les erreurs de rendu au premier chargement
  const [data, setData] = useState({ 
    stats: { apprenants: 0, formations: 0, reussite: '0%' }, 
    apprenants: [] 
  });
  const [loading, setLoading] = useState(true);

  // ÉTATS POUR LA MODALE DE NOTIFICATION
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // RÉCUPÉRATION DES DONNÉES DU DASHBOARD
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/formateur/stats-dashboard');
      if (response && response.stats) {
        setData(response);
      }
    } catch (error) {
      console.error("Erreur stats:", error);
      toast.error("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

const handleSendNotification = async () => {
  if (!message.trim()) return toast.error("Veuillez écrire un message");




  setSending(true);
  try {
    await api.post('/formateur/notifications/envoyer', {
    
      user_id: selectedUser.id || selectedUser.ID || selectedUser.user_id, 
      titre: "Message de votre formateur",
      message: message
    });
    
    toast.success(`Message envoyé à ${selectedUser.nom}`);
    setIsNotifyModalOpen(false);
    setMessage("");
  } catch (error) {

 
    toast.error("Erreur de validation ");
  } finally {
    setSending(false);
  }
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="text-slate-400 text-sm font-medium tracking-wide">Initialisation de P.School...</p>
    </div>
  );

  const statsCards = [
    { id: 1, label: 'Apprenants totaux', value: data?.stats?.apprenants || 0, icon: HiOutlineUserGroup, color: 'bg-blue-500' },
    { id: 2, label: 'Formations actives', value: data?.stats?.formations || 0, icon: HiOutlineAcademicCap, color: 'bg-emerald-500' },
    { id: 3, label: 'Taux de réussite', value: data?.stats?.reussite || '0%', icon: HiOutlineChartBar, color: 'bg-violet-500' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* SECTION 1 : STATISTIQUES GLOBALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2 : TABLEAU DE SUIVI DÉTAILLÉ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-2 tracking-tight">Suivi détaillé des apprenants</h2>
        
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apprenant</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formation</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progression</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.apprenants?.length > 0 ? (
                data.apprenants.map((user, index) => (
                  <tr key={index} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.nom || 'Sans nom'}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {user.derniereActivite ? new Date(user.derniereActivite).toLocaleDateString() : 'Aucune activité'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-slate-500">{user.formation || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[140px]">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${user.progression || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-600">{user.progression || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsNotifyModalOpen(true); }}
                        className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                        title="Envoyer un message"
                      >
                        <HiOutlineMail className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400 italic text-sm">
                    Aucun apprenant actif sur vos formations pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE DE NOTIFICATION */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-white/20">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Contacter l'élève</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-tighter">Destinataire : {selectedUser?.nom}</p>
                </div>
                <button 
                  onClick={() => setIsNotifyModalOpen(false)} 
                  className="p-2 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <HiX className="text-xl" />
                </button>
              </div>

              <textarea
                rows="6"
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none text-slate-600 text-sm transition-all resize-none leading-relaxed"
                placeholder={`Écrivez votre message d'encouragement à ${selectedUser?.nom}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              <button
                onClick={handleSendNotification}
                disabled={sending}
                className={`w-full mt-8 py-5 rounded-2xl font-black text-white transition-all shadow-xl shadow-blue-900/10 active:scale-95 flex items-center justify-center gap-3 ${
                  sending ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {sending ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <HiOutlineMail className="text-xl" />
                    ENVOYER LE MESSAGE
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">P.School Messaging System</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VueEnsemble;