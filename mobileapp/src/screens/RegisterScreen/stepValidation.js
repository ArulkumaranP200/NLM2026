import { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX, ageFromDOB } from '../../utils/validators';

export function validateStep(step, form) {
  const e = {};

  if (step === 0) {
    const name = form.full_name.trim();
    if (!name) e.full_name = 'Full name is required';
    else if (name.length < 3) e.full_name = 'Name must be at least 3 characters';
    else if (name.length > 150) e.full_name = 'Name must be less than 150 characters';
    else if (!NAME_REGEX.test(name)) e.full_name = "Name can only contain letters, spaces, and . ' -";

    if (!form.email) e.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) e.email = 'Enter a valid email address';

    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (form.password.length > 128) e.password = 'Password must be less than 128 characters';
    else if (!/(?=.*[A-Z])/.test(form.password)) e.password = 'Must contain at least one uppercase letter';
    else if (!/(?=.*[0-9])/.test(form.password)) e.password = 'Must contain at least one number';

    if (!form.confirm_password) e.confirm_password = 'Please confirm your password';
    else if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
  }

  if (step === 1) {
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!PHONE_REGEX.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number';

    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
    else {
      const age = ageFromDOB(form.date_of_birth);
      if (age === null) e.date_of_birth = 'Enter a valid date of birth';
      else if (new Date(form.date_of_birth) > new Date()) e.date_of_birth = 'Date of birth cannot be in the future';
      else if (age < 18) e.date_of_birth = 'You must be at least 18 years old';
      else if (age > 80) e.date_of_birth = 'Please enter a valid date of birth';
    }

    if (!form.gender) e.gender = 'Please select your gender';
    else if (form.gender === 'other' && !form.gender_other.trim()) e.gender_other = 'Please specify your gender';
    else if (form.gender_other.trim().length > 30) e.gender_other = 'Must be less than 30 characters';

    if (!form.religion) e.religion = 'Please select your religion';
    else if (form.religion === 'other' && !form.religion_other.trim()) e.religion_other = 'Please specify your religion';
    else if (form.religion_other.trim().length > 50) e.religion_other = 'Must be less than 50 characters';

    if (!form.mother_tongue) e.mother_tongue = 'Please select your mother tongue';
    else if (form.mother_tongue === 'Other' && !form.mother_tongue_other.trim()) e.mother_tongue_other = 'Please specify your mother tongue';
    else if (form.mother_tongue_other.trim().length > 50) e.mother_tongue_other = 'Must be less than 50 characters';

    if (!form.marital_status) e.marital_status = 'Please select marital status';
    else if (form.marital_status === 'other' && !form.marital_status_other.trim()) e.marital_status_other = 'Please specify your marital status';
    else if (form.marital_status_other.trim().length > 50) e.marital_status_other = 'Must be less than 50 characters';

    if (form.caste === 'Other' && !form.caste_other.trim()) e.caste_other = 'Please specify your caste';
    else if (form.caste_other.trim().length > 100) e.caste_other = 'Must be less than 100 characters';

    if (form.height && (isNaN(form.height) || form.height < 100 || form.height > 250))
      e.height = 'Enter valid height between 100–250 cm';
    if (form.weight && (isNaN(form.weight) || form.weight < 30 || form.weight > 200))
      e.weight = 'Enter valid weight between 30–200 kg';
    if (form.present_address && form.present_address.trim().length > 300)
      e.present_address = 'Address must be less than 300 characters';
  }

  if (step === 2) {
    if (!form.state) e.state = 'Please select your state';
    if (!form.city) e.city = form.state ? 'Please select your city' : 'Please select state first';
    if (!form.education) e.education = 'Please select your education';
    else if (form.education === 'other' && !form.education_other.trim()) e.education_other = 'Please specify your education';
    else if (form.education_other.trim().length > 50) e.education_other = 'Must be less than 50 characters';
    if (form.degree && form.degree.trim().length > 100) e.degree = 'Degree must be less than 100 characters';
    if (!form.occupation.trim()) e.occupation = 'Occupation is required';
    else if (form.occupation.trim().length > 100) e.occupation = 'Occupation must be less than 100 characters';
    if (form.annual_income && form.annual_income.trim().length > 50)
      e.annual_income = 'Annual income must be less than 50 characters';
  }

  if (step === 3) {
    if (form.father_name && form.father_name.trim().length > 150) e.father_name = 'Must be less than 150 characters';
    if (form.father_occupation && form.father_occupation.trim().length > 100) e.father_occupation = 'Must be less than 100 characters';
    if (form.mother_name && form.mother_name.trim().length > 150) e.mother_name = 'Must be less than 150 characters';
    if (form.mother_occupation && form.mother_occupation.trim().length > 100) e.mother_occupation = 'Must be less than 100 characters';
    if (form.number_of_brothers && (isNaN(form.number_of_brothers) || form.number_of_brothers < 0 || form.number_of_brothers > 20))
      e.number_of_brothers = 'Enter a valid number (0–20)';
    if (form.number_of_sisters && (isNaN(form.number_of_sisters) || form.number_of_sisters < 0 || form.number_of_sisters > 20))
      e.number_of_sisters = 'Enter a valid number (0–20)';
    if (form.sibling_details && form.sibling_details.trim().length > 500)
      e.sibling_details = 'Must be less than 500 characters';
  }

  if (step === 4) {
    if (form.birth_place && form.birth_place.trim().length > 100) e.birth_place = 'Birth place must be less than 100 characters';
    const anyTimeField = form.birth_time_hour || form.birth_time_minute || form.birth_time_period;
    const allTimeFields = form.birth_time_hour && form.birth_time_minute && form.birth_time_period;
    if (anyTimeField && !allTimeFields) e.birth_time = 'Please complete hour, minute and AM/PM for birth time';
  }

  if (step === 5) {
    if (form.about_me && form.about_me.trim().length > 1000) e.about_me = 'About Me must be less than 1000 characters';
  }

  return e;
}
