import { useState } from 'react';
import { 
    HiOutlineXCircle ,
  HiOutlineSearch, 
  HiOutlineEye, 
  HiOutlineCheckCircle, 
  HiOutlineRefresh, 
  HiOutlineDownload,
  HiOutlineCalendar 
} from 'react-icons/hi';
import ConfirmationSuppression from './ConfirmationSuppression';

// Données temporaires (simulation)
const paiementsSimules = [
  { id: 1, apprenant: 'Moussa Kabore', formation: 'Développement Web', montant: 150000, mode: 'orange_money', date: '2024-03-15T10:30:00', statut: 'valide', transactionId: 'ORNG-123456789', telephone: '+22670123456' },
  { id: 2, apprenant: 'Alphonse Sore', formation: 'Robotique Enfant', montant: 80000, mode: 'wave', date: '2024-03-20T14:45:00', statut: 'en_attente', transactionId: 'WAVE-987654321', telephone: '+22670234567' },
  { id: 3, apprenant: 'Marie Ouedraogo', formation: 'Data Science', montant: 200000, mode: 'carte', date: '2024-03-25T09:15:00', statut: 'valide', transactionId: 'CRD-456789123', telephone: '+22670345678' },
  { id: 4, apprenant: 'Jean Dupont', formation: 'Cybersécurité', montant: 180000, mode: 'moov_money', date: '2024-04-01T16:20:00', statut: 'echoue', transactionId: 'MOOV-789123456', telephone: '+22670456789' },
  { id: 5, apprenant: 'Fatou Diallo', formation: 'Programmation Enfant', montant: 60000, mode: 'orange_money', date: '2024-04-05T11:00:00', statut: 'en_attente', transactionId: 'ORNG-456123789', telephone: '+22670567890' },
];

const GestionPaiements = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreMode, setFiltreMode] = useState('tous');
  const [paiements, setPaiements] = useState(paiementsSimules);
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [paiementSelectionne, setPaiementSelectionne] = useState(null);

  // Filtrer les paiements
  const paiementsFiltres = paiements.filter(p => {
    const matchRecherche = p.apprenant.toLowerCase().includes(recherche.toLowerCase()) ||
                           p.formation.toLowerCase().includes(recherche.toLowerCase()) ||
                           p.transactionId.toLowerCase().includes(recherche.toLowerCase());
    const matchStatut = filtreStatut === 'tous' || p.statut === filtreStatut;
    const matchMode = filtreMode === 'tous' || p.mode === filtreMode;
    return matchRecherche && matchStatut && matchMode;
  });

  // Statistiques
  const totalMontant = paiements.reduce((sum, p) => sum + p.montant, 0);
  const totalEnAttente = paiements.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0);
  const totalValide = paiements.filter(p => p.statut === 'valide').reduce((sum, p) => sum + p.montant, 0);
  const totalRembourse = paiements.filter(p => p.statut === 'rembourse').reduce((sum, p) => sum + p.montant, 0);

  // Couleurs des badges
  const getStatutColor = (statut) => {
    switch(statut) {
      case 'valide': return 'bg-green-100 text-green-700';
      case 'en_attente': return 'bg-orange-100 text-orange-700';
      case 'echoue': return 'bg-red-100 text-red-700';
      case 'rembourse': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch(statut) {
      case 'valide': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'echoue': return 'Échoué';
      case 'rembourse': return 'Remboursé';
      default: return statut;
    }
  };

  const getModeLabel = (mode) => {
    switch(mode) {
      case 'orange_money': return 'Orange Money';
      case 'wave': return 'Wave';
      case 'carte': return 'Carte bancaire';
      case 'moov_money': return 'Moov Money';
      default: return mode;
    }
  };

  const getModeColor = (mode) => {
    switch(mode) {
      case 'orange_money': return 'bg-orange-100 text-orange-700';
      case 'wave': return 'bg-purple-100 text-purple-700';
      case 'carte': return 'bg-blue-100 text-blue-700';
      case 'moov_money': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Valider un paiement
  const handleValider = (id) => {
    setPaiements(paiements.map(p =>
      p.id === id 
        ? { ...p, statut: 'valide' }
        : p
    ));
  };

  // Rembourser un paiement
  const handleRembourser = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir rembourser ce paiement ?')) {
      setPaiements(paiements.map(p =>
        p.id === id 
          ? { ...p, statut: 'rembourse' }
          : p
      ));
    }
  };

  // Voir les détails
  const handleVoirDetails = (paiement) => {
    setPaiementSelectionne(paiement);
    setModalDetailsOuverte(true);
  };

  // Exporter en CSV
  const handleExporterCSV = () => {
    const headers = ['ID', 'Apprenant', 'Formation', 'Montant', 'Mode', 'Date', 'Statut', 'Transaction ID', 'Téléphone'];
    const rows = paiementsFiltres.map(p => [
      p.id,
      p.apprenant,
      p.formation,
      p.montant,
      getModeLabel(p.mode),
      new Date(p.date).toLocaleString('fr-FR'),
      getStatutLabel(p.statut),
      p.transactionId,
      p.telephone || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'paiements.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formater le prix
  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
  };

  // Formater la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR') + ' ' + new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paiements</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérer les transactions financières
          </p>
        </div>
        <button
          onClick={handleExporterCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <HiOutlineDownload className="h-5 w-5" />
          Exporter CSV
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{formatPrix(totalMontant)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">En attente</p>
          <p className="text-2xl font-bold text-orange-600">{formatPrix(totalEnAttente)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Validé</p>
          <p className="text-2xl font-bold text-green-600">{formatPrix(totalValide)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Remboursé</p>
          <p className="text-2xl font-bold text-blue-600">{formatPrix(totalRembourse)}</p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par apprenant, formation ou ID transaction..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="tous">Tous les statuts</option>
          <option value="valide">Validés</option>
          <option value="en_attente">En attente</option>
          <option value="echoue">Échoués</option>
          <option value="rembourse">Remboursés</option>
        </select>
        <select
          value={filtreMode}
          onChange={(e) => setFiltreMode(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="tous">Tous les modes</option>
          <option value="orange_money">Orange Money</option>
          <option value="wave">Wave</option>
          <option value="carte">Carte bancaire</option>
          <option value="moov_money">Moov Money</option>
        </select>
      </div>

      {/* Tableau des paiements */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Apprenant</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Formation</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Montant</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Mode</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Statut</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiementsFiltres.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-600">{p.id}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">{p.apprenant}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{p.formation}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-600">{formatPrix(p.montant)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(p.mode)}`}>
                      {getModeLabel(p.mode)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{formatDate(p.date)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(p.statut)}`}>
                      {getStatutLabel(p.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleVoirDetails(p)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Voir détails"
                      >
                        <HiOutlineEye className="h-5 w-5" />
                      </button>
                      {p.statut === 'en_attente' && (
                        <button 
                          onClick={() => handleValider(p.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                          title="Valider"
                        >
                          <HiOutlineCheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      {p.statut === 'valide' && (
                        <button 
                          onClick={() => handleRembourser(p.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Rembourser"
                        >
                          <HiOutlineRefresh className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat */}
        {paiementsFiltres.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun paiement trouvé
          </div>
        )}
      </div>

      {/* Modale des détails */}
      {modalDetailsOuverte && paiementSelectionne && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalDetailsOuverte(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Détails du paiement</h2>
                <button onClick={() => setModalDetailsOuverte(false)} className="p-1 rounded-lg hover:bg-gray-100 transition">
                  <HiOutlineXCircle  className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID :</span>
                  <span className="font-medium">{paiementSelectionne.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Apprenant :</span>
                  <span className="font-medium">{paiementSelectionne.apprenant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Formation :</span>
                  <span className="font-medium">{paiementSelectionne.formation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant :</span>
                  <span className="font-medium text-green-600">{formatPrix(paiementSelectionne.montant)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mode :</span>
                  <span className="font-medium">{getModeLabel(paiementSelectionne.mode)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date :</span>
                  <span className="font-medium">{formatDate(paiementSelectionne.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statut :</span>
                  <span className={`font-medium ${getStatutColor(paiementSelectionne.statut)}`}>
                    {getStatutLabel(paiementSelectionne.statut)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID :</span>
                  <span className="font-medium text-xs">{paiementSelectionne.transactionId}</span>
                </div>
                {paiementSelectionne.telephone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Téléphone :</span>
                    <span className="font-medium">{paiementSelectionne.telephone}</span>
                  </div>
                )}
              </div>
              <div className="p-6 pt-0">
                <button
                  onClick={() => setModalDetailsOuverte(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPaiements;