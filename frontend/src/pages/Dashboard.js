import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [stats, setStats] = useState({ total_views: 0 });

  useEffect(() => {
    api.get('/profiles/me/').then(({ data }) => setProfile(data));
    api.get('/profiles/viewed/').then(({ data }) => {
      setViewedProfiles(data.slice(0, 6));
      setStats({ total_views: data.length });
    });
  }, []);

  const completionFields = ['date_of_birth', 'gender', 'religion', 'education', 'occupation', 'city', 'photo'];
  const completed = profile ? completionFields.filter((f) => profile[f]).length : 0;
  const completion = Math.round((completed / completionFields.length) * 100);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="user-avatar-large">
            {profile?.photo_url
              ? <img src={profile.photo_url} alt="Profile" />
              : <span>{user?.full_name?.charAt(0)?.toUpperCase()}</span>}
          </div>
          <div className="welcome-text">
            <h2>Welcome, {user?.full_name}!</h2>
            <p>{user?.email} · <span className={`role-badge role-${user?.role}`}>{user?.role}</span></p>
            <p style={{fontSize:'13px',color:'#c0392b',fontWeight:'700',marginTop:'4px'}}>ID: {user?.user_id}</p>
          </div>
        </div>
        <Link to="/profile/edit" className="btn-primary">Edit Profile</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.total_views}</h3>
            <p>Profiles Viewed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{completion}%</h3>
            <p>Profile Complete</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💍</div>
          <div className="stat-info">
            <h3>{profile?.expectation ? 'Set' : 'Not Set'}</h3>
            <p>Expectations</p>
          </div>
        </div>
      </div>

      {completion < 100 && (
        <div className="completion-banner">
          <div className="completion-bar-wrap">
            <div className="completion-bar" style={{ width: `${completion}%` }}></div>
          </div>
          <p>Your profile is {completion}% complete. <Link to="/profile/edit">Complete it now</Link> to get better matches!</p>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Details</h3>
          {profile ? (
            <div className="detail-list">
              <div className="detail-row"><span>Name</span><span>{user?.full_name}</span></div>
              <div className="detail-row"><span>Email</span><span>{user?.email}</span></div>
              <div className="detail-row"><span>Gender</span><span>{profile.gender || '—'}</span></div>
              <div className="detail-row"><span>Age</span><span>{profile.age ? `${profile.age} yrs` : '—'}</span></div>
              <div className="detail-row"><span>Religion</span><span>{profile.religion || '—'}</span></div>
              <div className="detail-row"><span>Education</span><span>{profile.education || '—'}</span></div>
              <div className="detail-row"><span>Occupation</span><span>{profile.occupation || '—'}</span></div>
              <div className="detail-row"><span>City</span><span>{profile.city || '—'}</span></div>
            </div>
          ) : <p className="loading-text">Loading...</p>}
        </div>

        <div className="dashboard-card">
          <h3>Partner Expectations</h3>
          {profile?.expectation ? (
            <div className="detail-list">
              <div className="detail-row"><span>Age Range</span><span>{profile.expectation.min_age}–{profile.expectation.max_age} yrs</span></div>
              <div className="detail-row"><span>Religion</span><span>{profile.expectation.religion || '—'}</span></div>
              <div className="detail-row"><span>Education</span><span>{profile.expectation.education || '—'}</span></div>
              <div className="detail-row"><span>Location</span><span>{profile.expectation.location || '—'}</span></div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No expectations set yet</p>
              <Link to="/expectations" className="btn-secondary">Set Expectations</Link>
            </div>
          )}
        </div>
      </div>

      {viewedProfiles.length > 0 && (
        <div className="viewed-section">
          <div className="section-header">
            <h3>Recently Viewed Profiles</h3>
            <Link to="/profiles">Browse All</Link>
          </div>
          <div className="profiles-grid">
            {viewedProfiles.map(({ viewed_profile, viewed_at }) => (
              <Link to={`/profiles/${viewed_profile.id}`} key={viewed_profile.id} className="profile-card-small">
                <div className="profile-avatar">
                  {viewed_profile.photo_url
                    ? <img src={viewed_profile.photo_url} alt="" />
                    : <span>{viewed_profile.user?.full_name?.charAt(0)}</span>}
                </div>
                <div className="profile-info">
                  <h4>{viewed_profile.user?.full_name}</h4>
                  <p>{viewed_profile.age ? `${viewed_profile.age} yrs` : ''} {viewed_profile.city ? `· ${viewed_profile.city}` : ''}</p>
                  <small>Viewed {new Date(viewed_at).toLocaleDateString()}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
