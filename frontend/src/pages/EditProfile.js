import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const INITIAL = {
  date_of_birth: '', gender: '', religion: '', caste: '', mother_tongue: '',
  marital_status: '', height: '', weight: '', education: '', occupation: '',
  annual_income: '', city: '', state: '', country: 'India', about_me: '', phone: '',
  father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
  number_of_brothers: '', number_of_sisters: '', sibling_details: '',
};

export default function EditProfile() {
  const [form, setForm] = useState(INITIAL);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [casteOptions, setCasteOptions] = useState([]);
  const fileRef = useRef();

  const fetchCastes = async (religion) => {
    if (!religion) { setCasteOptions([]); return; }
    try {
      const { data } = await api.get('/profiles/castes/', { params: { religion } });
      setCasteOptions(data);
    } catch {
      setCasteOptions([]);
    }
  };

  useEffect(() => {
    api.get('/profiles/me/').then(({ data }) => {
      const filled = {};
      Object.keys(INITIAL).forEach((k) => { filled[k] = data[k] || ''; });
      setForm(filled);
      if (data.photo_url) setPhotoPreview(data.photo_url);
      if (data.religion) fetchCastes(data.religion);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleReligionChange = (e) => {
    const religion = e.target.value;
    setForm((f) => ({ ...f, religion, caste: '' }));
    fetchCastes(religion);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (photo) formData.append('photo', photo);
      await api.put('/profiles/me/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="page-header">
        <h2>Edit My Profile</h2>
        <p>Keep your profile updated to get better matches</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="photo-section">
          <div className="photo-preview-wrap" onClick={() => fileRef.current.click()}>
            {photoPreview
              ? <img src={photoPreview} alt="Profile" className="photo-preview" />
              : <div className="photo-placeholder"><span>📷</span><p>Click to upload photo</p></div>}
            <div className="photo-overlay">Change Photo</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
          <p className="photo-hint">Click on the image to change your profile photo</p>
        </div>

        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Religion</label>
              <select name="religion" value={form.religion} onChange={handleReligionChange}>
                <option value="">Select Religion</option>
                {['hindu','muslim','christian','sikh','jain','buddhist','other'].map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Caste</label>
              <select name="caste" value={form.caste} onChange={handleChange} disabled={!form.religion}>
                <option value="">{form.religion ? 'Select Caste' : 'Select religion first'}</option>
                {casteOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Mother Tongue</label>
              <input name="mother_tongue" placeholder="e.g. Tamil, Hindi" value={form.mother_tongue} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Marital Status</label>
              <select name="marital_status" value={form.marital_status} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" name="height" placeholder="e.g. 165" value={form.height} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weight" placeholder="e.g. 60" value={form.weight} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" placeholder="Enter phone number" value={form.phone} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Education & Career</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Education</label>
              <select name="education" value={form.education} onChange={handleChange}>
                <option value="">Select Education</option>
                <option value="high_school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input name="occupation" placeholder="e.g. Software Engineer" value={form.occupation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Annual Income</label>
              <input name="annual_income" placeholder="e.g. 5-10 LPA" value={form.annual_income} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Family Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Father's Name</label>
              <input name="father_name" placeholder="Enter father's name" value={form.father_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Father's Occupation</label>
              <input name="father_occupation" placeholder="e.g. Retired, Business" value={form.father_occupation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mother's Name</label>
              <input name="mother_name" placeholder="Enter mother's name" value={form.mother_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mother's Occupation</label>
              <input name="mother_occupation" placeholder="e.g. Homemaker, Teacher" value={form.mother_occupation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Number of Brothers</label>
              <input type="number" min="0" max="20" name="number_of_brothers" placeholder="e.g. 1" value={form.number_of_brothers} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Number of Sisters</label>
              <input type="number" min="0" max="20" name="number_of_sisters" placeholder="e.g. 1" value={form.number_of_sisters} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '4px' }}>
            <label>Sibling Details</label>
            <textarea name="sibling_details" rows={3} placeholder="e.g. Elder brother married, working as an engineer in Chennai" value={form.sibling_details} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h3>Location</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>City</label>
              <input name="city" placeholder="Enter city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input name="state" placeholder="Enter state" value={form.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input name="country" placeholder="Enter country" value={form.country} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>About Me</h3>
          <div className="form-group">
            <textarea name="about_me" rows={4} placeholder="Write something about yourself..." value={form.about_me} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
