import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API, fmt } from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState({ ongoing: [], upcoming: [], completed: [], undated: [] });
  const [cities, setCities] = useState([]);
  const [sort, setSort] = useState('recent');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    API.get('/api/trips').then(setAllTrips);
    API.get('/api/cities?limit=8').then(d => setCities(d.cities || []));
  }, []);

  const getTrips = () => {
    let trips;
    if (filter === 'ongoing') trips = allTrips.ongoing || [];
    else if (filter === 'upcoming') trips = allTrips.upcoming || [];
    else if (filter === 'completed') trips = allTrips.completed || [];
    else trips = [...(allTrips.ongoing || []), ...(allTrips.upcoming || []), ...(allTrips.completed || [])];
    if (sort === 'upcoming') trips = [...(allTrips.upcoming || []), ...(allTrips.ongoing || []), ...(allTrips.completed || [])];
    else if (sort === 'completed') trips = [...(allTrips.completed || []), ...(allTrips.ongoing || []), ...(allTrips.upcoming || [])];
    return trips.slice(0, 6);
  };

  const goSearch = () => {
    if (search.trim()) navigate(`/cities?q=${encodeURIComponent(search.trim())}`);
  };

  const trips = getTrips();

  return (
    <>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      <div className="hero">
        <div className="container">
          <h1>Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
          <p>Where will your next adventure take you?</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search cities or destinations..."
              style={{ background: 'rgba(255,255,255,0.95)', border: 'none' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && goSearch()}
            />
            <button className="btn btn-lg" style={{ background: '#fff', color: '#6c63ff', fontWeight: 700, whiteSpace: 'nowrap' }} onClick={goSearch}>Search</button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/trip/new" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, border: '2px solid rgba(255,255,255,0.5)' }}>+ Plan a New Trip</Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex items-center gap-2 mb-3" style={{ marginTop: '1rem' }}>
          <select className="form-control" style={{ maxWidth: 180 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="upcoming">Upcoming First</option>
            <option value="completed">Completed First</option>
          </select>
          <select className="form-control" style={{ maxWidth: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="section-title">
          <span>Your Recent Trips</span>
          <Link to="/trips" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="grid grid-3 mb-3">
          {trips.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <h3>No trips yet</h3>
              <p>Start planning your first adventure!</p>
              <Link to="/trip/new" className="btn btn-primary mt-2">Plan a Trip</Link>
            </div>
          ) : trips.map(t => (
            <div key={t.trip_id} className="card trip-card" onClick={() => navigate(`/trip/view?id=${t.trip_id}`)}>
              <img
                className="trip-card-cover"
                src={t.cover_image || `https://picsum.photos/seed/${t.trip_id}/400/200`}
                alt={t.title}
                onError={e => { e.target.style.background = 'linear-gradient(135deg,#6c63ff,#a78bfa)'; e.target.style.display = 'block'; e.target.src = ''; }}
              />
              <div className="card-body">
                <h3>{t.title}</h3>
                <div className="trip-card-meta">
                  <span className="badge badge-primary">{t.stop_count} stops</span>
                  <span className="text-muted">{fmt(t.start_date)} — {fmt(t.end_date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title">
          <span>Popular Destinations</span>
          <Link to="/cities" className="btn btn-secondary btn-sm">Explore All</Link>
        </div>
        <div className="grid grid-4">
          {cities.length === 0 ? (
            <div className="spinner" />
          ) : cities.map(c => (
            <div key={c.city_id} className="card city-card" onClick={() => navigate(`/cities?city_id=${c.city_id}`)}>
              <img className="city-card-img" src={c.image_url || ''} alt={c.city_name} onError={e => { e.target.style.background = '#ede9ff'; }} />
              <div className="card-body" style={{ padding: '0.75rem 1rem' }}>
                <h3 style={{ fontSize: '0.95rem' }}>{c.city_name}</h3>
                <div className="city-card-cost">{c.country_name} · ~${c.avg_daily_cost}/day</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
