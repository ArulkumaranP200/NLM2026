import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import toast from 'react-hot-toast';
import '../styles/register.css';
import { INDIA_STATES, INDIA_STATES_CITIES } from '../data/indiaCities';

const INITIAL = {
  // Account
  full_name: '', email: '', password: '', confirm_password: '',
  // Personal
  phone: '', date_of_birth: '', gender: '', religion: '',
  mother_tongue: '', marital_status: '', caste: '',
  height: '', weight: '', present_address: '',
  // Location & Career
  city: '', state: '', country: 'India',
  education: '', occupation: '', annual_income: '',
  // Horoscope
  zodiac_sign: '', nakshatra: '', birth_place: '', birth_time: '',
  // About
  about_me: '',
};

const STEPS = ['Account', 'Personal', 'Location & Career', 'Horoscope', 'Photo & About'];

const ZODIAC_SIGNS = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)',
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

function Field({ name, label, type = 'text', placeholder, required, form, errors, onChange, children }) {
  return (
    <div className="form-group">
      <label>{label} {required && <span className="required">*</span>}</label>
      {children || (
        <input
          type={type} name={name} placeholder={placeholder}
          value={form[name]} onChange={onChange}
          className={errors[name] ? 'input-error' : ''}
          autoComplete="off"
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
  const fileRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload a valid image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const { data } = await api.post('/auth/google/', { credential: tokenResponse.credential });
      login(data);
      toast.success(`Welcome! Your ID is ${data.user.user_id}. Please complete your profile.`);
      navigate('/profile/edit');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google sign up failed');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google sign up failed'),
    flow: 'implicit',
  });

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.full_name.trim()) e.full_name = 'Full name is required';
      else if (form.full_name.trim().length < 3) e.full_name = 'Name must be at least 3 characters';
      if (!form.email) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[A-Z])/.test(form.password)) e.password = 'Must contain at least one uppercase letter';
      else if (!/(?=.*[0-9])/.test(form.password)) e.password = 'Must contain at least one number';
      if (!form.confirm_password) e.confirm_password = 'Please confirm your password';
      else if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    }
    if (step === 1) {
      if (!form.phone) e.phone = 'Phone number is required';
      else if (!/^\+?[0-9]{10,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number (10-15 digits)';
      if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
      else {
        const dob = new Date(form.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18) e.date_of_birth = 'You must be at least 18 years old';
        if (age > 80) e.date_of_birth = 'Please enter a valid date of birth';
      }
      if (!form.gender) e.gender = 'Please select your gender';
      if (!form.religion) e.religion = 'Please select your religion';
      if (!form.mother_tongue.trim()) e.mother_tongue = 'Mother tongue is required';
      if (!form.marital_status) e.marital_status = 'Please select marital status';
      if (form.height && (isNaN(form.height) || form.height < 100 || form.height > 250))
        e.height = 'Enter valid height between 100–250 cm';
      if (form.weight && (isNaN(form.weight) || form.weight < 30 || form.weight > 200))
        e.weight = 'Enter valid weight between 30–200 kg';
    }
    if (step === 2) {
      if (!form.state) e.state = 'Please select your state';
      if (!form.city) e.city = form.state ? 'Please select your city' : 'Please select state first';
      if (!form.education) e.education = 'Please select your education';
      if (!form.occupation.trim()) e.occupation = 'Occupation is required';
    }
    // step 3 horoscope - all optional, no required validation
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
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
          <h1>💑 New Life Matrimony</h1>
          <p>Create your profile and find your life partner</p>
        </div>

        {step === 0 && (
          <>
            <button type="button" className="btn-google" onClick={() => googleLogin()}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
              Sign up with Google
            </button>
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

        <form onSubmit={handleSubmit}>

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
                <Field name="phone" label="Phone Number" placeholder="e.g. 9876543210" required {...fieldProps} />
                <Field name="date_of_birth" label="Date of Birth" type="date" required {...fieldProps} />
                <div className="form-group">
                  <label>Gender <span className="required">*</span></label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={errors.gender ? 'input-error' : ''}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="field-error">{errors.gender}</span>}
                </div>
                <div className="form-group">
                  <label>Religion <span className="required">*</span></label>
                  <select name="religion" value={form.religion} onChange={handleChange} className={errors.religion ? 'input-error' : ''}>
                    <option value="">Select Religion</option>
                    {['hindu','muslim','christian','sikh','jain','buddhist','other'].map(r => (
                      <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                  {errors.religion && <span className="field-error">{errors.religion}</span>}
                </div>
                <Field name="mother_tongue" label="Mother Tongue" placeholder="e.g. Tamil, Hindi" required {...fieldProps} />
                <div className="form-group">
                  <label>Marital Status <span className="required">*</span></label>
                  <select name="marital_status" value={form.marital_status} onChange={handleChange} className={errors.marital_status ? 'input-error' : ''}>
                    <option value="">Select Status</option>
                    <option value="never_married">Never Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                  {errors.marital_status && <span className="field-error">{errors.marital_status}</span>}
                </div>
                <Field name="caste" label="Caste" placeholder="Enter caste (optional)" {...fieldProps} />
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
                  {errors.education && <span className="field-error">{errors.education}</span>}
                </div>
                <Field name="occupation" label="Occupation" placeholder="e.g. Software Engineer" required {...fieldProps} />
                <Field name="annual_income" label="Annual Income" placeholder="e.g. 5-10 LPA (optional)" {...fieldProps} />
              </div>
            </div>
          )}

          {/* STEP 3 — Horoscope */}
          {step === 3 && (
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
                  <label>Zodiac Sign (Rashi)</label>
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
                <Field name="birth_time" label="Birth Time" type="time" placeholder="HH:MM" {...fieldProps} />
              </div>
              <div className="horoscope-info-box">
                <p>🌟 Horoscope details help in finding astrologically compatible matches based on your Rashi and Nakshatra.</p>
              </div>
            </div>
          )}

          {/* STEP 4 — Photo & About */}
          {step === 4 && (
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
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
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
                />
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
