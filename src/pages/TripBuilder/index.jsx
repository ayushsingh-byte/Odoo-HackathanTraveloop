import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { API, fmt, fmtMoney } from '../../services/api';

export default function TripBuilder() {
  const [params] = useSearchParams();
  const tripId = params.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [stopModal, setStopModal] = useState(false);
  const [actModal, setActModal] = useState(false);
  const [activeStopId, setActiveStopId] = useState(null);
  const [actCityId, setActCityId] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopForm, setStopForm] = useState({ arrival_date: '', departure_date: '', notes: '' });
  const [actSearch, setActSearch] = useState('');
  const [activities, setActivities] = useState([]);
  const [actFilter, setActFilter] = useState({ type: '', maxCost: '' });
  const [alert, setAlert] = useState(null);
  const citySearchTimer = useRef(null);
  const actTimer = useRef(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!tripId) { navigate('/trips'); return; }
    loadTrip();
  }, [tripId]);

  useEffect(() => { if (actCityId) loadActivities(actSearch, actCityId); }, [actFilter]);

  async function loadTrip() {
    const data = await API.get(`/api/trips/${tripId}`);
    if (data?.error) return;
    setTrip(data.trip);
    setStops(data.stops || []);
  }

  async function searchCities(q) {
    setCitySearch(q);
    clearTimeout(citySearchTimer.current);
    if (q.length < 2) { setCityResults([]); return; }
    citySearchTimer.current = setTimeout(async () => {
      const data = await API.get(`/api/cities?q=${encodeURIComponent(q)}&limit=8`);
      setCityResults(data.cities || []);
    }, 300);
  }

  function selectCity(city) {
    setSelectedCity(city);
    setCitySearch(city.city_name);
    setCityResults([]);
  }

  async function saveStop() {
    if (!selectedCity) return showAlert('Please select a city');
    const data = await API.post(`/api/trips/${tripId}/stops`, {
      city_id: selectedCity.city_id,
      arrival_date: stopForm.arrival_date || null,
      departure_date: stopForm.departure_date || null,
      notes: stopForm.notes || null,
      position: stops.length
    });
    if (data?.error) return showAlert(data.error);
    setStopModal(false);
    setSelectedCity(null);
    setCitySearch('');
    setStopForm({ arrival_date: '', departure_date: '', notes: '' });
    await loadTrip();
  }

  async function moveStop(stopId, direction) {
    const idx = stops.findIndex(s => s.stop_id === stopId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === stops.length - 1) return;
    const newStops = [...stops];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newStops[idx], newStops[swapIdx]] = [newStops[swapIdx], newStops[idx]];
    const order = newStops.map(s => s.stop_id);
    await API.put(`/api/trips/${tripId}/stops/reorder`, { order });
    await loadTrip();
  }

  async function deleteStop(stopId) {
    if (!confirm('Remove this stop and all its activities?')) return;
    await API.del(`/api/trips/${tripId}/stops/${stopId}`);
    await loadTrip();
  }

  function openActModal(stopId, cityId) {
    setActiveStopId(stopId);
    setActCityId(cityId);
    setActSearch('');
    setActModal(true);
    loadActivities('', cityId);
  }

  async function loadActivities(q, cityId) {
    let url = `/api/activities?limit=15&city_id=${cityId}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (actFilter.type) url += `&category=${encodeURIComponent(actFilter.type)}`;
    const data = await API.get(url);
    let acts = data.activities || [];
    if (actFilter.maxCost) acts = acts.filter(a => parseFloat(a.estimated_cost) <= parseFloat(actFilter.maxCost));
    setActivities(acts);
  }

  function onActSearch(q) {
    setActSearch(q);
    clearTimeout(actTimer.current);
    actTimer.current = setTimeout(() => loadActivities(q, actCityId), 300);
  }

  async function addActivity(activityId) {
    const data = await API.post(`/api/trips/${tripId}/stops/${activeStopId}/activities`, { activity_id: activityId });
    if (data?.error) return showAlert(data.error);
    setActModal(false);
    await loadTrip();
  }

  async function removeActivity(stopId, saId) {
    await API.del(`/api/trips/${tripId}/stops/${stopId}/activities/${saId}`);
    await loadTrip();
  }

  if (!trip) return <div style={{ background: '#0a0a0a', minHeight: '100vh' }}><div className="container"><div className="spinner" /></div></div>;

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
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>{trip.title}</h1>
          <p>Add stops, cities, and activities to your trip</p>
        </div>
        <div className="flex gap-1">
          <Link to={`/trip/view?id=${tripId}`} className="btn btn-secondary">View Itinerary</Link>
          <button className="btn btn-primary" onClick={() => setStopModal(true)}>+ Add Stop</button>
        </div>
      </div>

      <style>{`
        .stop-card{border:1.5px solid #e5e7eb;border-radius:12px;background:#fff;margin-bottom:1rem}
        .stop-header{display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem}
        .stop-body{padding:0 1.25rem 1.25rem;border-top:1px solid #f1f0ff}
        .activity-row{display:flex;align-items:center;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid #f1f0ff}
        .stop-num{width:28px;height:28px;border-radius:50%;background:#6c63ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0}
        .city-results-drop{position:absolute;top:100%;left:0;right:0;background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;z-index:50;max-height:240px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,.1)}
        .city-result-item{padding:.65rem 1rem;cursor:pointer;font-size:.9rem;transition:background .15s}
        .city-result-item:hover{background:#f1f0ff}
      `}</style>

      {stops.length === 0 ? (
        <div className="empty-state">
          <h3>No stops yet</h3>
          <p>Add your first city stop to begin building your itinerary.</p>
        </div>
      ) : stops.map((s, i) => (
        <div key={s.stop_id} className="stop-card">
          <div className="stop-header">
            <span className="stop-num">{i + 1}</span>
            <div style={{ flex: 1 }}>
              <strong>{s.city_name}</strong>
              <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>{s.country_name}</span>
            </div>
            <span className="text-muted" style={{ fontSize: '0.82rem' }}>{fmt(s.arrival_date)} → {fmt(s.departure_date)}</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => moveStop(s.stop_id, 'up')} title="Move up"
                style={{ padding: '0.25rem 0.4rem', opacity: i === 0 ? 0.2 : 0.7 }}>↑</button>
              <button className="btn btn-ghost btn-sm" onClick={() => moveStop(s.stop_id, 'down')} title="Move down"
                style={{ padding: '0.25rem 0.4rem', opacity: i === stops.length - 1 ? 0.2 : 0.7 }}>↓</button>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => openActModal(s.stop_id, s.city_id)}>+ Activity</button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteStop(s.stop_id)}>✕</button>
          </div>
          {(s.activities || []).length > 0 && (
            <div className="stop-body">
              {s.activities.map(a => (
                <div key={a.id} className="activity-row">
                  <div>
                    <span className="activity-chip">{a.category_name}</span>
                    <strong style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>{a.activity_name}</strong>
                    {a.scheduled_date && <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>{fmt(a.scheduled_date)}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{fmtMoney(a.actual_cost || a.estimated_cost)}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => removeActivity(s.stop_id, a.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {stopModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal">
            <div className="modal-header">
              <h3>Add Stop</h3>
              <button className="modal-close" onClick={() => setStopModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">City</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="form-control" placeholder="Search city..." value={citySearch} onChange={e => searchCities(e.target.value)} autoComplete="off" />
                  {cityResults.length > 0 && (
                    <div className="city-results-drop">
                      {cityResults.map(c => (
                        <div key={c.city_id} className="city-result-item" onClick={() => selectCity(c)}>
                          <strong>{c.city_name}</strong> <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{c.country_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedCity && <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>Selected: {selectedCity.city_name}, {selectedCity.country_name}</div>}
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Arrival Date</label>
                  <input type="date" className="form-control" value={stopForm.arrival_date} onChange={e => setStopForm(f => ({ ...f, arrival_date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Departure Date</label>
                  <input type="date" className="form-control" value={stopForm.departure_date} onChange={e => setStopForm(f => ({ ...f, departure_date: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="2" placeholder="Hotel name, reminders..." value={stopForm.notes} onChange={e => setStopForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStopModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveStop}>Save Stop</button>
            </div>
          </div>
        </div>
      )}

      {actModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal">
            <div className="modal-header">
              <h3>Add Activity</h3>
              <button className="modal-close" onClick={() => setActModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <select value={actFilter.type} onChange={e => { setActFilter(f => ({...f, type: e.target.value})); }}
                  className="form-control" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', color: '#faf9f6', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.8rem' }}>
                  <option value="">All Types</option>
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Adventure">Adventure</option>
                </select>
                <input type="number" placeholder="Max cost $" value={actFilter.maxCost}
                  onChange={e => setActFilter(f => ({...f, maxCost: e.target.value}))}
                  className="form-control" style={{ width: 100, background: 'rgba(255,255,255,0.06)', color: '#faf9f6', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.8rem' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Search Activities</label>
                <input type="text" className="form-control" placeholder="Search..." value={actSearch} onChange={e => onActSearch(e.target.value)} />
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {activities.length === 0 ? (
                  <p className="text-muted text-center mt-2">No activities found</p>
                ) : activities.map(a => (
                  <div key={a.activity_id} className="activity-row" style={{ borderBottom: '1px solid #f1f0ff', padding: '0.75rem 0' }}>
                    <div>
                      <span className="activity-chip">{a.category_name}</span>
                      <strong style={{ marginLeft: '0.4rem' }}>{a.activity_name}</strong>
                      <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {a.estimated_duration_minutes}min · {fmtMoney(a.estimated_cost)} · ★ {a.rating}
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => addActivity(a.activity_id)}>Add</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
