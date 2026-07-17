import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function DeveloperPanel() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userCreds, setUserCreds] = useState([]);
  const [staffCreds, setStaffCreds] = useState([]);
  const [tab, setTab] = useState('overview');
  const [newAdmin, setNewAdmin] = useState({ full_name: '', email: '', password: '', role: 'admin' });

  useEffect(() => {
    api.get('/auth/users/').then(({ data }) => setUsers(data));
    api.get('/profiles/admin/').then(({ data }) => setProfiles(data));
    api.get('/auth/transactions/').then(({ data }) => setTransactions(data));
    api.get('/auth/credentials/users/').then(({ data }) => setUserCreds(data));
    api.get('/auth/credentials/staff/').then(({ data }) => setStaffCreds(data));
  }, []);

  const createAdminUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newAdmin).forEach(([k, v]) => formData.append(k, v));
      formData.append('phone', '0000000000');
      formData.append('date_of_birth', '1990-01-01');
      formData.append('gender', 'male');
      formData.append('religion', 'other');
      formData.append('mother_tongue', 'English');
      formData.append('marital_status', 'single');
      formData.append('city', 'Admin City');
      formData.append('state', 'Admin State');
      formData.append('country', 'India');
      formData.append('education', 'bachelors');
      formData.append('occupation', newAdmin.role === 'developer' ? 'Developer' : 'Administrator');
      formData.append('confirm_password', newAdmin.password);
      const { data } = await api.post('/auth/register/', formData);
      await api.patch(`/auth/users/${data.user.id}/`, { role: newAdmin.role, is_staff: true });
      const { data: updated } = await api.get('/auth/users/');
      setUsers(updated);
      toast.success(`${newAdmin.role} account created! ID: ${data.user.user_id}`);
      setNewAdmin({ full_name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      const errors = err.response?.data;
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m));
      else toast.error('Failed to create user');
    }
  };

  const forceDeleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user and all their data?')) return;
    try {
      await api.delete(`/auth/users/${id}/`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User permanently deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const systemStats = {
    'Total Users': users.length,
    'Total Profiles': profiles.length,
    'Admins': users.filter(u => u.role === 'admin').length,
    'Developers': users.filter(u => u.role === 'developer').length,
    'Active Users': users.filter(u => u.is_active).length,
    'Total Transactions': transactions.length,
  };

  const TABS = ['overview', 'users', 'transactions', 'user-credentials', 'staff-credentials', 'create-account'];

  return (
    <div className="admin-page developer-page">
      <div className="page-header">
        <h2>⚙️ Developer Panel</h2>
        <p>Full system control and management</p>
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
            {t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div className="admin-stats">
            {Object.entries(systemStats).map(([key, val]) => (
              <div key={key} className="stat-card">
                <div className="stat-info"><h3>{val}</h3><p>{key}</p></div>
              </div>
            ))}
          </div>
          <div className="dashboard-card" style={{ marginTop: '2rem' }}>
            <h3>System Info</h3>
            <div className="detail-list">
              <div className="detail-row"><span>Backend</span><span>Django 5.2 + DRF</span></div>
              <div className="detail-row"><span>Frontend</span><span>React 18</span></div>
              <div className="detail-row"><span>Database</span><span>PostgreSQL 18</span></div>
              <div className="detail-row"><span>Auth</span><span>JWT (SimpleJWT)</span></div>
              <div className="detail-row"><span>User ID Format</span><span>NLM + 4 digits</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>NLM ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={user.role === 'developer' ? 'dev-row' : ''}>
                  <td><strong style={{color:'#c0392b'}}>{user.user_id}</strong></td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                  <td><span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td><button className="btn-sm btn-danger" onClick={() => forceDeleteUser(user.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User ID</th><th>Type</th><th>Status</th><th>IP Address</th><th>Description</th><th>Date</th></tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id}>
                  <td><strong style={{color:'#c0392b'}}>{txn.user?.user_id}</strong></td>
                  <td><span className="tag">{txn.transaction_type.replace(/_/g, ' ')}</span></td>
                  <td><span className={`status-badge ${txn.status === 'success' ? 'active' : 'inactive'}`}>{txn.status}</span></td>
                  <td>{txn.ip_address || '—'}</td>
                  <td style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{txn.description || '—'}</td>
                  <td>{new Date(txn.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Credentials */}
      {tab === 'user-credentials' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User ID</th><th>Name</th><th>Email</th><th>Login Count</th><th>Last IP</th><th>Email Verified</th><th>Created</th></tr>
            </thead>
            <tbody>
              {userCreds.map(c => (
                <tr key={c.id}>
                  <td><strong style={{color:'#c0392b'}}>{c.user?.user_id}</strong></td>
                  <td>{c.user?.full_name}</td>
                  <td>{c.user?.email}</td>
                  <td>{c.login_count}</td>
                  <td>{c.last_login_ip || '—'}</td>
                  <td><span className={`status-badge ${c.is_email_verified ? 'active' : 'inactive'}`}>{c.is_email_verified ? 'Yes' : 'No'}</span></td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Staff Credentials */}
      {tab === 'staff-credentials' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User ID</th><th>Name</th><th>Employee ID</th><th>Role</th><th>Department</th><th>Access Level</th><th>Login Count</th><th>Last IP</th></tr>
            </thead>
            <tbody>
              {staffCreds.map(c => (
                <tr key={c.id}>
                  <td><strong style={{color:'#1e8449'}}>{c.user?.user_id}</strong></td>
                  <td>{c.user?.full_name}</td>
                  <td><strong>{c.employee_id}</strong></td>
                  <td><span className={`role-badge role-${c.user?.role}`}>{c.user?.role}</span></td>
                  <td>{c.department}</td>
                  <td>{c.access_level}</td>
                  <td>{c.login_count}</td>
                  <td>{c.last_login_ip || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Account */}
      {tab === 'create-account' && (
        <div className="dashboard-card" style={{ maxWidth: '500px' }}>
          <h3>Create Admin / Developer Account</h3>
          <form onSubmit={createAdminUser} className="profile-form" style={{ padding: 0, boxShadow: 'none' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={newAdmin.full_name} onChange={e => setNewAdmin({ ...newAdmin, full_name: e.target.value })} required placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required placeholder="Email address" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required placeholder="Min 8 characters" minLength={8} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
        </div>
      )}
    </div>
  );
}
