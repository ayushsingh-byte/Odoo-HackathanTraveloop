import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API, fmt } from '../../services/api';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [alert, setAlert] = useState(null);
  const trendRef = useRef(null);
  const trendChart = useRef(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      showAlert('Admin access required');
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    const [statsData, usersData] = await Promise.all([
      API.get('/api/admin/stats'),
      API.get('/api/admin/users')
    ]);
    setStats(statsData);
    setUsers(usersData.users || []);
  }

  useEffect(() => {
    if (tab === 'trends' && stats?.trips_per_day && typeof Chart !== 'undefined') {
      setTimeout(() => {
        if (!trendRef.current) return;
        if (trendChart.current) trendChart.current.destroy();
        trendChart.current = new Chart(trendRef.current, {
          type: 'line',
          data: {
            labels: stats.trips_per_day.map(d => d.date),
            datasets: [{ label: 'Trips Created', data: stats.trips_per_day.map(d => d.count), borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.1)', fill: true, tension: 0.4, pointRadius: 4 }]
          },
          options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
      }, 100);
    }
  }, [tab, stats]);

  const filteredUsers = users.filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <>
      <style>{`
        .admin-table{width:100%;border-collapse:collapse;font-size:.9rem}
        .admin-table th{background:#f8f9ff;padding:.75rem 1rem;text-align:left;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb}
        .admin-table td{padding:.75rem 1rem;border-bottom:1px solid #f1f0ff;vertical-align:middle}
        .admin-table tr:last-child td{border-bottom:none}
        .admin-table tr:hover td{background:#f8f9ff}
        .rank-bar{height:8px;background:#ede9ff;border-radius:4px;overflow:hidden;min-width:80px}
        .rank-bar-fill{height:100%;background:linear-gradient(90deg,#6c63ff,#a78bfa);border-radius:4px}
      `}</style>
      <div className="container">
        {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
        <div className="page-header"><h1>Admin Panel</h1><p>Platform overview and management</p></div>

        {stats && (
          <div className="grid grid-4 mb-3">
            {[['Total Users', stats.total_users, 'stat-users'], ['Total Trips', stats.total_trips, 'stat-trips'], ['City Stops', stats.total_stops, 'stat-stops'], ['Activities Planned', stats.total_activities, 'stat-acts']].map(([label, val]) => (
              <div key={label} className="stat-card"><div className="stat-value">{val}</div><div className="stat-label">{label}</div></div>
            ))}
          </div>
        )}

        <div className="tab-bar mb-0">
          {['users', 'cities', 'activities', 'trends'].map((t, i) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {['Manage Users', 'Popular Cities', 'Popular Activities', 'User Trends'][i]}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h3>Registered Users</h3>
                <input type="text" className="form-control" style={{ maxWidth: 240 }} placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Trips</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan="6" className="text-muted text-center">No users found</td></tr>
                    ) : filteredUsers.map(u => (
                      <tr key={u.user_id}>
                        <td><strong>{u.name}</strong></td>
                        <td className="text-muted">{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>{u.role}</span></td>
                        <td>{u.trip_count}</td>
                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>{fmt(u.created_at)}</td>
                        <td>{u.role !== 'admin' ? <button className="btn btn-danger btn-sm" onClick={() => showAlert('User deletion requires direct DB access in this demo.', 'warning')}>Remove</button> : <span className="text-muted">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'cities' && stats && (
          <div className="card mt-2">
            <div className="card-body">
              <h3 className="mb-2">Most Visited Cities</h3>
              <table className="admin-table">
                <thead><tr><th>#</th><th>City</th><th>Country</th><th>Visits</th><th>Popularity</th></tr></thead>
                <tbody>
                  {(stats.top_cities || []).map((c, i) => {
                    const max = stats.top_cities[0]?.visit_count || 1;
                    return (
                      <tr key={i}>
                        <td><strong>#{i + 1}</strong></td>
                        <td>{c.city_name}</td>
                        <td className="text-muted">{c.country_name}</td>
                        <td>{c.visit_count}</td>
                        <td><div className="rank-bar"><div className="rank-bar-fill" style={{ width: `${(c.visit_count / max) * 100}%` }} /></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'activities' && stats && (
          <div className="card mt-2">
            <div className="card-body">
              <h3 className="mb-2">Most Booked Activities</h3>
              <table className="admin-table">
                <thead><tr><th>#</th><th>Activity</th><th>Times Booked</th><th>Popularity</th></tr></thead>
                <tbody>
                  {(stats.top_activities || []).map((a, i) => {
                    const max = stats.top_activities[0]?.use_count || 1;
                    return (
                      <tr key={i}>
                        <td><strong>#{i + 1}</strong></td>
                        <td>{a.activity_name}</td>
                        <td>{a.use_count}</td>
                        <td><div className="rank-bar"><div className="rank-bar-fill" style={{ width: `${(a.use_count / max) * 100}%` }} /></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'trends' && (
          <div className="card mt-2">
            <div className="card-body">
              <h3 className="mb-2">Trip Creation Trend (Last 30 Days)</h3>
              <canvas ref={trendRef} height="120" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
