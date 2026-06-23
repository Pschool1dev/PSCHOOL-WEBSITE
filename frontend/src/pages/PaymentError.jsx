import { useNavigate } from 'react-router-dom';
import { HiXCircle } from 'react-icons/hi';

const PaymentError = () => {
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleReessayer = () => {
    if (user.type === 'parent') {
      navigate('/parent/paiements');
    } else if (user.type === 'apprenant') {
      navigate('/apprenant/mes-formations');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiXCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement échoué</h1>
        <p className="text-gray-600 mb-6">
          Une erreur est survenue lors de votre paiement.
        </p>
        
        <button
          onClick={handleReessayer}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
};

export default PaymentError;