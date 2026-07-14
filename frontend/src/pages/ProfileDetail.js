import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profiles/${id}/`)
      .then(({ data }) => setProfile(data))
      .catch(() => navigate('/profiles'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!profile) return null;

  const { user, expectation } = profile;

  return (
    <div className="profile-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="profile-detail-card">
        <div className="profile-detail-header">
          <div className="profile-detail-photo">
            {profile.photo_url
              ? <img src={profile.photo_url} alt={user?.full_name} />
              : <div className="avatar-placeholder-lg">{user?.full_name?.charAt(0)}</div>}
          </div>
          <div className="profile-detail-intro">
            <h2>{user?.full_name}</h2>
            <div className="profile-tags">
              {profile.age && <span className="tag">{profile.age} yrs</span>}
              {profile.gender && <span className="tag">{profile.gender}</span>}
              {profile.religion && <span className="tag">{profile.religion}</span>}
              {profile.marital_status && <span className="tag">{profile.marital_status.replace('_', ' ')}</span>}
            </div>
            <p className="profile-location">📍 {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</p>
          </div>
        </div>

        {profile.about_me && (
          <div className="detail-section">
            <h3>About</h3>
            <p>{profile.about_me}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Personal Details</h3>
          <div className="detail-grid">
            {[
              ['Date of Birth', profile.date_of_birth],
              ['Height', profile.height ? `${profile.height} cm` : null],
              ['Weight', profile.weight ? `${profile.weight} kg` : null],
              ['Mother Tongue', profile.mother_tongue],
              ['Caste', profile.caste],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="detail-item">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>Education & Career</h3>
          <div className="detail-grid">
            {[
              ['Education', profile.education],
              ['Occupation', profile.occupation],
              ['Annual Income', profile.annual_income],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="detail-item">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {expectation && (
          <div className="detail-section expectation-section">
            <h3>Partner Expectations</h3>
            <div className="detail-grid">
              {[
                ['Age Range', expectation.min_age && expectation.max_age ? `${expectation.min_age}–${expectation.max_age} yrs` : null],
                ['Religion', expectation.religion],
                ['Education', expectation.education],
                ['Occupation', expectation.occupation],
                ['Location', expectation.location],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="detail-item">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
            {expectation.description && <p className="expectation-desc">{expectation.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
