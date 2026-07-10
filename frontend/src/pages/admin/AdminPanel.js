import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    api.get('/auth/users/').then(({ data }) => setUsers(data));
    api.get('/profiles/admin/').then(({ data }) => setProfiles(data));
  }, []);

  const toggleActive = async (user) => {
    try {
      await api.patch(`/auth/users/${user.id}/`, { is_active: !user.is_active });
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const changeRole = async (user, role) => {
    try {
      await api.patch(`/auth/users/${user.id}/`, { role });
      setUsers(users.map(u => u.id === user.id ? { ...u, role } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/auth/users/${id}/`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const deleteProfile = async (id) => {
    if (!window.confirm('Delete this profile?')) return;
    try {
      await api.delete(`/profiles/admin/${id}/`);
      setProfiles(profiles.filter(p => p.id !== id));
      toast.success('Profile deleted');
    } catch {
      toast.error('Failed to delete profile');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>🛡️ Admin Panel</h2>
        <p>Manage users and profiles</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-info"><h3>{users.length}</h3><p>Total Users</p></div></div>
        <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-info"><h3>{profiles.length}</h3><p>Total Profiles</p></div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-info"><h3>{users.filter(u => u.is_active).length}</h3><p>Active Users</p></div></div>
      </div>

      <div className="tab-bar">
        <button className={tab === 'users' ? 'tab active' : 'tab'} onClick={() => setTab('users')}>Users ({users.length})</button>
        <button className={tab === 'profiles' ? 'tab active' : 'tab'} onClick={() => setTab('profiles')}>Profiles ({profiles.length})</button>
      </div>

      {tab === 'users' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>NLM ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong style={{color:'#c0392b'}}>{user.user_id}</strong></td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select value={user.role} onChange={(e) => changeRole(user, e.target.value)} className="role-select">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="developer">Developer</option>
                    </select>
                  </td>
                  <td><span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td className="action-btns">
                    <button className="btn-sm btn-warning" onClick={() => toggleActive(user)}>{user.is_active ? 'Deactivate' : 'Activate'}</button>
                    <button className="btn-sm btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'profiles' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Photo</th><th>Name</th><th>Gender</th><th>Religion</th><th>City</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id}>
                  <td>
                    {profile.photo_url
                      ? <img src={profile.photo_url} alt="" className="table-avatar" />
                      : <div className="table-avatar-placeholder">{profile.user?.full_name?.charAt(0)}</div>}
                  </td>
                  <td>{profile.user?.full_name}</td>
                  <td>{profile.gender || '—'}</td>
                  <td>{profile.religion || '—'}</td>
                  <td>{profile.city || '—'}</td>
                  <td>
                    <button className="btn-sm btn-danger" onClick={() => deleteProfile(profile.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
