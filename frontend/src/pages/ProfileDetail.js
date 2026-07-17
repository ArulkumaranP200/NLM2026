import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.get(`/profiles/${id}/`)
      .then(({ data }) => setProfile(data))
      .catch(() => navigate('/profiles'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleUnlock = async () => {
    setPaying(true);
    try {
      const { data } = await api.post(`/profiles/${id}/unlock/`);
      setProfile(data);
      toast.success('Payment successful! Contact details unlocked.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!profile) return null;

  const { user, expectation, is_unlocked } = profile;
  const hasFamilyInfo = profile.father_name || profile.father_occupation ||
    profile.mother_name || profile.mother_occupation ||
    profile.number_of_brothers || profile.number_of_sisters;

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

        {hasFamilyInfo && (
          <div className="detail-section">
            <h3>Family Details</h3>
            <div className="detail-grid">
              {[
                ["Father's Name", profile.father_name],
                ["Father's Occupation", profile.father_occupation],
                ["Mother's Name", profile.mother_name],
                ["Mother's Occupation", profile.mother_occupation],
                ['Brothers', profile.number_of_brothers],
                ['Sisters', profile.number_of_sisters],
              ].filter(([, v]) => v || v === 0).map(([label, value]) => (
                <div key={label} className="detail-item">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detail-section">
          <h3>Contact & More</h3>
          {is_unlocked ? (
            <div className="detail-grid">
              {[
                ['Phone', profile.phone],
                ['Present Address', profile.present_address],
                ['Sibling Details', profile.sibling_details],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="detail-item">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="unlock-card">
              <span className="unlock-icon">🔒</span>
              <p>Phone number, address and sibling details are hidden.</p>
              <p className="unlock-price">Pay ₹99 to unlock this profile's remaining details</p>
              <button className="btn-primary" onClick={handleUnlock} disabled={paying}>
                {paying ? 'Processing payment...' : '🔓 Pay ₹99 & Unlock'}
              </button>
            </div>
          )}
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
