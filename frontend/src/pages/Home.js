import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Life Partner</h1>
          <p>UTM Matrimony connects hearts across communities. Start your journey to a beautiful life together.</p>
          <div className="hero-actions">
            {user ? (
              <Link to="/profiles" className="btn-primary btn-lg">Browse Profiles</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login" className="btn-outline btn-lg">Sign In</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">💑</div>
      </section>

      <section className="features">
        <h2>Why Choose UTM Matrimony?</h2>
        <div className="features-grid">
          {[
            { icon: '🔒', title: 'Verified Profiles', desc: 'All profiles are reviewed for authenticity and safety.' },
            { icon: '💡', title: 'Smart Matching', desc: 'Set your expectations and find compatible partners.' },
            { icon: '📸', title: 'Rich Profiles', desc: 'Detailed profiles with photos, background, and career info.' },
            { icon: '🌍', title: 'All Communities', desc: 'Profiles from all religions, castes, and regions.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Find Your Life Partner?</h2>
        <p>Join thousands of happy couples who found their match on UTM Matrimony</p>
        {!user && <Link to="/register" className="btn-primary btn-lg">Create Free Profile</Link>}
      </section>
    </div>
  );
}
