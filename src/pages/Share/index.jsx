import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API, fmt, fmtMoney } from '../../services/api';

export default function Share() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setError(true); setLoading(false); return; }
    API.get(`/api/share/${token}`).then(d => {
      setLoading(false);
      if (d?.error) { setError(true); return; }
      setData(d);
      document.title = `${d.trip.title} — Traveloop`;
    });
  }, [token]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/login" className="navbar-brand">✈ Traveloop</Link>
          <ul className="navbar-nav">
            <li><Link to="/login" className="btn btn-primary btn-sm">Login to Plan Your Trip</Link></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: 800 }}>
        {error ? (
          <div className="empty-state">
            <h3>Link not found or expired</h3>
            <p>This shared link may have been revoked or has expired.</p>
            <Link to="/login" className="btn btn-primary mt-2">Go to Traveloop</Link>
          </div>
        ) : data && (
          <>
            <div style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', padding: '2.5rem', borderRadius: 16, color: '#fff', marginBottom: '2rem', marginTop: '1.5rem' }}>
              <p style={{ opacity: 0.8, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Shared itinerary by <span>{data.trip.owner_name}</span></p>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.trip.title}</h1>
              <p style={{ opacity: 0.9 }}>{fmt(data.trip.start_date)} — {fmt(data.trip.end_date)}</p>
            </div>

            <div className="timeline">
              {(data.stops || []).map((s, i) => (
                <div key={s.stop_id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="card mb-2">
                    <div className="card-body">
                      <h3>Stop {i + 1}: {s.city_name} <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.9rem' }}>{s.country_name}</span></h3>
                      <p className="text-muted">{fmt(s.arrival_date)} — {fmt(s.departure_date)}</p>
                      {(s.activities || []).length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>ACTIVITIES</p>
                          {s.activities.map((a, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8f9ff', borderRadius: 8, marginBottom: '0.4rem' }}>
                              <span><span className="activity-chip">{a.category_name}</span> <strong style={{ marginLeft: '0.4rem', fontSize: '0.9rem' }}>{a.activity_name}</strong></span>
                              <span className="text-muted">{fmtMoney(a.estimated_cost)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
