import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const INITIAL = {
  min_age: '', max_age: '', min_height: '', max_height: '',
  religion: '', caste: '', education: '', occupation: '',
  marital_status: '', location: '', description: '',
};

export default function Expectations() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profiles/expectations/').then(({ data }) => {
      const filled = {};
      Object.keys(INITIAL).forEach((k) => { filled[k] = data[k] || ''; });
      setForm(filled);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profiles/expectations/', form);
      toast.success('Expectations saved!');
    } catch {
      toast.error('Failed to save expectations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="page-header">
        <h2>Partner Expectations</h2>
        <p>Tell us what you're looking for in a life partner</p>
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Age & Physical</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Min Age</label>
              <input type="number" name="min_age" placeholder="e.g. 22" value={form.min_age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max Age</label>
              <input type="number" name="max_age" placeholder="e.g. 30" value={form.max_age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Min Height (cm)</label>
              <input type="number" name="min_height" placeholder="e.g. 155" value={form.min_height} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max Height (cm)</label>
              <input type="number" name="max_height" placeholder="e.g. 180" value={form.max_height} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Background</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Religion</label>
              <input name="religion" placeholder="e.g. Hindu, Muslim, Any" value={form.religion} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Caste</label>
              <input name="caste" placeholder="e.g. Any" value={form.caste} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Marital Status</label>
              <input name="marital_status" placeholder="e.g. Never Married" value={form.marital_status} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Career & Location</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Education</label>
              <input name="education" placeholder="e.g. Bachelor's or above" value={form.education} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input name="occupation" placeholder="e.g. Any professional" value={form.occupation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Preferred Location</label>
              <input name="location" placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Notes</h3>
          <div className="form-group">
            <textarea name="description" rows={4} placeholder="Any other preferences..." value={form.description} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Expectations'}
          </button>
        </div>
      </form>
    </div>
  );
}
