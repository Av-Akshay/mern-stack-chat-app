import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.chatStore.user);
  const location = useLocation();
  
  useEffect(() => {
    // Log when someone tries to access protected route without auth
    if (!user?.token) {
      console.log('Unauthorized access attempt to:', location.pathname);
    }
  }, [user, location]);
  
  // Check if user is authenticated
  if (!user?.token) {
    // Redirect to home page with the return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;