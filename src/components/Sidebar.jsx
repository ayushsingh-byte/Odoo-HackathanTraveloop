import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Map, Plus, Users, Settings, LogOut, Globe, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const NAV = [
  { to: '/home',        icon: Home,    label: 'Home' },
  { to: '/explore',     icon: Compass, label: 'Explore' },
  { to: '/my-trips',    icon: Map,     label: 'My Trips' },
  { to: '/create-trip', icon: Plus,    label: 'New Trip' },
  { to: '/community',   icon: Users,   label: 'Community' },
];

const S = {
  aside: (w) => ({
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: w, zIndex: 100,
    background: 'rgba(10,10,10,0.97)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    display: 'flex', flexDirection: 'column',
    transition: 'width 0.25s ease',
    overflow: 'hidden',
  }),
  brand: (collapsed) => ({
    display: 'flex', alignItems: 'center',
    gap: collapsed ? 0 : '0.6rem',
    padding: collapsed ? '1.25rem 0' : '1.25rem 1.25rem 1rem',
    textDecoration: 'none',
    justifyContent: 'center',
    overflow: 'hidden',
  }),
  toggleBtn: {
    position: 'absolute', top: 18, right: -12,
    width: 24, height: 24, borderRadius: '50%',
    background: 'rgba(201,168,76,0.9)',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 101, color: '#0a0a0a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  navItem: (active, collapsed) => ({
    display: 'flex', alignItems: 'center',
    gap: collapsed ? 0 : '0.75rem',
    padding: collapsed ? '0.65rem 0' : '0.6rem 0.75rem',
    borderRadius: 10, marginBottom: 2,
    textDecoration: 'none',
    transition: 'all 0.2s',
    background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
    color: active ? '#c9a84c' : 'rgba(255,255,255,0.5)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: active ? 600 : 400,
    justifyContent: collapsed ? 'center' : 'flex-start',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();
  const location = useLocation();
  const w = collapsed ? 64 : 220;

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <motion.aside animate={{ width: w }} transition={{ duration: 0.25 }} style={S.aside(w)}>
      <button style={S.toggleBtn} onClick={() => setCollapsed(c => !c)}>
        {collapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
      </button>

      <Link to="/home" style={S.brand(collapsed)}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#e8a87c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Globe size={16} color="#0a0a0a" />
        </div>
        {!collapsed && <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: '#faf9f6', letterSpacing: '0.05em' }}>Traveloop</span>}
      </Link>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: collapsed ? '0 0.75rem 0.75rem' : '0 1rem 1rem' }} />

      <nav style={{ flex: 1, padding: collapsed ? '0 0.5rem' : '0 0.5rem' }}>
        {!collapsed && <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', padding: '0 0.75rem', marginBottom: '0.5rem' }}>Main</p>}
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to} title={collapsed ? label : undefined} style={S.navItem(active, collapsed)}>
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#c9a84c' }} />}
            </Link>
          );
        })}

        {user?.role === 'admin' && (
          <>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0.25rem' }} />
            {!collapsed && <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', padding: '0 0.75rem', marginBottom: '0.5rem' }}>Admin</p>}
            <Link to="/admin" title={collapsed ? 'Admin' : undefined} style={S.navItem(location.pathname === '/admin', collapsed)}>
              <Settings size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Admin Panel</span>}
            </Link>
          </>
        )}
      </nav>

      <div style={{ padding: collapsed ? '0.75rem 0.5rem' : '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/profile" title={collapsed ? user?.name : undefined} style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '0.6rem', padding: collapsed ? '0.6rem 0' : '0.6rem 0.75rem', borderRadius: 10, textDecoration: 'none', marginBottom: 4, justifyContent: collapsed ? 'center' : 'flex-start', overflow: 'hidden' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#e8a87c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#0a0a0a', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#faf9f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          )}
        </Link>
        <button onClick={logout} title={collapsed ? 'Logout' : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '0.75rem', width: '100%', padding: collapsed ? '0.55rem 0' : '0.55rem 0.75rem', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
