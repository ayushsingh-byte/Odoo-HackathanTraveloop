import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { API, fmtMoney } from '../../services/api';

const COLORS = ['#6c63ff', '#f5a623', '#22c55e', '#ef4444', '#a78bfa'];
const LABELS = ['Transport', 'Stay', 'Food', 'Activities', 'Misc'];

export default function TripBudget() {
  const [params] = useSearchParams();
  const tripId = params.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const [tripTitle, setTripTitle] = useState('Budget');
  const [budget, setBudget] = useState(null);
  const [form, setForm] = useState({ total_budget: 0, currency: 'USD', transport_cost: 0, stay_cost: 0, food_cost: 0, activity_cost: 0, misc_cost: 0 });
  const [alert, setAlert] = useState(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const pieChart = useRef(null);
  const barChart = useRef(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!tripId) { navigate('/trips'); return; }
    API.get(`/api/trips/${tripId}`).then(d => { if (d.trip) setTripTitle(`${d.trip.title} — Budget`); });
    loadBudget();
  }, [tripId]);

  async function loadBudget() {
    const data = await API.get(`/api/budget/${tripId}`);
    if (data?.error) return;
    const b = data.budget;
    setBudget(b);
    setForm({ total_budget: b.total_budget, currency: b.currency || 'USD', transport_cost: b.transport_cost, stay_cost: b.stay_cost, food_cost: b.food_cost, activity_cost: b.activity_cost, misc_cost: b.misc_cost });
    renderCharts([b.transport_cost, b.stay_cost, b.food_cost, b.activity_cost, b.misc_cost]);
  }

  function renderCharts(vals) {
    setTimeout(() => {
      if (typeof Chart === 'undefined') return;
      if (pieRef.current) {
        if (pieChart.current) pieChart.current.destroy();
        pieChart.current = new Chart(pieRef.current, {
          type: 'doughnut',
          data: { labels: LABELS, datasets: [{ data: vals, backgroundColor: COLORS, borderWidth: 0 }] },
          options: { plugins: { legend: { position: 'bottom' } }, cutout: '60%' }
        });
      }
      if (barRef.current) {
        if (barChart.current) barChart.current.destroy();
        barChart.current = new Chart(barRef.current, {
          type: 'bar',
          data: { labels: LABELS, datasets: [{ data: vals, backgroundColor: COLORS, borderRadius: 6 }] },
          options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
      }
    }, 100);
  }

  async function saveBudget() {
    const data = await API.put(`/api/budget/${tripId}`, {
      total_budget: parseFloat(form.total_budget) || 0,
      transport_cost: parseFloat(form.transport_cost) || 0,
      stay_cost: parseFloat(form.stay_cost) || 0,
      food_cost: parseFloat(form.food_cost) || 0,
      activity_cost: parseFloat(form.activity_cost) || 0,
      misc_cost: parseFloat(form.misc_cost) || 0,
      currency: form.currency
    });
    if (data?.error) return showAlert(data.error);
    showAlert('Budget updated', 'success');
    await loadBudget();
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

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
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#faf9f6', paddingTop: '2rem' }}>
    <div className="container">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      {tripSubNav}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>{tripTitle}</h1>
          <p>Track spending by category</p>
        </div>
        <Link to={`/trip/view?id=${tripId}`} className="btn btn-secondary">← Back to Trip</Link>
      </div>

      {budget?.over_budget && (
        <div className="over-budget-banner">⚠ Over Budget! You have exceeded your travel budget.</div>
      )}

      {budget && (
        <div className="grid grid-2 mb-3" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            ['Total Budget', fmtMoney(budget.total_budget, budget.currency)],
            ['Total Spent', fmtMoney(budget.total_cost, budget.currency)],
            ['Remaining', fmtMoney(budget.remaining, budget.currency)],
            ['Avg per Day', fmtMoney(budget.total_cost / 7, budget.currency)],
          ].map(([label, val]) => (
            <div key={label} className="stat-card">
              <div className="stat-value">{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-2 mb-3">
        <div className="card"><div className="card-body"><h3 className="mb-2">Spending Breakdown</h3><canvas ref={pieRef} height="220" /></div></div>
        <div className="card"><div className="card-body"><h3 className="mb-2">By Category</h3><canvas ref={barRef} height="220" /></div></div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h3 className="mb-2">Update Budget</h3>
          <div className="grid grid-2">
            {[
              ['Total Budget', 'total_budget'],
              ['Currency', 'currency', 'select'],
              ['Transport Cost', 'transport_cost'],
              ['Stay Cost', 'stay_cost'],
              ['Food Cost', 'food_cost'],
              ['Activity Cost', 'activity_cost'],
              ['Misc Cost', 'misc_cost'],
            ].map(([label, field, type]) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                {type === 'select' ? (
                  <select className="form-control" value={form.currency} onChange={set('currency')}>
                    {['USD','EUR','GBP','JPY','INR','AUD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input type="number" className="form-control" min="0" value={form[field]} onChange={set(field)} />
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={saveBudget}>Save Budget</button>
        </div>
      </div>
    </div>
    </div>
  );
}
