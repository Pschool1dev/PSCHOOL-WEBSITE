import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Vérification du rôle si des rôles sont spécifiés
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirige vers un dashboard ou page d'erreur si l'accès est refusé
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;