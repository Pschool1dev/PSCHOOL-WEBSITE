import { HiOutlineExclamation, HiOutlineX } from 'react-icons/hi';

const ConfirmationSuppression = ({ isOpen, onClose, onConfirm, titre, type = "l'élément" }) => {
  if (!isOpen) return null;

  // On nettoie le type pour s'assurer qu'il est correct (ex: "ce service" au lieu de "le service")
  // Mais ici on va rester sur ta structure de phrase
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
          
          {/* En-tête */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition">
              <HiOutlineX className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Corps */}
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <HiOutlineExclamation className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="text-center text-gray-700 mb-2">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{type}</span> ?
            </p>
            <p className="text-center text-sm text-gray-500 font-medium italic">
              « {titre} »
            </p>
            <p className="text-center text-xs text-gray-400 mt-4">
              Cette action est irréversible.
            </p>
          </div>
          
          {/* Boutons */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-100 transition active:scale-95 font-medium"
            >
              Supprimer
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ConfirmationSuppression;