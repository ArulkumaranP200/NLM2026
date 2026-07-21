import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { setSessionExpiredHandler } from '../api/client';
import { getAccessToken, setTokens, clearTokens } from './tokenStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          try {
            const { data } = await api.get('/auth/me/');
            setUser(data);
          } catch {
            await clearTokens();
          }
        }
      } catch {
        // Storage itself is unavailable — treat as logged out rather than hanging.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (data) => {
    await setTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
