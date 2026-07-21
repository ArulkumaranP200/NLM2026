import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const RELIGIONS = ['hindu', 'muslim', 'christian', 'sikh', 'jain', 'buddhist', 'other'];

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({ religion: '', caste: '', city: '' });
  const [casteOptions, setCasteOptions] = useState([]);
  const [useExpectations, setUseExpectations] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCastes = async (religion) => {
    try {
      const { data } = await api.get('/profiles/castes/', { params: religion ? { religion } : {} });
      setCasteOptions(data);
    } catch {
      setCasteOptions([]);
    }
  };

  const fetchProfiles = async (opts = {}) => {
    const expectationsOn = opts.useExpectations ?? useExpectations;
    setLoading(true);
    const params = new URLSearchParams();
    if (expectationsOn) {
      params.append('my_expectations', 'true');
    } else {
      if (filters.religion) params.append('religion', filters.religion);
      if (filters.caste) params.append('caste', filters.caste);
      if (filters.city) params.append('city', filters.city);
    }
    const { data } = await api.get(`/profiles/?${params}`);
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
    fetchCastes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleReligionFilter = (e) => {
    const religion = e.target.value;
    setFilters((f) => ({ ...f, religion, caste: '' }));
    fetchCastes(religion);
  };

  const handleToggleExpectations = (e) => {
    const checked = e.target.checked;
    setUseExpectations(checked);
    fetchProfiles({ useExpectations: checked });
  };

  return (
    <div className="profiles-page">
      <div className="page-header">
        <h2>Browse Profiles</h2>
        <p>Find your perfect life partner</p>
      </div>

      <div className="filter-bar">
        <label className="toggle-switch">
          <input type="checkbox" checked={useExpectations} onChange={handleToggleExpectations} />
          <span className="toggle-slider"></span>
          <span className="toggle-label">My Expectations</span>
        </label>
        <select name="religion" value={filters.religion} onChange={handleReligionFilter} disabled={useExpectations}>
          <option value="">Any Religion</option>
          {RELIGIONS.map(r => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
        <select name="caste" value={filters.caste} onChange={handleFilter} disabled={useExpectations}>
          <option value="">Any Caste</option>
          {casteOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          name="city" placeholder="Search by city..." value={filters.city}
          onChange={handleFilter} disabled={useExpectations}
        />
        <button className="btn-primary" onClick={() => fetchProfiles()} disabled={useExpectations}>Search</button>
      </div>
      {useExpectations && (
        <p className="expectations-hint">
          Showing profiles matching your <Link to="/expectations">saved partner expectations</Link>.
        </p>
      )}

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : profiles.length === 0 ? (
        <div className="empty-state-page">
          <p>No profiles found matching your criteria.</p>
        </div>
      ) : (
        <div className="profiles-grid-main">
          {profiles.map((profile) => (
            <Link to={`/profiles/${profile.id}`} key={profile.id} className="profile-card">
              <div className="profile-card-photo">
                {profile.photo_url
                  ? <img src={profile.photo_url} alt={profile.user?.full_name} />
                  : <div className="avatar-placeholder">{profile.user?.full_name?.charAt(0)}</div>}
              </div>
              <div className="profile-card-body">
                <h3>{profile.user?.full_name}</h3>
                <div className="profile-tags">
                  {profile.age && <span className="tag">{profile.age} yrs</span>}
                  {profile.religion && <span className="tag">{profile.religion}</span>}
                  {profile.education && <span className="tag">{profile.education}</span>}
                </div>
                <p className="profile-location">📍 {profile.city || 'Location not set'}{profile.state ? `, ${profile.state}` : ''}</p>
                {profile.occupation && <p className="profile-occupation">💼 {profile.occupation}</p>}
                {profile.about_me && <p className="profile-about">{profile.about_me.slice(0, 80)}...</p>}
              </div>
              <div className="profile-card-footer">
                <span className="view-profile-btn">View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
