// src/components/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation(); // Récupère la page où l'utilisateur voulait aller

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Vérification de la session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // state={{ from: location }} permet de mémoriser la page actuelle (ex: /inscription)
        // pour y revenir automatiquement après le login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// Export par défaut pour éviter l'erreur "export default not found" dans App.jsx
export default PrivateRoute;