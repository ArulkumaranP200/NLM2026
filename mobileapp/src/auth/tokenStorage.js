import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';

// expo-secure-store has no working web implementation (it throws at runtime rather
// than falling back), so the web preview needs a separate storage path. localStorage
// isn't as secure as the native keystore, but this only runs in the browser dev
// preview — real devices always use SecureStore.
const webStorage = {
  getItemAsync: async (key) => window.localStorage.getItem(key),
  setItemAsync: async (key, value) => window.localStorage.setItem(key, value),
  deleteItemAsync: async (key) => window.localStorage.removeItem(key),
};

const storage = Platform.OS === 'web' ? webStorage : SecureStore;

export async function getAccessToken() {
  return storage.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken() {
  return storage.getItemAsync(REFRESH_KEY);
}

export async function setTokens({ access, refresh }) {
  if (access) await storage.setItemAsync(ACCESS_KEY, access);
  if (refresh) await storage.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await storage.deleteItemAsync(ACCESS_KEY);
  await storage.deleteItemAsync(REFRESH_KEY);
}
