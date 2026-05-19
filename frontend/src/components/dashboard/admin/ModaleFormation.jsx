import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineBookOpen, HiOutlinePhotograph, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineEye, HiOutlineEyeOff, HiOutlineTag } from 'react-icons/hi';

const ModaleFormation = ({ isOpen, onClose, onSave, formationAModifier, formateurs, categoriesExistantes }) => {
    const [formData, setFormData] = useState({
        titre: '', description: '', prix: '', duree: '',
        nb_modules: '', categorie: '', public_cible: 'Adulte',
        statut: 'actif', formateur_id: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (formationAModifier && isOpen) {
            setFormData({
                titre: formationAModifier.titre || '',
                description: formationAModifier.description || '',
                prix: formationAModifier.prix || '',
                duree: formationAModifier.duree || '',
                nb_modules: formationAModifier.nb_modules || '',
                categorie: formationAModifier.categorie || '',
                public_cible: formationAModifier.public_cible || 'Adulte',
                statut: formationAModifier.statut || 'actif',
                formateur_id: formationAModifier.formateur_id || ''
            });
            setPreviewUrl(formationAModifier.image || null);
            setImageFile(null);
        } else if (isOpen) {
            setFormData({
                titre: '', description: '', prix: '', duree: '',
                nb_modules: '', categorie: '', public_cible: 'Adulte',
                statut: 'actif', formateur_id: ''
            });
            setImageFile(null);
            setPreviewUrl(null);
        }
    }, [formationAModifier, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // Sécurité : On n'ajoute que les valeurs non nulles
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        if (imageFile instanceof File) {
            data.append('image', imageFile);
        }

        if (formationAModifier?.id) {
            data.append('_method', 'PUT');
        }

        try {
            await onSave(data, !!formationAModifier);
            // La fermeture est gérée par le parent après le succès
        } catch (error) {
            console.error("Erreur soumission modale");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {formationAModifier ? 'Modifier la formation' : 'Nouvelle Formation'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition">
                        <HiOutlineX className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-left">
                    {/* Statut & Catégorie */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Visibilité</label>
                            <select 
                                value={formData.statut}
                                onChange={(e) => setFormData({...formData, statut: e.target.value})}
                                className="w-full text-xs font-bold bg-transparent outline-none cursor-pointer"
                            >
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                            </select>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Catégorie</label>
                            <input 
                                type="text"
                                list="categories-list"
                                value={formData.categorie}
                                onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                                placeholder="ex: Design"
                                className="w-full text-xs font-bold bg-transparent outline-none"
                                required
                            />
                            <datalist id="categories-list">
                                {categoriesExistantes.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="space-y-2">
                        {previewUrl && (
                            <div className="relative h-32 w-full rounded-xl border overflow-hidden bg-gray-100">
                                <img src={previewUrl} className="w-full h-full object-cover" alt="Aperçu" />
                            </div>
                        )}
                        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                            <HiOutlinePhotograph className="w-5 h-5 text-gray-400" />
                            <p className="text-[10px] text-gray-500 font-bold uppercase">
                                {imageFile ? "Image sélectionnée" : (formationAModifier ? "Changer l'image" : "Image de couverture *")}
                            </p>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required={!formationAModifier} />
                        </label>
                    </div>

                    {/* Titre */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Titre de la formation *</label>
                        <input 
                            type="text" required value={formData.titre}
                            onChange={(e) => setFormData({...formData, titre: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    {/* Prix et Durée */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Prix (FCFA)</label>
                            <input 
                                type="number" required value={formData.prix}
                                onChange={(e) => setFormData({...formData, prix: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Durée</label>
                            <input 
                                type="text" required value={formData.duree} placeholder="ex: 3 mois"
                                onChange={(e) => setFormData({...formData, duree: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg outline-none"
                            />
                        </div>
                    </div>

                    {/* Public & Modules */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Public cible</label>
                            <select 
                                value={formData.public_cible}
                                onChange={(e) => setFormData({...formData, public_cible: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg outline-none bg-white"
                            >
                                <option value="Adulte">Adulte</option>
                                <option value="Enfant">Enfant</option>
                                <option value="Professionnel">Professionnel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Modules</label>
                            <input 
                                type="number" required value={formData.nb_modules}
                                onChange={(e) => setFormData({...formData, nb_modules: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg outline-none"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea 
                            required value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg outline-none"
                            rows="2"
                        />
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-xl text-xs font-black uppercase">Annuler</button>
                        <button 
                            type="submit" disabled={loading}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Envoi...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModaleFormation;