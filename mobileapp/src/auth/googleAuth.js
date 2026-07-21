// Native Google Sign-In is not wired up yet — it needs a Google Cloud OAuth
// project with iOS/Android client IDs, plus @react-native-google-signin/google-signin,
// which requires an EAS dev-client build (not Expo Go). See mobileapp plan doc.
//
// Once that's ready, this function should perform native sign-in and return the
// Google ID token, which gets POSTed to /auth/google/ unchanged (same endpoint
// the web app already uses) — no other screen code should need to change.
export async function signInWithGoogle() {
  throw new Error('Google Sign-In is not configured yet.');
}
