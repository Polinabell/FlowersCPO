import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  
  if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 