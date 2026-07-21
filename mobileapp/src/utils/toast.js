import Toast from 'react-native-toast-message';

export const toast = {
  success: (message) => Toast.show({ type: 'success', text1: message }),
  error: (message) => Toast.show({ type: 'error', text1: message }),
};

export function apiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err.response?.status === 429) {
    const retryAfter = err.response.headers?.['retry-after'];
    return retryAfter ? `Too many attempts. Try again in ${retryAfter}s.` : 'Too many attempts. Please try again shortly.';
  }
  const data = err.response?.data;
  if (!data) return fallback;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (data.error) return data.error;
  if (data.detail) return data.detail;
  return fallback;
}
