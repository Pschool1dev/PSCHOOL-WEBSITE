import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import QuizView from '../components/dashboard/apprenant/QuizView';
import CertificatButton from '../components/dashboard/apprenant/CertificatButton';
import { 
  HiOutlineChevronLeft, 
  HiCheckCircle, 
  HiPlay, 
  HiOutlineInformationCircle,
  HiOutlineQuestionMarkCircle,
  HiLockClosed 
} from 'react-icons/hi';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États
  const [data, setData] = useState({ cours: [], progression: 0, statut_paiement: 'essai', formation_prix: 0 });
  const [currentCours, setCurrentCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [inscriptionId, setInscriptionId] = useState(null);
  const [isEnfant, setIsEnfant] = useState(false);

  // Détection du mode de paiement
  const isProduction = process.env.NODE_ENV === 'production';
  const useCinetPay = process.env.REACT_APP_PAYMENT_MODE === 'cinetpay' || isProduction;

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await api.get(`/apprenant/formation/${id}/contenu`);
        
        if (res && Array.isArray(res.cours)) {
          setData(res);
          setInscriptionId(res.inscription_id);
          setIsEnfant(res.is_enfant || false);
          
          if (res.dernier_cours_id) {
            const lastIndex = res.cours.findIndex(c => c.id === res.dernier_cours_id);
            if (lastIndex !== -1 && lastIndex < res.cours.length - 1) {
              setCurrentCours(res.cours[lastIndex + 1]);
            } else {
              setCurrentCours(res.cours[lastIndex]);
            }
          } else {
            if (res.cours.length > 0) setCurrentCours(res.cours[0]);
          }
        }
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [id]);

  useEffect(() => {
    setShowQuiz(false);
    setQuizSuccess(false);
  }, [currentCours]);

  const marquerCommeTermine = async () => {
    try {
      const res = await api.post(`/cours/${currentCours.id}/terminer`);
      setData(prev => ({ ...prev, progression: res.progression }));
      toast.success("Chapitre validé !");
      
      const currentIndex = data.cours.findIndex(c => c.id === currentCours.id);
      if (currentIndex < data.cours.length - 1) {
        setCurrentCours(data.cours[currentIndex + 1]);
      }
    } catch (err) {
      toast.error("Erreur lors de la validation");
    }
  };

  // Vérification de l'accès au chapitre (2 premiers gratuits, puis payant)
  const verifierAccesChapitre = (indexChapitre) => {
    if (data.statut_paiement === 'paye') return true;
    if (data.statut_paiement === 'essai' && indexChapitre < 2) return true;
    return false;
  };

  // Paiement réel avec CinetPay (pour apprenant adulte uniquement)
  const lancerCinetPayPayment = async () => {
    if (!inscriptionId) {
      toast.error("Impossible d'identifier l'inscription");
      return;
    }

    if (!user?.telephone) {
      toast.error("Veuillez renseigner votre numéro de téléphone dans votre profil");
      return;
    }

    try {
      toast.loading("Connexion sécurisée au guichet CinetPay...");
      
      const response = await api.post('/payment/initiate', {
        inscription_id: inscriptionId,
        telephone: user.telephone,
        email: user.email
      });
      
      toast.dismiss();
      
      if (response.data.success && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        toast.error("Erreur lors de l'initiation du paiement");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Erreur paiement CinetPay:", error);
      toast.error(error.response?.data?.message || "Erreur lors du traitement du paiement");
    }
  };

  // Paiement simulé (développement) - pour apprenant adulte uniquement
  const lancerSimulationPaiement = async () => {
    try {
      toast.loading("Connexion sécurisée au guichet CinetPay (Simulation)...");
      
      const res = await api.post('/payment/simulate', {
        formation_id: id
      });

      toast.dismiss();
      
      if (res.status === 'success' || res.statut_paiement === 'paye') {
        setData(prev => ({ ...prev, statut_paiement: 'paye' }));
        toast.success("Félicitations ! Votre paiement a été validé. Toute la formation P.School est accessible !");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Erreur lors de la validation du paiement.");
      console.error("Détails erreur paiement:", error);
    }
  };

  // Point d'entrée principal pour le paiement (uniquement pour adultes)
  const lancerProcedurePaiement = () => {
    if (isEnfant) {
      toast.error("Seul vos parents peuvent débloquer cette formation");
      return;
    }
    
    if (useCinetPay) {
      lancerCinetPayPayment();
    } else {
      lancerSimulationPaiement();
    }
  };

  const isPDF = (url) => url?.toLowerCase().endsWith('.pdf');
  const isYouTube = (url) => url?.includes('youtube.com') || url?.includes('youtu.be');

  if (loading) return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const currentCoursIndex = data.cours.findIndex(c => c.id === currentCours?.id);

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-5 border-b border-gray-200 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-800 transition-colors">
            <HiOutlineChevronLeft className="text-xl" />
          </button>
          <div>
            <span className="font-semibold text-sm text-gray-700 block">Programme</span>
            {data.statut_paiement === 'essai' && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mode Essai Gratuit
              </span>
            )}
            {isEnfant && data.statut_paiement === 'essai' && currentCoursIndex >= 2 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">
                En attente parent
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {data.cours.map((c, index) => {
            const aAcces = verifierAccesChapitre(index);
            return (
              <button
                key={c.id}
                onClick={() => setCurrentCours(c)}
                className={`w-full p-4 flex items-start justify-between border-b border-gray-100 transition-colors ${
                  currentCours?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {c.ordre <= (data.progression / 100 * data.cours.length) ? (
                      <HiCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <HiPlay className={currentCours?.id === c.id ? "text-blue-500" : "text-gray-400"} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${currentCours?.id === c.id ? 'text-blue-600' : 'text-gray-700'} ${!aAcces && 'opacity-60'}`}>
                      {index + 1}. {c.titre}
                    </p>
                  </div>
                </div>

                {!aAcces && (
                  <HiLockClosed className="text-gray-400 mt-1 flex-shrink-0" title="Achat requis" />
                )}
              </button>
            );
          })}
        </div>

        {/* Message pour enfant dans la sidebar */}
        {isEnfant && data.statut_paiement === 'essai' && currentCoursIndex >= 2 && (
          <div className="mt-4 mx-3 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 text-center font-medium">
               Formation verrouillée
            </p>
            <p className="text-[10px] text-amber-600 text-center mt-1">
              Demande à tes parents de débloquer la suite
            </p>
          </div>
        )}
      </div>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-8">
          {currentCours ? (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {showQuiz ? (
                <div className="py-8">
                  <QuizView 
                    coursId={currentCours.id} 
                    onComplete={(success) => {
                      if (success) {
                        setQuizSuccess(true);
                        toast.success("Quiz validé !");
                      }
                    }} 
                  />
                  <button 
                    onClick={() => setShowQuiz(false)} 
                    className="block mx-auto mt-6 text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    Retourner au cours
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">{currentCours.titre}</h1>
                    <p className="text-gray-500 text-sm">Chapitre {currentCours.ordre}</p>
                  </div>
                  
                  {verifierAccesChapitre(currentCoursIndex) ? (
                    <div className={`rounded-lg border border-gray-200 overflow-hidden bg-gray-900 ${isPDF(currentCours.contenu_url) ? 'h-[70vh]' : 'aspect-video'}`}>
                      {isYouTube(currentCours.contenu_url) ? (
                        <iframe title="Lecteur de cours" key={currentCours.id} className="w-full h-full" src={currentCours.contenu_url.replace("watch?v=", "embed/").split('&')[0]} allowFullScreen></iframe>
                      ) : isPDF(currentCours.contenu_url) ? (
                        <iframe title="Lecteur de cours" key={currentCours.id} src={`${currentCours.contenu_url}#toolbar=0`} className="w-full h-full bg-white"></iframe>
                      ) : (
                        <video key={currentCours.id} controls className="w-full h-full"><source src={currentCours.contenu_url} /></video>
                      )}
                    </div>
                  ) : (
                    /* ÉCRAN DE VERROUILLAGE - Différencié selon le type d'utilisateur */
                    <div className="w-full aspect-video min-h-[400px] bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
                      <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -top-10 -left-10"></div>
                      <div className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -bottom-10 -right-10"></div>
                      
                      <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-500 mb-4 animate-pulse relative z-10">
                        <HiLockClosed className="text-3xl" />
                      </div>
                      
                      <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-tight relative z-10">
                        Fin de l'essai gratuit
                      </h3>
                      
                      {isEnfant ? (
                        /* Message pour enfant */
                        <>
                          <p className="text-slate-400 text-sm max-w-sm mb-4 leading-relaxed relative z-10">
                            Vous avez terminé les 2 premiers chapitres gratuits de cette formation.
                          </p>
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 relative z-10 max-w-md">
                            <p className="text-amber-400 text-sm font-medium">
                               Pour continuer cette formation, veuillez informer vos parents.
                            </p>
                            <p className="text-slate-400 text-xs mt-2">
                              Ils pourront débloquer l'accès complet depuis leur espace parent.
                            </p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-800 relative z-10 max-w-md">
                            <p className="text-xs text-slate-500">
                              Une fois le paiement effectué par vos parents, tous les chapitres seront automatiquement débloqués.
                            </p>
                          </div>
                        </>
                      ) : (
                        /* Message et bouton pour apprenant adulte */
                        <>
                          <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed relative z-10">
                            Vous avez validé vos premiers chapitres avec succès ! Pour débloquer les cours restants, finalisez le paiement de la formation.
                          </p>
                          
                          <button 
                            onClick={lancerProcedurePaiement}
                            className="relative z-10 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 uppercase tracking-wider"
                          >
                            Débloquer la formation ({Number(data.formation_prix || 150000).toLocaleString()} FCFA)
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {verifierAccesChapitre(currentCoursIndex) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-700 font-semibold text-sm">Évaluation</p>
                          <p className="text-xs text-amber-600">Quiz obligatoire</p>
                        </div>
                        <button 
                          onClick={() => setShowQuiz(true)}
                          className={`p-3 rounded-md transition-colors ${quizSuccess ? 'bg-green-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                        >
                          {quizSuccess ? <HiCheckCircle className="text-xl" /> : <HiOutlineQuestionMarkCircle className="text-xl" />}
                        </button>
                      </div>

                      <div className=" flex flex-col justify-center items-center">
                        {quizSuccess || (currentCours.ordre <= (data.progression / 100 * data.cours.length)) ? (
                          <button 
                            onClick={marquerCommeTermine}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium text-sm transition-colors"
                          >
                            <HiCheckCircle className="text-lg" />
                            Terminer le chapitre
                          </button>
                        ) : (
                          <div className="text-center space-y-1">
                            <HiLockClosed className="mx-auto text-gray-400 text-lg" />
                            <p className="text-xs text-gray-500">Accès bloqué</p>
                            <p className="text-xs text-amber-600 font-medium">Réussissez le quiz d'abord</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {verifierAccesChapitre(currentCoursIndex) && !isYouTube(currentCours.contenu_url) && (
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-3 text-sm">
                        <HiOutlineInformationCircle className="text-blue-500 text-lg" />
                        <span className="text-gray-700">Support de cours disponible</span>
                      </div>
                      <a 
                        href={currentCours.contenu_url} 
                        download 
                        className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md text-xs font-medium hover:bg-gray-300 transition-colors"
                      >
                        Télécharger
                      </a>
                    </div>
                  )}

                  {verifierAccesChapitre(currentCoursIndex) && (
                    <div className=" p-6 ">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">À propos de ce chapitre</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{currentCours.description || "Aucune description détaillée."}</p>
                    </div>
                  )}

                  {/* SECTION CERTIFICAT - Affiche le bouton quand la formation est terminée */}
                  {verifierAccesChapitre(currentCoursIndex) && data.progression === 100 && data.statut_paiement === 'paye' && !isEnfant && (
                    <CertificatButton 
                      inscriptionId={inscriptionId}
                      formationId={id}
                      formationTitre={data.formation_nom}
                      onCertificatGenere={(certificat) => {
                        console.log('Certificat généré:', certificat);
                        toast.success("Certificat disponible !");
                      }}
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
              <HiPlay className="text-5xl opacity-30" />
              <p className="font-medium text-sm">Sélectionnez un chapitre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;