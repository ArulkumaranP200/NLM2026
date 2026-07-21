import { Platform } from 'react-native';

// The browser preview (npx expo start --web) runs on the same PC as a locally
// started Django backend, and the deployed backend's CORS whitelist doesn't (and
// shouldn't) include arbitrary localhost dev ports — so web talks to localhost,
// while native builds (which aren't subject to browser CORS at all) hit the real
// deployed API directly.
export const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:8000/api'
  : 'https://nlm2026.onrender.com/api';

export const PROFILE_UNLOCK_PRICE = 99;
