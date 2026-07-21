const COMPLETION_FIELDS = ['date_of_birth', 'gender', 'religion', 'education', 'occupation', 'city', 'photo'];

export function computeProfileCompletion(profile) {
  if (!profile) return 0;
  const completed = COMPLETION_FIELDS.filter((f) => profile[f]).length;
  return Math.round((completed / COMPLETION_FIELDS.length) * 100);
}
