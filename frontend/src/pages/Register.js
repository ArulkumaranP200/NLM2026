import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import toast from 'react-hot-toast';
import '../styles/register.css';
import { INDIA_STATES, INDIA_STATES_CITIES } from '../data/indiaCities';

const INITIAL = {
  // Account
  full_name: '', email: '', password: '', confirm_password: '',
  // Personal
  phone: '', date_of_birth: '', gender: '', gender_other: '',
  religion: '', religion_other: '',
  mother_tongue: '', mother_tongue_other: '',
  marital_status: '', marital_status_other: '',
  caste: '', caste_other: '',
  height: '', weight: '', present_address: '',
  // Location & Career
  city: '', state: '', country: 'India',
  education: '', education_other: '', degree: '', occupation: '', annual_income: '',
  // Family
  father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
  number_of_brothers: '', number_of_sisters: '', sibling_details: '',
  // Horoscope
  zodiac_sign: '', nakshatra: '', birth_place: '',
  birth_time_hour: '', birth_time_minute: '', birth_time_period: '',
  // About
  about_me: '',
};

const STEPS = ['Account', 'Personal', 'Location & Career', 'Family', 'Horoscope', 'Photo & About'];

const INDIAN_LANGUAGES = [
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi', 'Marathi', 'Gujarati', 'Punjabi',
  'Bengali', 'Odia', 'Assamese', 'Urdu', 'Sanskrit', 'Konkani', 'Kashmiri', 'Sindhi',
  'Manipuri', 'Bodo', 'Dogri', 'Maithili', 'Nepali', 'Santali', 'Tulu', 'English', 'Other',
];

const ZODIAC_SIGNS = [
  'Mesham (Aries)', 'Rishabam (Taurus)', 'Mithunam (Gemini)', 'Kadagam (Cancer)',
  'Simmam (Leo)', 'Kanni (Virgo)', 'Thulam (Libra)', 'Viruchigam (Scorpio)',
  'Dhanusu (Sagittarius)', 'Magaram (Capricorn)', 'Kumbam (Aquarius)', 'Meenam (Pisces)',
];

const NAKSHATRAS = [
  'Aswini', 'Bharani', 'Karthigai', 'Rohini', 'Mirugasirisham', 'Thiruvathirai',
  'Punarpoosam', 'Poosam', 'Ayilyam', 'Magam', 'Pooram', 'Uthiram',
  'Hastam', 'Chithirai', 'Swathi', 'Visakam', 'Anusham', 'Kettai',
  'Moolam', 'Pooradam', 'Uthiradam', 'Thiruvonam', 'Avittam',
  'Sadayam', 'Poorattathi', 'Uthirattathi', 'Revathi',
];

function Field({ name, label, type = 'text', placeholder, required, form, errors, onChange, children, ...rest }) {
  return (
    <div className="form-group">
      <label>{label} {required && <span className="required">*</span>}</label>
      {children || (
        <input
          type={type} name={name} placeholder={placeholder}
          value={form[name]} onChange={onChange}
          className={errors[name] ? 'input-error' : ''}
          autoComplete="off"
          {...rest}
        />
      )}
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [casteOptions, setCasteOptions] = useState([]);
  const fileRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const fetchCastes = async (religion) => {
    if (!religion) { setCasteOptions([]); return; }
    try {
      const { data } = await api.get('/profiles/castes/', { params: { religion } });
      setCasteOptions(data);
    } catch {
      setCasteOptions([]);
    }
  };

  const handleReligionChange = (e) => {
    const religion = e.target.value;
    setForm(f => ({ ...f, religion, caste: '', caste_other: '' }));
    setErrors(er => ({ ...er, religion: '', caste: '', caste_other: '' }));
    fetchCastes(religion);
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, phone: digits }));
    setErrors(er => ({ ...er, phone: '' }));
  };

  const handlePhoto = (e) => {
    // Blur the hidden file input immediately: on some browsers, focus drifts to the
    // next focusable element (the "Create Account" submit button) once the native
    // file dialog closes, and a stray Enter/Space there submitted the form early.
    fileRef.current.blur();
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload a valid image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/auth/google/', { credential: credentialResponse.credential });
      login(data);
      toast.success(`Welcome! Your ID is ${data.user.user_id}. Please complete your profile.`);
      navigate('/profile/edit');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google sign up failed');
    }
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.full_name.trim()) e.full_name = 'Full name is required';
      else if (form.full_name.trim().length < 3) e.full_name = 'Name must be at least 3 characters';
      else if (form.full_name.trim().length > 150) e.full_name = 'Name must be less than 150 characters';
      else if (!/^[A-Za-z\s.'-]+$/.test(form.full_name.trim())) e.full_name = 'Name can only contain letters, spaces, and . \' -';
      if (!form.email) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
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
      else if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number';
      if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
      else {
        const dob = new Date(form.date_of_birth);
        if (isNaN(dob.getTime())) {
          e.date_of_birth = 'Enter a valid date of birth';
        } else {
          const today = new Date();
          if (dob > today) {
            e.date_of_birth = 'Date of birth cannot be in the future';
          } else {
            let age = today.getFullYear() - dob.getFullYear();
            const birthdayPassedThisYear =
              today.getMonth() > dob.getMonth() ||
              (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
            if (!birthdayPassedThisYear) age -= 1;
            if (age < 18) e.date_of_birth = 'You must be at least 18 years old';
            else if (age > 80) e.date_of_birth = 'Please enter a valid date of birth';
          }
        }
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
      if (form.father_name && form.father_name.trim().length > 150)
        e.father_name = 'Must be less than 150 characters';
      if (form.father_occupation && form.father_occupation.trim().length > 100)
        e.father_occupation = 'Must be less than 100 characters';
      if (form.mother_name && form.mother_name.trim().length > 150)
        e.mother_name = 'Must be less than 150 characters';
      if (form.mother_occupation && form.mother_occupation.trim().length > 100)
        e.mother_occupation = 'Must be less than 100 characters';
      if (form.number_of_brothers && (isNaN(form.number_of_brothers) || form.number_of_brothers < 0 || form.number_of_brothers > 20))
        e.number_of_brothers = 'Enter a valid number (0–20)';
      if (form.number_of_sisters && (isNaN(form.number_of_sisters) || form.number_of_sisters < 0 || form.number_of_sisters > 20))
        e.number_of_sisters = 'Enter a valid number (0–20)';
      if (form.sibling_details && form.sibling_details.trim().length > 500)
        e.sibling_details = 'Must be less than 500 characters';
    }
    if (step === 4) {
      if (form.birth_place && form.birth_place.trim().length > 100)
        e.birth_place = 'Birth place must be less than 100 characters';
      const anyTimeField = form.birth_time_hour || form.birth_time_minute || form.birth_time_period;
      const allTimeFields = form.birth_time_hour && form.birth_time_minute && form.birth_time_period;
      if (anyTimeField && !allTimeFields)
        e.birth_time = 'Please complete hour, minute and AM/PM for birth time';
    }
    if (step === 5) {
      if (form.about_me && form.about_me.trim().length > 1000)
        e.about_me = 'About Me must be less than 1000 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const buildSubmitData = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== STEPS.length - 1) return;
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = buildSubmitData();
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (photo) formData.append('photo', photo);
      const { data } = await api.post('/auth/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login(data);
      toast.success(`Welcome! Your ID is ${data.user.user_id}`);
      navigate('/dashboard');
    } catch (err) {
      const errs = err.response?.data;
      if (errs) {
        setErrors(errs);
        Object.values(errs).flat().forEach(msg => toast.error(msg));
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>💑 UTM Matrimony</h1>
          <p>Create your profile and find your life partner</p>
        </div>

        {step === 0 && (
          <>
            <div className="google-btn-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign up failed')}
                text="signup_with"
                width="100%"
              />
            </div>
            <div className="divider"><span>or register with email</span></div>
          </>
        )}

        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && step !== STEPS.length - 1) {
              e.preventDefault();
            }
          }}
        >

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div className="step-content">
              <h3>Account Details</h3>
              <div className="form-grid-2">
                <Field name="full_name" label="Full Name" placeholder="Enter your full name" required {...fieldProps} />
                <Field name="email" label="Email Address" type="email" placeholder="Enter your email" required {...fieldProps} />
                <Field name="password" label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" required {...fieldProps} />
                <Field name="confirm_password" label="Confirm Password" type="password" placeholder="Re-enter your password" required {...fieldProps} />
              </div>
            </div>
          )}

          {/* STEP 1 — Personal */}
          {step === 1 && (
            <div className="step-content">
              <h3>Personal Details</h3>
              <div className="form-grid-2">
                <Field
                  name="phone" label="Phone Number" placeholder="10-digit mobile number" required
                  form={form} errors={errors} onChange={handlePhoneChange}
                  maxLength={10} inputMode="numeric"
                />
                <Field name="date_of_birth" label="Date of Birth" type="date" required {...fieldProps} />

                <div className="form-group">
                  <label>Gender <span className="required">*</span></label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={errors.gender ? 'input-error' : ''}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {form.gender === 'other' && (
                    <input
                      name="gender_other" className="input-other" placeholder="Please specify"
                      value={form.gender_other} onChange={handleChange}
                    />
                  )}
                  {errors.gender && <span className="field-error">{errors.gender}</span>}
                  {errors.gender_other && <span className="field-error">{errors.gender_other}</span>}
                </div>

                <div className="form-group">
                  <label>Religion <span className="required">*</span></label>
                  <select name="religion" value={form.religion} onChange={handleReligionChange} className={errors.religion ? 'input-error' : ''}>
                    <option value="">Select Religion</option>
                    {['hindu','muslim','christian','sikh','jain','buddhist','other'].map(r => (
                      <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                  {form.religion === 'other' && (
                    <input
                      name="religion_other" className="input-other" placeholder="Please specify"
                      value={form.religion_other} onChange={handleChange}
                    />
                  )}
                  {errors.religion && <span className="field-error">{errors.religion}</span>}
                  {errors.religion_other && <span className="field-error">{errors.religion_other}</span>}
                </div>

                <div className="form-group">
                  <label>Mother Tongue <span className="required">*</span></label>
                  <select name="mother_tongue" value={form.mother_tongue} onChange={handleChange} className={errors.mother_tongue ? 'input-error' : ''}>
                    <option value="">Select Mother Tongue</option>
                    {INDIAN_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {form.mother_tongue === 'Other' && (
                    <input
                      name="mother_tongue_other" className="input-other" placeholder="Please specify"
                      value={form.mother_tongue_other} onChange={handleChange}
                    />
                  )}
                  {errors.mother_tongue && <span className="field-error">{errors.mother_tongue}</span>}
                  {errors.mother_tongue_other && <span className="field-error">{errors.mother_tongue_other}</span>}
                </div>

                <div className="form-group">
                  <label>Marital Status <span className="required">*</span></label>
                  <select name="marital_status" value={form.marital_status} onChange={handleChange} className={errors.marital_status ? 'input-error' : ''}>
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="other">Other</option>
                  </select>
                  {form.marital_status === 'other' && (
                    <input
                      name="marital_status_other" className="input-other" placeholder="Please specify"
                      value={form.marital_status_other} onChange={handleChange}
                    />
                  )}
                  {errors.marital_status && <span className="field-error">{errors.marital_status}</span>}
                  {errors.marital_status_other && <span className="field-error">{errors.marital_status_other}</span>}
                </div>

                <div className="form-group">
                  <label>Caste <span className="optional">(optional)</span></label>
                  <select
                    name="caste" value={form.caste} onChange={handleChange}
                    className={errors.caste ? 'input-error' : ''}
                    disabled={!form.religion}
                  >
                    <option value="">{form.religion ? 'Select Caste' : 'Select religion first'}</option>
                    {casteOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {form.caste === 'Other' && (
                    <input
                      name="caste_other" className="input-other" placeholder="Please specify your caste"
                      value={form.caste_other} onChange={handleChange}
                    />
                  )}
                  {errors.caste && <span className="field-error">{errors.caste}</span>}
                  {errors.caste_other && <span className="field-error">{errors.caste_other}</span>}
                </div>

                <Field name="height" label="Height (cm)" type="number" placeholder="e.g. 165" {...fieldProps} />
                <Field name="weight" label="Weight (kg)" type="number" placeholder="e.g. 60" {...fieldProps} />
              </div>
              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Present Address</label>
                <textarea
                  name="present_address" rows={3}
                  placeholder="Enter your present address (Door No, Street, Area)"
                  value={form.present_address} onChange={handleChange}
                  className={errors.present_address ? 'input-error' : ''}
                />
                {errors.present_address && <span className="field-error">{errors.present_address}</span>}
              </div>
            </div>
          )}

          {/* STEP 2 — Location & Career */}
          {step === 2 && (
            <div className="step-content">
              <h3>Location & Career</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <select
                    name="state" value={form.state}
                    onChange={(e) => {
                      setForm(f => ({ ...f, state: e.target.value, city: '' }));
                      setErrors(er => ({ ...er, state: '', city: '' }));
                    }}
                    className={errors.state ? 'input-error' : ''}
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <select
                    name="city" value={form.city} onChange={handleChange}
                    className={errors.city ? 'input-error' : ''}
                    disabled={!form.state}
                  >
                    <option value="">{form.state ? 'Select City' : 'Select State first'}</option>
                    {form.state && INDIA_STATES_CITIES[form.state]?.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} readOnly style={{ background: '#f8f8f8', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label>Education <span className="required">*</span></label>
                  <select name="education" value={form.education} onChange={handleChange} className={errors.education ? 'input-error' : ''}>
                    <option value="">Select Education</option>
                    <option value="high_school">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's</option>
                    <option value="masters">Master's</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                  {form.education === 'other' && (
                    <input
                      name="education_other" className="input-other" placeholder="Please specify"
                      value={form.education_other} onChange={handleChange}
                    />
                  )}
                  {errors.education && <span className="field-error">{errors.education}</span>}
                  {errors.education_other && <span className="field-error">{errors.education_other}</span>}
                </div>
                <Field name="degree" label="Degree" placeholder="e.g. B.Tech CSE, MBBS, B.Com (optional)" {...fieldProps} />
                <Field name="occupation" label="Occupation" placeholder="e.g. Software Engineer" required {...fieldProps} />
                <Field name="annual_income" label="Annual Income" placeholder="e.g. 5-10 LPA (optional)" {...fieldProps} />
              </div>
            </div>
          )}

          {/* STEP 3 — Family */}
          {step === 3 && (
            <div className="step-content">
              <h3>Family Details</h3>
              <div className="form-grid-2">
                <Field name="father_name" label="Father's Name" placeholder="Enter father's name (optional)" {...fieldProps} />
                <Field name="father_occupation" label="Father's Occupation" placeholder="e.g. Retired, Business (optional)" {...fieldProps} />
                <Field name="mother_name" label="Mother's Name" placeholder="Enter mother's name (optional)" {...fieldProps} />
                <Field name="mother_occupation" label="Mother's Occupation" placeholder="e.g. Homemaker, Teacher (optional)" {...fieldProps} />
                <Field name="number_of_brothers" label="Number of Brothers" type="number" placeholder="e.g. 1" min="0" max="20" {...fieldProps} />
                <Field name="number_of_sisters" label="Number of Sisters" type="number" placeholder="e.g. 1" min="0" max="20" {...fieldProps} />
              </div>
              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Sibling Details <span className="optional">(optional)</span></label>
                <textarea
                  name="sibling_details" rows={3}
                  placeholder="e.g. Elder brother married, working as an engineer in Chennai"
                  value={form.sibling_details} onChange={handleChange}
                  className={errors.sibling_details ? 'input-error' : ''}
                />
                {errors.sibling_details && <span className="field-error">{errors.sibling_details}</span>}
              </div>
            </div>
          )}

          {/* STEP 4 — Horoscope */}
          {step === 4 && (
            <div className="step-content">
              <div className="horoscope-header">
                <span className="horoscope-icon">🔯</span>
                <div>
                  <h3>Horoscope Details</h3>
                  <p className="horoscope-note">All fields are optional. Fill in for better compatibility matching.</p>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Zodiac Sign (Rasi)</label>
                  <select name="zodiac_sign" value={form.zodiac_sign} onChange={handleChange}>
                    <option value="">Select Zodiac Sign</option>
                    {ZODIAC_SIGNS.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nakshatra (Birth Star)</label>
                  <select name="nakshatra" value={form.nakshatra} onChange={handleChange}>
                    <option value="">Select Nakshatra</option>
                    {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <Field name="birth_place" label="Birth Place" placeholder="e.g. Chennai, Tamil Nadu" {...fieldProps} />
                <div className="form-group">
                  <label>Birth Time</label>
                  <div className="birth-time-group">
                    <select name="birth_time_hour" value={form.birth_time_hour} onChange={handleChange} className={errors.birth_time ? 'input-error' : ''}>
                      <option value="">HH</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                      ))}
                    </select>
                    <select name="birth_time_minute" value={form.birth_time_minute} onChange={handleChange} className={errors.birth_time ? 'input-error' : ''}>
                      <option value="">MM</option>
                      {Array.from({ length: 60 }, (_, i) => i).map(m => (
                        <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                      ))}
                    </select>
                    <select name="birth_time_period" value={form.birth_time_period} onChange={handleChange} className={errors.birth_time ? 'input-error' : ''}>
                      <option value="">AM/PM</option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.birth_time && <span className="field-error">{errors.birth_time}</span>}
                </div>
              </div>
              <div className="horoscope-info-box">
                <p>🌟 Horoscope details help in finding astrologically compatible matches based on your Rasi and Nakshatra.</p>
              </div>
            </div>
          )}

          {/* STEP 5 — Photo & About */}
          {step === 5 && (
            <div className="step-content">
              <h3>Photo & About You</h3>
              <div className="photo-upload-section">
                <div className="photo-upload-wrap" onClick={() => fileRef.current.click()}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="photo-preview-img" />
                  ) : (
                    <div className="photo-upload-placeholder">
                      <span>📷</span>
                      <p>Click to upload your photo</p>
                      <small>JPG, PNG up to 5MB</small>
                    </div>
                  )}
                  <div className="photo-upload-overlay">{photoPreview ? 'Change Photo' : 'Upload Photo'}</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" tabIndex={-1} onChange={handlePhoto} hidden />
                {photoPreview && (
                  <button type="button" className="btn-remove-photo" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>
                    Remove Photo
                  </button>
                )}
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>About Me <span className="optional">(optional)</span></label>
                <textarea name="about_me" rows={4}
                  placeholder="Write a brief description about yourself, your interests, and what you're looking for..."
                  value={form.about_me} onChange={handleChange}
                  className={errors.about_me ? 'input-error' : ''}
                />
                {errors.about_me && <span className="field-error">{errors.about_me}</span>}
              </div>
            </div>
          )}

          <div className="step-actions">
            {step > 0 && <button type="button" className="btn-secondary" onClick={prevStep}>← Back</button>}
            {step < STEPS.length - 1
              ? <button type="button" className="btn-primary" onClick={nextStep}>Next →</button>
              : <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating Account...' : '🎉 Create Account'}</button>
            }
          </div>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}
