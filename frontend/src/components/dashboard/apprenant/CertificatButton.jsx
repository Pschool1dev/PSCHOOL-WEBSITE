import { useState, useEffect } from 'react';
import { HiDownload, HiCheckCircle, HiXCircle, HiDocumentText } from 'react-icons/hi';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const CertificatButton = ({ inscriptionId, formationId, formationTitre, onCertificatGenere }) => {
  const [certificat, setCertificat] = useState(null);
  const [disponible, setDisponible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    verifierDisponibilite();
  }, [formationId]);

  const verifierDisponibilite = async () => {
    try {
      const response = await api.get(`/certificat/verifier/${formationId}`);
      setDisponible(response.disponible);
      if (response.certificat) {
        setCertificat(response.certificat);
      }
    } catch (error) {
      console.error("Erreur vérification certificat:", error);
    }
  };

  const genererCertificat = async () => {
    setLoading(true);
    try {
      const response = await api.post('/certificat/generer', {
        inscription_id: inscriptionId
      });
      
      if (response.success) {
        setCertificat(response.certificat);
        setDisponible(true);
        toast.success("Certificat généré avec succès !");
        if (onCertificatGenere) onCertificatGenere(response.certificat);
      } else {
        toast.error(response.message || "Erreur lors de la génération");
      }
    } catch (error) {
      console.error("Erreur génération certificat:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };
const telechargerCertificat = async () => {
    if (!certificat || !certificat.id) {
        toast.error("Certificat non trouvé");
        return;
    }
    
    try {
        toast.loading("Préparation du téléchargement...");
        
        const response = await api.get(`/certificat/${certificat.id}/telecharger`, {
            responseType: 'blob'
        });
        
        toast.dismiss();
        
        // Vérifier le type de réponse
        console.log("Type de réponse:", typeof response);
        console.log("Response:", response);
        
        // Récupérer le blob (différent selon la structure)
        let blob;
        if (response instanceof Response) {
            blob = await response.blob();
        } else if (response.data instanceof Blob) {
            blob = response.data;
        } else if (response instanceof Blob) {
            blob = response;
        } else {
            console.error("Format de réponse inattendu:", response);
            toast.error("Format de réponse inattendu");
            return;
        }
        
      
        
        if (blob.size > 0) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificat_${certificat.numero_certificat || certificat.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Téléchargement démarré");
        } else {
            toast.error("Fichier vide");
        }
    } catch (error) {
        toast.dismiss();
        console.error("Erreur téléchargement:", error);
        toast.error(error.message || "Erreur lors du téléchargement");
    }
};

  if (!disponible && !certificat) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <HiXCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Terminez tous les modules pour obtenir votre certificat
        </p>
      </div>
    );
  }

  if (certificat) {
    return (
      <div className="mt-6 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <HiDocumentText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Certificat disponible</h4>
              <p className="text-xs text-green-600">
                N° {certificat.numero_certificat} • Délivré le {new Date(certificat.date_delivrance).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={telechargerCertificat}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition"
          >
            <HiDownload className="w-4 h-4" />
            Télécharger mon certificat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <HiCheckCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800">Félicitations !</h4>
            <p className="text-xs text-amber-700">
              Vous avez terminé tous les modules de cette formation
            </p>
          </div>
        </div>
        <button
          onClick={genererCertificat}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium text-sm hover:bg-amber-700 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <HiDocumentText className="w-4 h-4" />
          )}
          {loading ? "Génération..." : "Obtenir mon certificat"}
        </button>
      </div>
    </div>
  );
};

export default CertificatButton;