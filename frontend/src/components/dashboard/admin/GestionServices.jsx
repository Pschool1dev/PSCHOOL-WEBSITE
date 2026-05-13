import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import ModaleService from './ModaleServices'; // On crée celui-là après
import ConfirmationSuppression from './ConfirmationSuppression';
import Toast from '../../../components/Toast';
import api from '../../../services/api';

const GestionServices = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);
  const [suppressionOuverte, setSuppressionOuverte] = useState(false);
  const [serviceASupprimer, setServiceASupprimer] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  const fetchServices = async () => {
    try {
      setChargement(true);
      const data = await api.get('/services');
      setServices(data);
    } catch (error) {
      showToast("Erreur lors du chargement des services", "error");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async (formData, isEdit) => {
    try {
      if (isEdit) {
        const id = formData.get('id');
        formData.append('_method', 'PUT'); // Indispensable pour l'upload d'image en modification
        await api.post(`/services/${id}`, formData);
        showToast("Service mis à jour !", "success");
      } else {
        await api.post('/services', formData);
        showToast("Nouveau service ajouté !", "success");
      }
      await fetchServices();
      setModaleOuverte(false);
    } catch (error) {
      showToast("Erreur lors de l'enregistrement", "error");
    }
  };

  const handleSupprimerConfirmer = async () => {
    try {
      await api.delete(`/services/${serviceASupprimer.id}`);
      setSuppressionOuverte(false);
      await fetchServices();
      showToast("Service supprimé !", "success");
    } catch (error) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const servicesFiltres = services.filter(s => 
    s.titre?.toLowerCase().includes(recherche.toLowerCase()) && 
    (filtreStatut === 'tous' || s.statut === filtreStatut)
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Services</h1>
          <p className="text-gray-500">Gérez les prestations affichées sur la vitrine</p>
        </div>
        <button 
          onClick={() => { setServiceSelectionne(null); setModaleOuverte(true); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Ajouter un service
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" placeholder="Rechercher un service..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
        >
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actifs</option>
          <option value="inactif">Inactifs</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {chargement ? (
          <div className="p-12 text-center text-gray-400 italic">Chargement des services...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-600 text-sm font-semibold">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Titre</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {servicesFiltres.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      {s.image && <img src={s.image} className="w-12 h-12 object-cover rounded-lg border" alt="" />}
                    </td>
                    <td className="p-4 font-bold text-gray-800">{s.titre}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{s.description}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        s.statut === 'actif' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {s.statut}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setServiceSelectionne(s); setModaleOuverte(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setServiceASupprimer(s); setSuppressionOuverte(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModaleService 
        isOpen={modaleOuverte} 
        onClose={() => setModaleOuverte(false)} 
        onSave={handleSave} 
        serviceAModifier={serviceSelectionne}
      />

      <ConfirmationSuppression 
        isOpen={suppressionOuverte} 
        onClose={() => setSuppressionOuverte(false)} 
        onConfirm={handleSupprimerConfirmer} 
        formationTitre={serviceASupprimer?.titre} 
        type="ce service"
      />
    </div>
  );
};

export default GestionServices;