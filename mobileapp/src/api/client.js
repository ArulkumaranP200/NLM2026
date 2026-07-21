import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../auth/tokenStorage';

const api = axios.create({ baseURL: API_BASE_URL });

// Set by AuthContext on mount so the interceptor can force a logout when the
// refresh token itself is rejected, without this module needing to know about
// navigation or React state.
let onSessionExpired = () => {};
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = await getRefreshToken();
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
          await setTokens({ access: data.access, refresh: data.refresh });
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          await clearTokens();
          onSessionExpired();
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
