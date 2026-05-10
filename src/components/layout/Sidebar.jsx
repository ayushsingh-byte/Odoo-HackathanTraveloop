import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard', key: 'dashboard' },
  { to: '/trips', icon: '🗺️', label: 'My Trips', key: 'trips' },
  { to: '/trip/new', icon: '＋', label: 'New Trip', key: 'new-trip' },
  { to: '/cities', icon: '🌍', label: 'Explore', key: 'cities' },
  { to: '/community', icon: '💬', label: 'Community', key: 'community' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (to) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="sidebar-brand">✈ Traveloop</Link>
      <p className="sidebar-section">Main</p>
      <ul className="sidebar-nav">
        {NAV.map(({ to, icon, label }) => (
          <li key={to}>
            <Link to={to} className={isActive(to) ? 'active' : ''}>
              <span className="sidebar-icon">{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      {user.role === 'admin' && (
        <>
          <p className="sidebar-section">Admin</p>
          <ul className="sidebar-nav">
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                <span className="sidebar-icon">⚙️</span>
                Admin Panel
              </Link>
            </li>
          </ul>
        </>
      )}
      <div className="sidebar-bottom">
        <Link to="/profile" className="sidebar-user" style={{ textDecoration: 'none' }}>
          <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </Link>
        <button
          onClick={logout}
          className="btn btn-ghost btn-sm w-full"
          style={{ justifyContent: 'flex-start', padding: '0.4rem 0.75rem', marginTop: '0.4rem' }}
        >
          ⬅ Logout
        </button>
      </div>
    </aside>
  );
}
