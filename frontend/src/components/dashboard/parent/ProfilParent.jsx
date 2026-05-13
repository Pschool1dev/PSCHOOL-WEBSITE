import { useState, useEffect } from 'react';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, 
  HiOutlinePhone, HiOutlineUserCircle, HiOutlineEyeOff, HiOutlineEye 
} from 'react-icons/hi';
import api from '../../../services/api'; 
import toast from 'react-hot-toast';

const ProfilParent = () => {
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchParentProfile = async () => {
      try {
        const response = await api.get('/user'); // Récupère l'utilisateur connecté
        const user = response.data || response;

        if (user) {
          setFormData({
            id: user.id,
            nom: user.nom || user.name || '',
            email: user.email || '',
            telephone: user.telephone || '',
            password: '',
            password_confirmation: ''
          });
        }
      } catch (err) {
        toast.error("Impossible de charger votre profil");
      } finally {
        setFetching(false);
      }
    };
    fetchParentProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom?.trim()) newErrors.nom = 'Votre nom est requis';
    if (!formData.email?.includes('@')) newErrors.email = 'Email invalide';
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit faire au moins 8 caractères';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return toast.error("Veuillez corriger les erreurs");
    }

    setLoading(true);
    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
        delete dataToUpdate.password_confirmation;
      }
      
      await api.put(`/users/${formData.id}`, dataToUpdate);
      toast.success('Vos informations ont été mises à jour !');
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-6 w-6 border-b-2 border-emerald-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Mon Profil Parent</h1>
        <p className="text-slate-400 text-xs mt-1 font-medium">Gérez vos informations de contact et votre sécurité</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
              <HiOutlineUserCircle className="h-14 w-14" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nom */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Votre nom</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text" name="nom" value={formData.nom} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
              {errors.nom && <p className="text-[9px] text-red-500 ml-1">{errors.nom}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Téléphone</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Changer le mot de passe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Nouveau mot de passe"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>

              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange}
                  placeholder="Confirmer"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Sauvegarder mon profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilParent;