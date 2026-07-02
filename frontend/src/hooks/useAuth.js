import { useAuth } from '../context/AuthContext';

// Custom hook to use auth context with better error handling
export const useAuthContext = () => {
  const auth = useAuth();
  return auth;
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Hook to get current user
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

// Hook to check user role
export const useUserRole = () => {
  const { user } = useAuth();
  return user?.role || null;
};

// Hook to check if user is patient
export const useIsPatient = () => {
  const { isPatient } = useAuth();
  return isPatient;
};

// Hook to check if user is doctor
export const useIsDoctor = () => {
  const { isDoctor } = useAuth();
  return isDoctor;
};

// Hook to check if user is admin
export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin;
};

// Hook for login with loading state
export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
};

// Hook for register with loading state
export const useRegister = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await register(userData);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { register: handleRegister, loading, error };
};

// Hook for logout
export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};