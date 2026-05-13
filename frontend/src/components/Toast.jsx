import { useEffect } from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle } from 'react-icons/hi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />,
    error: <HiOutlineXCircle className="w-5 h-5 text-red-500" />,
    info: <HiOutlineInformationCircle className="w-5 h-5 text-blue-500" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-down ${colors[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
        ×
      </button>
    </div>
  );
};

export default Toast;