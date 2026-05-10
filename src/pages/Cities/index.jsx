import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API, fmtMoney } from '../../services/api';

export default function Cities() {
  const [params] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState(params.get('q') || '');
  const [country, setCountry] = useState('');
  const [modal, setModal] = useState(null);
  const [activities, setActivities] = useState([]);
  const [actLoading, setActLoading] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    API.get('/api/cities/countries').then(d => setCountries(d.countries || []));
    loadCities();
    const preselect = params.get('city_id');
    if (preselect) openModal(parseInt(preselect));
  }, []);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(loadCities, 350);
  }, [search, country]);

  async function loadCities() {
    let url = '/api/cities?limit=24';
    if (search) url += `&q=${encodeURIComponent(search)}`;
    if (country) url += `&country_id=${country}`;
    const data = await API.get(url);
    setCities(data.cities || []);
  }

  async function openModal(cityId) {
    setActLoading(true);
    const cityData = await API.get(`/api/cities/${cityId}`);
    setModal(cityData.city);
    const actsData = await API.get(`/api/activities?city_id=${cityId}&limit=10`);
    setActivities(actsData.activities || []);
    setActLoading(false);
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Explore Cities</h1>
        <p>Discover destinations around the world</p>
      </div>

      <div className="search-bar-wrap">
        <input type="text" className="form-control" placeholder="Search cities..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ maxWidth: 200 }} value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c.country_id} value={c.country_id}>{c.country_name}</option>)}
        </select>
      </div>

      <div className="grid grid-4">
        {cities.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}><h3>No cities found</h3></div>
        ) : cities.map(c => (
          <div key={c.city_id} className="card city-card" onClick={() => openModal(c.city_id)}>
            <img className="city-card-img" src={c.image_url || ''} alt={c.city_name} onError={e => { e.target.style.background = 'linear-gradient(135deg,#6c63ff,#a78bfa)'; }} />
            <div className="card-body" style={{ padding: '0.9rem 1rem' }}>
              <h3 style={{ fontSize: '0.95rem' }}>{c.city_name}</h3>
              <p className="city-card-cost">{c.country_name}</p>
              <p className="city-card-cost">~${c.avg_daily_cost}/day · ★ {c.popularity_score}</p>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>{modal.city_name}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <img src={modal.image_url || ''} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem' }} alt={modal.city_name} onError={e => { e.target.style.background = '#ede9ff'; }} />
              <p className="text-muted mb-2">{modal.description || ''}</p>
              <div className="flex gap-2 mb-2">
                <span className="badge badge-gray">{modal.country_name}</span>
                <span className="badge badge-primary">~${modal.avg_daily_cost}/day</span>
                <span className="badge badge-success">★ {modal.popularity_score}</span>
              </div>
              <h3 className="mb-2 mt-2">Activities in this City</h3>
              {actLoading ? <div className="spinner" /> : activities.length === 0 ? (
                <p className="text-muted">No activities listed</p>
              ) : activities.map(a => (
                <div key={a.activity_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f0ff' }}>
                  <div>
                    <span className="activity-chip">{a.category_name}</span>
                    <strong style={{ marginLeft: '0.4rem', fontSize: '0.9rem' }}>{a.activity_name}</strong>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{fmtMoney(a.estimated_cost)} · {a.estimated_duration_minutes}min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
