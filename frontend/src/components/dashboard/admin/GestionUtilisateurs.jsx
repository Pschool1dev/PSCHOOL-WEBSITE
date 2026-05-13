import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import ModaleUtilisateur from './ModaleUtilisateur';
import ConfirmationSuppression from './ConfirmationSuppression';
import api from '../../../services/api';

const GestionUtilisateurs = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreRole, setFiltreRole] = useState('tous');
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null);
  const [suppressionOuverte, setSuppressionOuverte] = useState(false);
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);

  // Charger les utilisateurs
  const fetchUtilisateurs = async () => {
    try {
      setChargement(true);
      const data = await api.get('/users');
      setUtilisateurs(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast.error("Erreur de chargement des utilisateurs");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  // Ajouter un utilisateur
  const handleAjouter = async (formData) => {
    try {
      await api.post('/users', formData);
      toast.success("Utilisateur ajouté avec succès");
      fetchUtilisateurs();
      setModaleOuverte(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de l'utilisateur");
    }
  };

 
const handleModifier = async (id, formData) => {
  try {
    const response = await api.put(`/users/${id}`, formData);
    toast.success("Utilisateur modifié avec succès");
    fetchUtilisateurs();
    setModaleOuverte(false);
  } catch (error) {
    console.error('=== ERREUR COMPLETE ===');
    console.error('Message:', error.message);
    console.error('Response:', error.response);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    
   
    if (error.response?.status === 422) {
      const errorData = error.response.data;
      console.error('Validation errors:', errorData);
      
      if (errorData.errors) {
        const messages = Object.values(errorData.errors).flat().join('\n');
        toast.error(`Erreurs de validation:\n${messages}`);
      } else if (errorData.message) {
        toast.error(errorData.message);
      } else {
        toast.error("Erreur de validation");
      }
    } else {
      toast.error("Erreur lors de la modification");
    }
  }
};

  // Supprimer un utilisateur
  const handleSupprimer = async () => {
    try {
      await api.delete(`/users/${utilisateurASupprimer.id}`);
      toast.success("Utilisateur supprimé avec succès");
      setSuppressionOuverte(false);
      fetchUtilisateurs();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSave = (formData, isEdit) => {
    if (isEdit) {
      if (!formData.id) {
        console.error('ID manquant pour la modification');
        toast.error("Erreur: ID utilisateur manquant");
        return;
      }
      handleModifier(formData.id, formData);
    } else {
      handleAjouter(formData);
    }
  };

  // Couleurs des badges
  const getRoleColor = (type) => {
    switch(type) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'formateur': return 'bg-orange-100 text-orange-700';
      case 'parent': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getRoleLabel = (type) => {
    switch(type) {
      case 'admin': return 'Administrateur';
      case 'formateur': return 'Formateur';
      case 'parent': return 'Parent';
      default: return 'Apprenant';
    }
  };

  const getStatutColor = (statut) => {
    return statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  // Filtrage
const utilisateursFiltres = utilisateurs.filter(user => {
  const matchRecherche = user.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
                         user.email?.toLowerCase().includes(recherche.toLowerCase());
  const matchRole = filtreRole === 'tous' || user.type === filtreRole;
  return matchRecherche && matchRole;
});

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Gérez les comptes de la plateforme</p>
        </div>
        <button 
          onClick={() => { setUtilisateurSelectionne(null); setModaleOuverte(true); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
       <select 
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
          onChange={(e) => setFiltreRole(e.target.value)}
        >
          <option value="tous">Tous les types</option>
          <option value="admin">Administrateurs</option>
          <option value="formateur">Formateurs</option>
          <option value="parent">Parents</option>
          <option value="apprenant">Apprenants</option>
        </select>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {chargement ? (
          <div className="p-12 text-center text-gray-400 italic">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-600 text-sm font-semibold">
                <tr>
                  
                  <th className="p-4">Nom</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Telephone</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {utilisateursFiltres.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    
                    <td className="p-4 font-medium">{user.nom}</td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4 text-sm">{user.telephone}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.type)}`}>
                        {getRoleLabel(user.type)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(user.statut)}`}>
                        {user.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => { setUtilisateurSelectionne(user); setModaleOuverte(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => { setUtilisateurASupprimer(user); setSuppressionOuverte(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {utilisateursFiltres.length === 0 && (
              <div className="p-12 text-center text-gray-500">Aucun utilisateur trouvé.</div>
            )}
          </div>
        )}
      </div>

      <ModaleUtilisateur 
        isOpen={modaleOuverte} 
        onClose={() => setModaleOuverte(false)} 
        onSave={handleSave} 
        utilisateurAModifier={utilisateurSelectionne} 
      />

      <ConfirmationSuppression 
        isOpen={suppressionOuverte} 
        onClose={() => setSuppressionOuverte(false)} 
        onConfirm={handleSupprimer} 
        utilisateurNom={utilisateurASupprimer?.nom} 
         type="cet utilisateur"
      />
    </div>
  );
};

export default GestionUtilisateurs;