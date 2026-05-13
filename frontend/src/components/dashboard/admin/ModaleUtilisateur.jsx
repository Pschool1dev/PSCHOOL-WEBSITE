import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const ModaleUtilisateur = ({ isOpen, onClose, onSave, utilisateurAModifier }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    role: 'apprenant',
    statut: 'actif',
    password: '',
    password_confirmation: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = !!utilisateurAModifier;

  // Remplir le formulaire en mode modification
  useEffect(() => {
    if (utilisateurAModifier && isOpen) {
      setFormData({
        name: utilisateurAModifier.nom || utilisateurAModifier.name || '',
        email: utilisateurAModifier.email || '',
        telephone: utilisateurAModifier.telephone || '',
        role: utilisateurAModifier.type || 'apprenant',
        statut: utilisateurAModifier.statut || 'actif',
        password: '',
        password_confirmation: ''
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        email: '',
        telephone: '',
        role: 'apprenant',
        statut: 'actif',
        password: '',
        password_confirmation: ''
      });
    }
  }, [utilisateurAModifier, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide';
    if (!formData.password && !isEditMode) newErrors.password = 'Le mot de passe est requis';
    if (formData.password && formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    return newErrors;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Déclenchement de la validation locale
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // 2. CORRECTION DES CLÉS : Adaptation pour le validateur Laravel
    const dataToSend = {
      // On récupère name, email, telephone, statut, password
      ...formData,
      
      // 'type' définit le métier (ce que tu as dans ton <select name="role">)
      type: formData.role, 
      
      // 'role' définit les droits d'accès (admin ou simple user)
      role: formData.role === 'admin' ? 'admin' : 'user'
    };
    
    // 3. Gestion spécifique du mode modification
    if (isEditMode && utilisateurAModifier) {
      dataToSend.id = utilisateurAModifier.id;
      
      // Si le mot de passe n'est pas rempli, on ne l'envoie pas pour ne pas l'écraser
      if (!formData.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }
    }
    
    // 4. Envoi vers le parent (GestionUtilisateurs.jsx)
    try {
      await onSave(dataToSend, isEditMode);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
          
          {/* En-tête */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition">
              <HiOutlineX className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Jean Dupont"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="jean@exemple.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Téléphone
              </label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+226 XX XX XX XX"
                />
              </div>
            </div>
            
            {/* Rôle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type<span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="apprenant">Apprenant</option>
                <option value="parent">Parent</option>
                <option value="formateur"> Formateur</option>
              
              </select>
            </div>
            
            {/* Statut */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif"> Inactif</option>
              </select>
            </div>
            
            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mot de passe {!isEditMode && <span className="text-red-500">*</span>}
                {isEditMode && <span className="text-gray-400 text-xs ml-2">(laisser vide pour conserver)</span>}
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={isEditMode ? "Nouveau mot de passe (optionnel)" : "********"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirmer le mot de passe {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
            </div>
            
            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Enregistrement...' : (isEditMode ? 'Modifier' : 'Ajouter')}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModaleUtilisateur;