export function formatAge(age) {
  return age ? `${age} yrs` : '';
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString();
}

export function initialOf(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}
