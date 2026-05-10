import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../../services/api';

export default function TripNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', start_date: '', end_date: '',
    total_budget: '', currency: 'USD', visibility: 'private', cover_image: ''
  });
  const [alert, setAlert] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      return showAlert('End date must be after start date');
    const data = await API.post('/api/trips', {
      title: form.title,
      description: form.description,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      total_budget: parseFloat(form.total_budget) || 0,
      currency: form.currency,
      visibility: form.visibility,
      cover_image: form.cover_image || null
    });
    if (data?.error) return showAlert(data.error);
    navigate(`/trip/builder?id=${data.trip_id}`);
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      <div className="page-header">
        <h1>Plan a New Trip</h1>
        <p>Give your adventure a name and dates to get started</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Trip Title *</label>
              <input type="text" className="form-control" placeholder="Europe Summer Adventure" value={form.title} onChange={set('title')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" placeholder="A quick overview of your trip..." value={form.description} onChange={set('description')} />
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" min={today} value={form.start_date} onChange={set('start_date')} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control" min={today} value={form.end_date} onChange={set('end_date')} />
              </div>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Total Budget</label>
                <input type="number" className="form-control" placeholder="5000" min="0" value={form.total_budget} onChange={set('total_budget')} />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select className="form-control" value={form.currency} onChange={set('currency')}>
                  {['USD','EUR','GBP','JPY','INR','AUD','SGD','THB'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Visibility</label>
              <select className="form-control" value={form.visibility} onChange={set('visibility')}>
                <option value="private">Private</option>
                <option value="link_only">Anyone with link</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image URL (optional)</label>
              <input type="url" className="form-control" placeholder="https://..." value={form.cover_image} onChange={set('cover_image')} />
            </div>
            <div className="flex gap-2 mt-3">
              <Link to="/trips" className="btn btn-secondary">Cancel</Link>
              <button type="submit" className="btn btn-primary">Create Trip →</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
