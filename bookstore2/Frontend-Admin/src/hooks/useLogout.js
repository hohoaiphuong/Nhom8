import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

/**
 * Hook for admin logout functionality
 * Clears authentication data from localStorage and redirects to login
 */
export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Try to call logout endpoint (optional - for cleanup)
      await authApi.logout();
    } catch (error) {
      // Continue logout even if endpoint fails
      console.warn('Logout endpoint error:', error);
    } finally {
      // Always clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('user');
      
      // Redirect to login
      navigate('/login');
    }
  };

  return { logout };
};
