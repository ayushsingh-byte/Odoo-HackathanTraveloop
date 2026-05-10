import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { API } from '../../services/api';

export default function TripChecklist() {
  const [params] = useSearchParams();
  const tripId = params.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tripTitle, setTripTitle] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!tripId) { navigate('/trips'); return; }
    API.get('/api/checklist/categories/all').then(d => setCategories(d.categories || []));
    API.get(`/api/trips/${tripId}`).then(d => { if (d.trip) setTripTitle(d.trip.title); });
    loadChecklist();
  }, [tripId]);

  async function loadChecklist() {
    const data = await API.get(`/api/checklist/${tripId}`);
    setItems(data.items || []);
  }

  async function addItem() {
    if (!newItem.trim()) return showAlert('Enter item name');
    const data = await API.post(`/api/checklist/${tripId}`, { item_name: newItem.trim(), category_id: newCatId || null });
    if (data?.error) return showAlert(data.error);
    setNewItem('');
    await loadChecklist();
  }

  async function toggleItem(itemId) {
    await API.patch(`/api/checklist/${tripId}/${itemId}/toggle`, {});
    await loadChecklist();
  }

  async function deleteItem(itemId) {
    await API.del(`/api/checklist/${tripId}/${itemId}`);
    await loadChecklist();
  }

  async function resetAll() {
    if (!confirm('Mark all items as unpacked?')) return;
    await API.post(`/api/checklist/${tripId}/reset`, {});
    await loadChecklist();
    showAlert('Checklist reset', 'success');
  }

  const packed = items.filter(i => i.is_packed).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100);

  const grouped = items.reduce((acc, item) => {
    const cat = item.category_name || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

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
    <div className="container" style={{ maxWidth: 720 }}>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      {tripSubNav}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Packing Checklist</h1>
          <p>{tripTitle}</p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-secondary" onClick={resetAll}>Reset All</button>
          <Link to={`/trip/view?id=${tripId}`} className="btn btn-secondary">← Back</Link>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="flex items-center justify-between mb-1">
            <strong>{packed}/{total} packed</strong>
            <span className="badge badge-primary">{pct}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h3 className="mb-2">Add Item</h3>
          <div className="flex gap-2">
            <input type="text" className="form-control" placeholder="Passport, Laptop charger..." style={{ flex: 1 }} value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} />
            <select className="form-control" style={{ maxWidth: 160 }} value={newCatId} onChange={e => setNewCatId(e.target.value)}>
              <option value="">Category</option>
              {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
            </select>
            <button className="btn btn-primary" onClick={addItem}>Add</button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state"><h3>No items yet</h3><p>Add items you need to pack above.</p></div>
      ) : Object.entries(grouped).map(([cat, catItems]) => {
        const catPacked = catItems.filter(i => i.is_packed).length;
        return (
          <div key={cat} className="card mb-2">
            <div className="card-body">
              <div className="flex items-center justify-between mb-1">
                <h3>{cat}</h3>
                <span className="badge badge-gray">{catPacked}/{catItems.length}</span>
              </div>
              {catItems.map(item => (
                <div key={item.item_id} className={`checklist-item${item.is_packed ? ' packed' : ''}`}>
                  <input type="checkbox" id={`item-${item.item_id}`} checked={!!item.is_packed} onChange={() => toggleItem(item.item_id)} />
                  <label htmlFor={`item-${item.item_id}`}>{item.item_name}</label>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.item_id)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
