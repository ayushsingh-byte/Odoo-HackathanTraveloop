import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API, fmt, fmtMoney } from '../../services/api';

export default function Trips() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState({ ongoing: [], upcoming: [], completed: [], undated: [] });
  const [tab, setTab] = useState('ongoing');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    const data = await API.get('/api/trips');
    setAllTrips(data);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const data = await API.del(`/api/trips/${deleteTarget}`);
    setDeleteTarget(null);
    if (data?.error) return showAlert(data.error);
    await loadTrips();
    showAlert('Trip deleted', 'success');
  }

  const trips = allTrips[tab] || [];

  return (
    <div className="container">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>My Trips</h1>
          <p>Manage your travel plans</p>
        </div>
        <Link to="/trip/new" className="btn btn-primary">+ New Trip</Link>
      </div>

      <div className="tab-bar">
        {['ongoing', 'upcoming', 'undated', 'completed'].map((t, i) => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {['Ongoing', 'Upcoming', 'Drafts', 'Completed'][i]}
          </button>
        ))}
      </div>

      <div className="grid grid-3">
        {trips.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <h3>No {tab} trips</h3>
            <p>{tab === 'upcoming' ? 'Plan your next adventure!' : tab === 'undated' ? 'Trips without dates show here.' : 'Your completed trips will appear here.'}</p>
            <Link to="/trip/new" className="btn btn-primary mt-2">Plan a Trip</Link>
          </div>
        ) : trips.map(t => (
          <div key={t.trip_id} className="card trip-card">
            <img
              className="trip-card-cover"
              src={t.cover_image || `https://picsum.photos/seed/${t.trip_id}/400/200`}
              alt={t.title}
              onClick={() => navigate(`/trip/view?id=${t.trip_id}`)}
              style={{ cursor: 'pointer' }}
              onError={e => { e.target.style.background = 'linear-gradient(135deg,#6c63ff,#a78bfa)'; }}
            />
            <div className="card-body">
              <h3 onClick={() => navigate(`/trip/view?id=${t.trip_id}`)} style={{ cursor: 'pointer' }}>{t.title}</h3>
              <div className="trip-card-meta">
                <span className="badge badge-primary">{t.stop_count} stops</span>
                {t.total_budget > 0 && t.total_cost > t.total_budget && <span className="badge badge-danger">Over Budget</span>}
              </div>
              <p className="text-muted mt-1">{fmt(t.start_date)} — {fmt(t.end_date)}</p>
              <div className="flex gap-1 mt-2">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trip/view?id=${t.trip_id}`)}>View</button>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trip/builder?id=${t.trip_id}`)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(t.trip_id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Trip</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>This will permanently delete the trip and all its data. This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
