import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi';

const ModaleService = ({ isOpen, onClose, onSave, serviceAModifier }) => {
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        statut: 'actif'
    });

    const [imageFile, setImageFile] = useState(null);
    const [apercuImage, setApercuImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (serviceAModifier && isOpen) {
            setFormData({
                titre: serviceAModifier.titre || '',
                description: serviceAModifier.description || '',
                statut: serviceAModifier.statut || 'actif'
            });
            setApercuImage(serviceAModifier.image || null);
            setImageFile(null);
        } else if (isOpen) {
            setFormData({ 
                titre: '', 
                description: '', 
                statut: 'actif' 
            });
            setApercuImage(null);
            setImageFile(null);
        }
    }, [serviceAModifier, isOpen]);

    // Nettoyage de l'URL d'aperçu pour éviter les fuites mémoire
    useEffect(() => {
        return () => {
            if (apercuImage && apercuImage.startsWith('blob:')) {
                URL.revokeObjectURL(apercuImage);
            }
        };
    }, [apercuImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setApercuImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        data.append('statut', formData.statut);
        
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await onSave(data, !!serviceAModifier);
            onClose(); // Fermer la modale après succès
        } catch (error) {
            console.error("Erreur soumission modale:", error);
            // L'erreur est déjà gérée dans GestionServices
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {serviceAModifier ? 'Modifier le service' : 'Ajouter un nouveau service'}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                        type="button"
                    >
                        <HiOutlineX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image illustrative *</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 shadow-inner">
                                {apercuImage ? (
                                    <img src={apercuImage} alt="Aperçu" className="w-full h-full object-cover" />
                                ) : (
                                    <HiOutlinePhotograph className="w-8 h-8 text-gray-300" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <input 
                                    type="file" 
                                    id="image-upload" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    name="image"
                                />
                                <label 
                                    htmlFor="image-upload" 
                                    className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                                >
                                    {apercuImage ? 'Changer l\'image' : 'Choisir une image'}
                                </label>
                                <p className="text-[10px] text-gray-400">
                                    {serviceAModifier ? "Laissez vide pour garder l'image actuelle" : "Image obligatoire *"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du service *</label>
                        <input 
                            type="text" 
                            name="titre"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                            placeholder="ex: Conception d'Applications"
                            value={formData.titre}
                            onChange={(e) => setFormData({...formData, titre: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                        <textarea 
                            name="description"
                            required
                            rows="3"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition resize-none"
                            placeholder="Détaillez brièvement ce service..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                        <select 
                            name="statut"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition cursor-pointer"
                            value={formData.statut}
                            onChange={(e) => setFormData({...formData, statut: e.target.value})}
                            required
                        >
                            <option value="actif">Actif (Visible sur le site)</option>
                            <option value="inactif">Inactif (Masqué)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Envoi...' : (serviceAModifier ? 'Mettre à jour' : 'Créer le service')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModaleService;