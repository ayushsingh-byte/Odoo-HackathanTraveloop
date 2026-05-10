import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { API, fmt, fmtMoney } from '../../services/api';

export default function TripView() {
  const [params] = useSearchParams();
  const tripId = params.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const [tripData, setTripData] = useState(null);
  const [view, setView] = useState('timeline');
  const [shareResult, setShareResult] = useState('');
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!tripId) { navigate('/trips'); return; }
    API.get(`/api/trips/${tripId}`).then(data => {
      if (data?.error) { showAlert(data.error); return; }
      setTripData(data);
    });
  }, [tripId]);

  async function shareTrip() {
    const data = await API.post(`/api/share/generate/${tripId}`, { expires_in_days: 30 });
    if (data?.error) return showAlert(data.error);
    const url = `${window.location.origin}/share?token=${data.share_token}`;
    setShareResult(url);
    navigator.clipboard?.writeText(url);
  }

  if (!tripData) return <div className="container"><div className="spinner" /></div>;

  const { trip, stops = [] } = tripData;

  const tripSubNav = (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
      {[
        { to: `/trip/view?id=${tripId}`, label: '📋 Itinerary' },
        { to: `/trip/builder?id=${tripId}`, label: '🔨 Builder' },
        { to: `/trip/budget?id=${tripId}`, label: '💰 Budget' },
        { to: `/trip/checklist?id=${tripId}`, label: '☑️ Checklist' },
        { to: `/trip/notes?id=${tripId}`, label: '📝 Notes' },
        { to: `/trip/invoice?id=${tripId}`, label: '🧾 Invoice' },
      ].map(({ to, label }) => (
        <Link key={to} to={to} style={{ padding: '0.4rem 0.9rem', borderRadius: 20, fontSize: '0.8rem', textDecoration: 'none', background: location.pathname === to.split('?')[0] ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)', color: location.pathname === to.split('?')[0] ? '#c9a84c' : 'rgba(255,255,255,0.5)', border: `1px solid ${location.pathname === to.split('?')[0] ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.2s' }}>
          {label}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="dark-trip-page" style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '2rem' }}>
    <div className="container">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      {tripSubNav}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>{trip.title}</h1>
            <p className="text-muted">{fmt(trip.start_date)} — {fmt(trip.end_date)}</p>
          </div>
          <div className="flex gap-1">
            <Link to={`/trip/builder?id=${tripId}`} className="btn btn-secondary">Edit Itinerary</Link>
            <Link to={`/trip/budget?id=${tripId}`} className="btn btn-secondary">Budget</Link>
            <Link to={`/trip/checklist?id=${tripId}`} className="btn btn-secondary">Checklist</Link>
            <Link to={`/trip/notes?id=${tripId}`} className="btn btn-secondary">Notes</Link>
            <Link to={`/trip/invoice?id=${tripId}`} className="btn btn-secondary">Invoice</Link>
            <button className="btn btn-primary" onClick={shareTrip}>Share</button>
          </div>
        </div>
        {shareResult && (
          <div className="alert alert-success" style={{ marginTop: '0.75rem' }}>
            Link: <a href={shareResult} target="_blank" rel="noreferrer">{shareResult}</a>
          </div>
        )}
      </div>

      <div className="tab-bar">
        <button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>Timeline</button>
        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List View</button>
      </div>

      <div id="itinerary-content">
        {stops.length === 0 ? (
          <div className="empty-state">
            <h3>No stops yet</h3>
            <p>Add cities in the builder to build your itinerary.</p>
            <Link to={`/trip/builder?id=${tripId}`} className="btn btn-primary mt-2">Open Builder</Link>
          </div>
        ) : view === 'timeline' ? (
          <div className="timeline">
            {stops.map(s => {
              const days = s.arrival_date && s.departure_date
                ? Math.max(1, Math.ceil((new Date(s.departure_date) - new Date(s.arrival_date)) / 86400000))
                : null;
              return (
                <div key={s.stop_id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="card mb-2">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3>{s.city_name} <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.9rem' }}>{s.country_name}</span></h3>
                          <p className="text-muted">{fmt(s.arrival_date)} — {fmt(s.departure_date)}{days ? ` · ${days} day${days > 1 ? 's' : ''}` : ''}</p>
                        </div>
                        <span className="badge badge-primary">~${s.avg_daily_cost}/day</span>
                      </div>
                      {(s.activities || []).length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <p className="text-muted mb-1" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Activities</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {s.activities.map((a, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8f9ff', borderRadius: 8 }}>
                                <div>
                                  <span className="activity-chip">{a.category_name}</span>
                                  <strong style={{ marginLeft: '0.4rem', fontSize: '0.9rem' }}>{a.activity_name}</strong>
                                  {a.scheduled_time && <span className="text-muted" style={{ marginLeft: '0.4rem', fontSize: '0.8rem' }}>{a.scheduled_time}</span>}
                                </div>
                                <span className="text-muted">{fmtMoney(a.actual_cost || a.estimated_cost)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.notes && <p className="text-muted mt-2" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>{s.notes}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-2">
            {stops.map(s => (
              <div key={s.stop_id} className="card">
                <img src={s.city_image || ''} style={{ width: '100%', height: 120, objectFit: 'cover' }} onError={e => { e.target.style.background = 'linear-gradient(135deg,#6c63ff,#a78bfa)'; }} alt={s.city_name} />
                <div className="card-body">
                  <h3>{s.city_name}</h3>
                  <p className="text-muted">{fmt(s.arrival_date)} — {fmt(s.departure_date)}</p>
                  <p className="text-muted mt-1">{(s.activities || []).length} activities planned</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
