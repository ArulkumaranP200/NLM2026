import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({ gender: '', religion: '', city: '' });
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.religion) params.append('religion', filters.religion);
    if (filters.city) params.append('city', filters.city);
    const { data } = await api.get(`/profiles/?${params}`);
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="profiles-page">
      <div className="page-header">
        <h2>Browse Profiles</h2>
        <p>Find your perfect life partner</p>
      </div>

      <div className="filter-bar">
        <select name="gender" value={filters.gender} onChange={handleFilter}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="religion" value={filters.religion} onChange={handleFilter}>
          <option value="">All Religions</option>
          {['hindu','muslim','christian','sikh','jain','buddhist','other'].map(r => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
        <input name="city" placeholder="Search by city..." value={filters.city} onChange={handleFilter} />
        <button className="btn-primary" onClick={fetchProfiles}>Search</button>
      </div>

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
