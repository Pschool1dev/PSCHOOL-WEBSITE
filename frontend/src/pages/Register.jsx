import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle
} from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [typeCompte, setTypeCompte] = useState('apprenant');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
    conditions: false,
    formations_interet: [], 
  });

  const formationsAdultes = [
    { value: 'dev_web', label: 'Développement Web' },
    { value: 'data_science', label: 'Data Science' },
    { value: 'cybersecurite', label: 'Cybersécurité' },
    { value: 'assistant', label: 'Assistant(e) et Secrétaire de direction' },
    { value: 'strategie', label: "Stratégies marketing digital" },
    { value: 'administration', label: 'Administration et sécurité des réseaux' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'conditions') {
        setFormData({ ...formData, conditions: checked });
      } else {
        // Gestion des cases à cocher pour les formations
        const currentList = [...formData.formations_interet];
        const updatedList = checked 
          ? [...currentList, value] 
          : currentList.filter(item => item !== value);
        setFormData({ ...formData, formations_interet: updatedList });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.conditions) {
      setErrors({ global: 'Vous devez accepter les conditions générales' });
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        type: typeCompte,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      // On n'envoie les formations que si c'est un apprenant adulte
      if (typeCompte === 'apprenant') {
        dataToSend.formations_interet = formData.formations_interet;
      }

      const result = await registerUser(dataToSend);
      if (result.success) {
        alert("Compte créé avec succès !");
        navigate('/login');
      }
    } catch (err) {
      setErrors(err.errors || { global: err.message || "Erreur d'inscription" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <img src="/assets/logo-removebg-preview (1).png" alt="Logo" className="h-20 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800 mt-4">Créer un compte</h2>
          <p className="text-gray-500 mt-2 text-sm">Rejoignez la plateforme d'apprentissage P.School</p>
        </div>

        {errors.global && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
            <HiOutlineExclamationCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{errors.global}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
          {/* SÉLECTEUR DE TYPE DE COMPTE */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Choisissez votre profil</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => setTypeCompte('apprenant')} 
                className={`py-4 px-4 rounded-2xl font-bold transition-all border-2 ${typeCompte === 'apprenant' ? 'border-green-600 bg-green-50 text-green-700 shadow-md' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
              >
                Apprenant Adulte
              </button>
              <button 
                type="button" 
                onClick={() => setTypeCompte('parent')} 
                className={`py-4 px-4 rounded-2xl font-bold transition-all border-2 ${typeCompte === 'parent' ? 'border-green-600 bg-green-50 text-green-700 shadow-md' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
              >
                Parent d'élève
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* CHAMPS COMMUNS */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Nom Complet</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Ex: Kader Sore" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="votre@email.com" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Téléphone</label>
                <PhoneInput
                  country={'bf'}
                  value={formData.telephone}
                  onChange={phone => setFormData({ ...formData, telephone: phone })}
                  inputClass="!w-full !py-6 !border-gray-200 !rounded-xl"
                  containerClass="!w-full"
                />
              </div>
            </div>

            {/* SECTION CONDITIONNELLE : FORMATIONS ADULTES */}
            {typeCompte === 'apprenant' ? (
              <div className="pt-4 animate-fadeIn">
                <label className="text-sm font-bold text-gray-700 mb-3 block">Quelles formations vous intéressent ?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formationsAdultes.map(f => (
                    <label key={f.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.formations_interet.includes(f.value) ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="checkbox" name="formations_interet" value={f.value} checked={formData.formations_interet.includes(f.value)} onChange={handleChange} className="w-4 h-4 accent-green-600 rounded" />
                      <span className="text-sm text-gray-600 font-medium">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              /* INFO PARENT */
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 animate-fadeIn">
                <HiOutlineInformationCircle className="h-6 w-6 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  En tant que <strong>Parent</strong>, vous pourrez inscrire vos enfants et choisir leurs formations (Robotique, Programmation,jeu vidéo  etc.) directement depuis votre espace personnel après l'inscription.
                </p>
              </div>
            )}

            {/* SÉCURITÉ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfirmPassword ? 'text' : 'password'} name="password_confirmation" placeholder="Confirmer" value={formData.password_confirmation} onChange={handleChange} className="w-full pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" name="conditions" checked={formData.conditions} onChange={handleChange} className="w-5 h-5 accent-green-600 rounded border-gray-300" required />
              <label className="text-xs text-gray-500 leading-tight">
                J'accepte les <Link to="/conditions" className="text-green-600 font-bold underline">conditions générales</Link> et la politique de confidentialité de P.School.
              </label>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95 shadow-green-200'}`}>
              {loading ? 'Création du compte...' : "S'inscrire maintenant"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Déjà un compte ? <Link to="/login" className="font-bold text-green-600 hover:underline">Connectez-vous</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;