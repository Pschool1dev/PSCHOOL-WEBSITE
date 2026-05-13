import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi';

const ModaleService = ({ isOpen, onClose, onSave, serviceAModifier }) => {
    const [formData, setFormData] = useState({
        id: '',
        titre: '',
        description: '',
        statut: 'actif'
    });

    const [imageFile, setImageFile] = useState(null);
    const [apercuImage, setApercuImage] = useState(null);

    useEffect(() => {
        if (serviceAModifier) {
            setFormData({
                id: serviceAModifier.id,
                titre: serviceAModifier.titre || '',
                description: serviceAModifier.description || '',
                statut: serviceAModifier.statut || 'actif'
            });
            setApercuImage(serviceAModifier.image);
        } else {
            setFormData({ id: '', titre: '', description: '', statut: 'actif' });
            setApercuImage(null);
            setImageFile(null);
        }
    }, [serviceAModifier, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setApercuImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        data.append('statut', formData.statut);
        
        if (formData.id) data.append('id', formData.id);
        if (imageFile) data.append('image', imageFile);

        onSave(data, !!serviceAModifier);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {serviceAModifier ? 'Modifier le service' : 'Ajouter un nouveau service'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <HiOutlineX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Upload Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image du service</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                                {apercuImage ? (
                                    <img src={apercuImage} alt="Aperçu" className="w-full h-full object-cover" />
                                ) : (
                                    <HiOutlinePhotograph className="w-8 h-8 text-gray-300" />
                                )}
                            </div>
                            <input 
                                type="file" 
                                id="image-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <label 
                                htmlFor="image-upload" 
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Choisir une image
                            </label>
                        </div>
                    </div>

                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du service</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                            placeholder="ex: Développement Web, Robotique..."
                            value={formData.titre}
                            onChange={(e) => setFormData({...formData, titre: e.target.value})}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea 
                            required
                            rows="4"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition resize-none"
                            placeholder="Décrivez brièvement le service..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Statut de visibilité</label>
                        <select 
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                            value={formData.statut}
                            onChange={(e) => setFormData({...formData, statut: e.target.value})}
                        >
                            <option value="actif">Actif (Visible sur la vitrine)</option>
                            <option value="inactif">Inactif (Masqué)</option>
                        </select>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                            {serviceAModifier ? 'Enregistrer les modifications' : 'Créer le service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModaleService;