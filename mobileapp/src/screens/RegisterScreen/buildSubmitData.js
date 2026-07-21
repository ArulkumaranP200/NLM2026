export function buildSubmitData(form) {
  const data = { ...form };
  if (data.gender === 'other') data.gender = data.gender_other.trim();
  if (data.religion === 'other') data.religion = data.religion_other.trim();
  if (data.marital_status === 'other') data.marital_status = data.marital_status_other.trim();
  if (data.education === 'other') data.education = data.education_other.trim();
  if (data.mother_tongue === 'Other') data.mother_tongue = data.mother_tongue_other.trim();
  if (data.caste === 'Other') data.caste = data.caste_other.trim();
  delete data.gender_other;
  delete data.religion_other;
  delete data.marital_status_other;
  delete data.education_other;
  delete data.mother_tongue_other;
  delete data.caste_other;

  if (data.birth_time_hour && data.birth_time_minute && data.birth_time_period) {
    let h = parseInt(data.birth_time_hour, 10);
    if (data.birth_time_period === 'AM') { if (h === 12) h = 0; }
    else if (h !== 12) { h += 12; }
    data.birth_time = `${String(h).padStart(2, '0')}:${String(data.birth_time_minute).padStart(2, '0')}`;
  }
  delete data.birth_time_hour;
  delete data.birth_time_minute;
  delete data.birth_time_period;

  return data;
}
