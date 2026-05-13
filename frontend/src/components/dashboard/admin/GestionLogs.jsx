import { useState } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlineEye, 
  HiOutlineX,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlineCalendar 
} from 'react-icons/hi';

// Données temporaires (simulation)
const logsSimules = [
  { id: 1, user_id: 1, user_nom: 'Moussa Kabore', user_role: 'apprenant', action: 'connexion_succes', description: 'Connexion réussie', ip: '192.168.1.1', user_agent: 'Chrome/120.0 / Windows 10', created_at: '2024-04-18T14:30:00' },
  { id: 2, user_id: 2, user_nom: 'Admin', user_role: 'admin', action: 'suppression_utilisateur', description: 'Suppression de l\'utilisateur Jean Dupont', ip: '192.168.1.2', user_agent: 'Firefox/124.0 / Windows 10', created_at: '2024-04-18T14:25:00' },
  { id: 3, user_id: 3, user_nom: 'Marie Curie', user_role: 'formateur', action: 'ajout_formation', description: 'Ajout de la formation "IA Avancée"', ip: '192.168.1.3', user_agent: 'Chrome/120.0 / Mac OS', created_at: '2024-04-18T14:20:00' },
  { id: 4, user_id: 4, user_nom: 'Alphonse Sore', user_role: 'parent', action: 'paiement_effectue', description: 'Paiement de 80 000 FCFA pour la formation "Robotique"', ip: '192.168.1.4', user_agent: 'Safari/17.0 / iOS', created_at: '2024-04-18T14:15:00' },
  { id: 5, user_id: null, user_nom: 'Inconnu', user_role: 'visiteur', action: 'connexion_echouee', description: 'Tentative de connexion avec email admin@pschool.com', ip: '45.67.89.10', user_agent: 'Chrome/119.0 / Windows 10', created_at: '2024-04-18T14:10:00' },
  { id: 6, user_id: 1, user_nom: 'Moussa Kabore', user_role: 'apprenant', action: 'inscription_formation', description: 'Inscription à la formation "Développement Web"', ip: '192.168.1.1', user_agent: 'Chrome/120.0 / Windows 10', created_at: '2024-04-18T13:45:00' },
  { id: 7, user_id: 2, user_nom: 'Admin', user_role: 'admin', action: 'modification_formation', description: 'Modification du prix de la formation "Data Science"', ip: '192.168.1.2', user_agent: 'Firefox/124.0 / Windows 10', created_at: '2024-04-18T13:30:00' },
  { id: 8, user_id: 5, user_nom: 'Fatou Diallo', user_role: 'apprenant', action: 'certificat_telecharge', description: 'Téléchargement du certificat "Programmation Enfant"', ip: '192.168.1.5', user_agent: 'Edge/123.0 / Windows 11', created_at: '2024-04-18T13:15:00' },
];

const GestionLogs = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreAction, setFiltreAction] = useState('tous');
  const [filtreDate, setFiltreDate] = useState('tous');
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [logSelectionne, setLogSelectionne] = useState(null);

  // Types d'actions disponibles
  const actionsDisponibles = [
    { value: 'tous', label: 'Toutes les actions' },
    { value: 'connexion_succes', label: 'Connexion réussie' },
    { value: 'connexion_echouee', label: 'Connexion échouée' },
    { value: 'suppression_utilisateur', label: 'Suppression utilisateur' },
    { value: 'ajout_formation', label: 'Ajout formation' },
    { value: 'modification_formation', label: 'Modification formation' },
    { value: 'inscription_formation', label: 'Inscription formation' },
    { value: 'paiement_effectue', label: 'Paiement effectué' },
    { value: 'certificat_telecharge', label: 'Certificat téléchargé' },
  ];

  // Filtres de date
  const dateOptions = [
    { value: 'tous', label: 'Toutes les dates' },
    { value: 'aujourdhui', label: 'Aujourd\'hui' },
    { value: 'cette_semaine', label: 'Cette semaine' },
    { value: 'ce_mois', label: 'Ce mois' },
  ];

  // Filtrer les logs
  const logsFiltres = logsSimules.filter(log => {
    const matchRecherche = log.user_nom.toLowerCase().includes(recherche.toLowerCase()) ||
                           log.description.toLowerCase().includes(recherche.toLowerCase()) ||
                           log.ip.includes(recherche);
    const matchAction = filtreAction === 'tous' || log.action === filtreAction;
    
    let matchDate = true;
    const logDate = new Date(log.created_at);
    const now = new Date();
    
    if (filtreDate === 'aujourdhui') {
      matchDate = logDate.toDateString() === now.toDateString();
    } else if (filtreDate === 'cette_semaine') {
      const semaineDebut = new Date(now.setDate(now.getDate() - now.getDay()));
      const semaineFin = new Date(now.setDate(now.getDate() + 6));
      matchDate = logDate >= semaineDebut && logDate <= semaineFin;
    } else if (filtreDate === 'ce_mois') {
      matchDate = logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }
    
    return matchRecherche && matchAction && matchDate;
  });

  // Couleurs des badges
  const getActionColor = (action) => {
    if (action.includes('connexion_succes')) return 'bg-green-100 text-green-700';
    if (action.includes('connexion_echouee')) return 'bg-red-100 text-red-700';
    if (action.includes('suppression')) return 'bg-red-100 text-red-700';
    if (action.includes('ajout')) return 'bg-blue-100 text-blue-700';
    if (action.includes('modification')) return 'bg-orange-100 text-orange-700';
    if (action.includes('inscription')) return 'bg-purple-100 text-purple-700';
    if (action.includes('paiement')) return 'bg-green-100 text-green-700';
    if (action.includes('certificat')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getActionLabel = (action) => {
    switch(action) {
      case 'connexion_succes': return 'Connexion réussie';
      case 'connexion_echouee': return 'Connexion échouée';
      case 'suppression_utilisateur': return 'Suppression utilisateur';
      case 'ajout_formation': return 'Ajout formation';
      case 'modification_formation': return 'Modification formation';
      case 'inscription_formation': return 'Inscription formation';
      case 'paiement_effectue': return 'Paiement effectué';
      case 'certificat_telecharge': return 'Certificat téléchargé';
      default: return action;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'formateur': return 'bg-orange-100 text-orange-700';
      case 'apprenant': return 'bg-blue-100 text-blue-700';
      case 'parent': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Voir les détails
  const handleVoirDetails = (log) => {
    setLogSelectionne(log);
    setModalDetailsOuverte(true);
  };

  // Exporter en CSV
  const handleExporterCSV = () => {
    const headers = ['ID', 'Date', 'Utilisateur', 'Rôle', 'Action', 'Description', 'IP', 'User Agent'];
    const rows = logsFiltres.map(log => [
      log.id,
      new Date(log.created_at).toLocaleString('fr-FR'),
      log.user_nom,
      log.user_role,
      getActionLabel(log.action),
      log.description,
      log.ip,
      log.user_agent
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_securite_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-2xl font-bold text-gray-800">Logs de sécurité</h1>
          <p className="text-gray-500 text-sm mt-1">
            Journal des actions sensibles sur la plateforme
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

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par utilisateur, description ou IP..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filtreAction}
          onChange={(e) => setFiltreAction(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {actionsDisponibles.map(act => (
            <option key={act.value} value={act.value}>{act.label}</option>
          ))}
        </select>
        <select
          value={filtreDate}
          onChange={(e) => setFiltreDate(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {dateOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Tableau des logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Utilisateur</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">IP</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-600">Détails</th>
              </tr>
            </thead>
            <tbody>
              {logsFiltres.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-600">{formatDate(log.created_at)}</td>
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{log.user_nom}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleColor(log.user_role)}`}>
                        {log.user_role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 max-w-md truncate">{log.description}</td>
                  <td className="px-6 py-3 text-sm font-mono text-gray-600">{log.ip}</td>
                  <td className="px-6 py-3 text-center">
                    <button 
                      onClick={() => handleVoirDetails(log)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Voir détails"
                    >
                      <HiOutlineEye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat */}
        {logsFiltres.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun log trouvé
          </div>
        )}
      </div>

      {/* Modale des détails */}
      {modalDetailsOuverte && logSelectionne && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalDetailsOuverte(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Détails du log</h2>
                <button onClick={() => setModalDetailsOuverte(false)} className="p-1 rounded-lg hover:bg-gray-100 transition">
                  <HiOutlineX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID :</span>
                  <span className="font-medium">{logSelectionne.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date :</span>
                  <span className="font-medium">{formatDate(logSelectionne.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Utilisateur :</span>
                  <span className="font-medium">{logSelectionne.user_nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rôle :</span>
                  <span className={`font-medium ${getRoleColor(logSelectionne.user_role)}`}>
                    {logSelectionne.user_role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action :</span>
                  <span className={`font-medium ${getActionColor(logSelectionne.action)}`}>
                    {getActionLabel(logSelectionne.action)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Description :</span>
                  <span className="font-medium text-sm">{logSelectionne.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IP :</span>
                  <span className="font-mono text-sm">{logSelectionne.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User Agent :</span>
                  <span className="font-medium text-xs">{logSelectionne.user_agent}</span>
                </div>
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

export default GestionLogs;