import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login/', form);
      login(data);
      toast.success(`Welcome back, ${data.user.full_name}!`);
      if (data.user.role === 'developer') navigate('/developer');
      else if (data.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      const { data } = await api.post('/auth/google/', { credential: tokenResponse.credential });
      login(data);
      if (data.is_new_user) {
        toast.success(`Welcome! Your ID is ${data.user.user_id}. Please complete your profile.`);
        navigate('/profile/edit');
      } else {
        toast.success(`Welcome back, ${data.user.full_name}!`);
        if (data.user.role === 'developer') navigate('/developer');
        else if (data.user.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google login failed'),
    flow: 'implicit',
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>💑 New Life Matrimony</h1>
          <p>Welcome back! Sign in to continue</p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="btn-google"
          onClick={() => googleLogin()}
          disabled={googleLoading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
          {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </button>

        <div className="divider"><span>or sign in with email</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
