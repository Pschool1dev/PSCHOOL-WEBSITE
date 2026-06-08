import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/parent/paiements');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h1>
        <p className="text-gray-600 mb-4">Votre paiement a été validé avec succès.</p>
        
        {transactionId && (
          <p className="text-xs text-gray-400 mb-6">Référence : {transactionId}</p>
        )}
        
        <p className="text-sm text-gray-500">
          Redirection dans {countdown} seconde{countdown > 1 ? 's' : ''}...
        </p>
        
        <button
          onClick={() => navigate('/parent/paiements')}
          className="mt-6 text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Retour maintenant →
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;