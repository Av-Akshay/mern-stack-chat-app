import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleLogout } from '../store/slice';
import { persistor } from '../store/store';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.chatStore.user);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from Redux store
      const token = user?.token;
      
      if (token) {
        // Call logout API endpoint
        await axios.post(
          'http://localhost:8000/api/user/logout',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Emit socket logout event if socket is available
      const socket = window.socket; // Socket is stored globally
      if (socket && socket.connected && user?._id) {
        socket.emit('logout', user._id);
        // Don't disconnect immediately, let the server handle it
        setTimeout(() => {
          if (socket.connected) {
            socket.disconnect();
          }
        }, 100);
      }
      
      // Clear Redux state
      dispatch(handleLogout());
      
      // Purge persisted state
      await persistor.purge();
      
      // Navigate to home/login page
      navigate('/');
      
      return true; // Success
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.response?.data?.message || 'Failed to logout');
      
      // Even if API call fails, clear local state and redirect
      dispatch(handleLogout());
      await persistor.purge();
      navigate('/');
      
      return false; // Failed but still cleaned up locally
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate, user]);

  return {
    logout,
    isLoading,
    error
  };
};

export default useLogout;