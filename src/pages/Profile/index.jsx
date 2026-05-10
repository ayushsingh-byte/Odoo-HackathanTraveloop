import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city_name: '', country_name: '', additional_info: '', password: '' });
  const [tripStats, setTripStats] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    API.get('/api/auth/me').then(d => {
      const u = d.user || user;
      setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', city_name: u.city_name || '', country_name: u.country_name || '', additional_info: u.additional_info || '', password: '' });
    });
    API.get('/api/trips').then(d => setTripStats({ ongoing: (d.ongoing || []).length, upcoming: (d.upcoming || []).length, completed: (d.completed || []).length }));
  }, []);

  const deleteAccount = async () => {
    if (!window.confirm('Permanently delete your account and all trip data? This cannot be undone.')) return;
    const second = window.confirm('Are you absolutely sure? All your trips, notes, and data will be lost forever.');
    if (!second) return;
    await API.del('/api/auth/account');
    logout();
  };

  async function handleUpdate(e) {
    e.preventDefault();
    const data = await API.put('/api/auth/profile', {
      name: form.name, email: form.email, phone: form.phone || null,
      city_name: form.city_name || null, country_name: form.country_name || null,
      additional_info: form.additional_info || null, password: form.password || null
    });
    if (data?.error) return showAlert(data.error);
    showAlert('Profile updated', 'success');
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      <div className="page-header"><h1>Profile & Settings</h1></div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.75rem', fontWeight: 700, flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{user?.name}</h2>
              <p className="text-muted">{user?.email}</p>
              <span className="badge badge-primary">{user?.role}</span>
            </div>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-control" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={set('email')} required /></div>
            <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-control" placeholder="+1 555 000 0000" value={form.phone} onChange={set('phone')} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group"><label className="form-label">City</label><input type="text" className="form-control" placeholder="New York" value={form.city_name} onChange={set('city_name')} /></div>
              <div className="form-group"><label className="form-label">Country</label><input type="text" className="form-control" placeholder="USA" value={form.country_name} onChange={set('country_name')} /></div>
            </div>
            <div className="form-group"><label className="form-label">Additional Info</label><textarea className="form-control" rows="2" value={form.additional_info} onChange={set('additional_info')} /></div>
            <div className="form-group">
              <label className="form-label">New Password <span className="text-muted">(leave blank to keep current)</span></label>
              <input type="password" className="form-control" placeholder="••••••••" minLength={6} value={form.password} onChange={set('password')} />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h3 className="mb-2">Trip Summary</h3>
          {!tripStats ? <div className="spinner" /> : (
            <div className="grid grid-3">
              {[['Ongoing', tripStats.ongoing], ['Upcoming', tripStats.upcoming], ['Completed', tripStats.completed]].map(([label, val]) => (
                <div key={label} className="stat-card"><div className="stat-value">{val}</div><div className="stat-label">{label}</div></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="card mb-3" style={{ border: '1.5px solid #ede9ff' }}>
          <div className="card-body">
            <h3 style={{ color: '#6c63ff', marginBottom: '0.5rem' }}>Admin Access</h3>
            <p className="text-muted mb-2">Manage users, view analytics, and platform stats.</p>
            <Link to="/admin" className="btn btn-primary">Open Admin Panel</Link>
          </div>
        </div>
      )}

      <div className="card" style={{ border: '1.5px solid #fee2e2' }}>
        <div className="card-body">
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone</h3>
          <p className="text-muted mb-2">Logging out will end your current session.</p>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
          <button onClick={deleteAccount}
            className="btn-outline text-xs py-2 px-5 mt-3 w-full justify-center"
            style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
