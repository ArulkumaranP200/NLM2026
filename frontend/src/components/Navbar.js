import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">💑 UTM Matrimony</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link className={isActive('/dashboard')} to="/dashboard">Dashboard</Link>
            <Link className={isActive('/profiles')} to="/profiles">Browse</Link>
            {user.role === 'user' && (
              <>
                <Link className={isActive('/profile/edit')} to="/profile/edit">My Profile</Link>
                <Link className={isActive('/expectations')} to="/expectations">Expectations</Link>
              </>
            )}
            {(user.role === 'admin' || user.role === 'developer') && (
              <Link className={isActive('/admin')} to="/admin">Admin</Link>
            )}
            {user.role === 'developer' && (
              <Link className={isActive('/developer')} to="/developer">Dev Panel</Link>
            )}
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className={isActive('/login')} to="/login">Login</Link>
            <Link className="btn-register" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
