import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiUser, HiPhone, HiMail, HiLocationMarker, HiDesktopComputer } from 'react-icons/hi';

const InscriptionAdultePage = () => {
  const { formationId } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type_inscription: 'adulte',
    parent_nom: '',
    parent_prenom: '',
    parent_adresse: '',
    parent_telephone: '',
    parent_zone: '',
    apprenant_email: '',
    format: '',
    source: ''
  });

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const data = await api.get(`/formations/${formationId}`);
        setFormation(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Formation non trouvée");
      } finally {
        setLoading(false);
      }
    };
    fetchFormation();
  }, [formationId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const dataToSend = {
      type_inscription: formData.type_inscription,
      parent_nom: formData.parent_nom,
      parent_prenom: formData.parent_prenom,
      parent_adresse: formData.parent_adresse,
      parent_telephone: formData.parent_telephone,
      parent_zone: formData.parent_zone,
      apprenant_email: formData.apprenant_email,
      format: formData.format,
      source: formData.source || null
    };
    
    try {
      await api.post(`/formations/${formationId}/inscription-session`, dataToSend);
      toast.success("Votre inscription a été enregistrée avec succès !");
      setTimeout(() => {
        navigate('/formationSessions');
      }, 2000);
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(err => toast.error(err[0]));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-800 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Lien retour */}
        <button
          onClick={() => navigate('/formationSessions')}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors mb-6"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux sessions
        </button>

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-800">
            Inscription <span className="font-medium">{formation?.titre || ''}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Tous les champs marqués d'un * sont obligatoires</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section Apprenant */}
          <section className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-50">
              <HiUser className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Informations personnelles</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nom <span className='text-red-600'>*</span></label>
                <input
                  type="text"
                  name="parent_nom"
                  required
                  value={formData.parent_nom}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Prénom <span className='text-red-600'>*</span></label>
                <input
                  type="text"
                  name="parent_prenom"
                  required
                  value={formData.parent_prenom}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                  placeholder="Votre prénom"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone <span className='text-red-600'>*</span></label>
                <div className="relative">
                  <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="parent_telephone"
                    required
                    value={formData.parent_telephone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                    placeholder="70 12 34 56"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email <span className='text-red-600'>*</span></label>
                <div className="relative">
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="apprenant_email"
                    required
                    value={formData.apprenant_email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Adresse <span className='text-red-600'>*</span></label>
                <input
                  type="text"
                  name="parent_adresse"
                  required
                  value={formData.parent_adresse}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                  placeholder="Votre adresse complète"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Lieu de formation <span className='text-red-600'>*</span> </label>
                <select
                  name="parent_zone"
                  required
                  value={formData.parent_zone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-gray-400 transition appearance-none"
                >
                  <option value="">Sélectionnez un lieu</option>
                  <option value="Ouaga 2000">Ouaga 2000</option>
                  <option value="Tampouy">Tampouy</option>
                  <option value="Saaba">Saaba</option>
                  <option value="Bobo dioulasso">Bobo Dioulasso</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Section Format */}
          <section className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-50">
              <HiDesktopComputer className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Choix du format <span className='text-red-600'>*</span></h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                  formData.format === 'presentiel'
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="presentiel"
                  required
                  checked={formData.format === 'presentiel'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-700 focus:ring-gray-400"
                />
                <span className="text-sm text-gray-600"> Présentiel</span>
              </label>
              
              <label
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                  formData.format === 'en_ligne'
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="en_ligne"
                  required
                  checked={formData.format === 'en_ligne'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-700 focus:ring-gray-400"
                />
                <span className="text-sm text-gray-600"> En ligne</span>
              </label>
            </div>
          </section>
          
          {/* Section Source */}
          <section className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-5 pb-3 border-b border-gray-50">
              Comment vous nous-aviez connu ? <span className='text-red-600'>*</span>
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-3">
              {['Proche ou connaissance', 'Réseaux sociaux', 'Médias'].map((source) => (
                <label
                  key={source}
                  className={`flex items-center gap-2.5 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                    formData.source === source
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="source"
                    value={source}
                    checked={formData.source === source}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-gray-700 focus:ring-gray-400"
                  />
                  <span className="text-sm text-gray-600">{source}</span>
                </label>
              ))}
            </div>
          </section>
          
          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer la pré-inscription'}
          </button>
          
          <p className="text-xs text-gray-400 text-center -mt-4">
            Nous vous contacterons sous 48h pour finaliser l'inscription
          </p>
        </form>
      </div>
    </div>
  );
};

export default InscriptionAdultePage;