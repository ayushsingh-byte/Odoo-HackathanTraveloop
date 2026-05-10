import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { API, fmt } from '../../services/api';

export default function TripNotes() {
  const [params] = useSearchParams();
  const tripId = params.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [stops, setStops] = useState([]);
  const [tripTitle, setTripTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [stopFilter, setStopFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [noteForm, setNoteForm] = useState({ note_title: '', note_content: '', stop_id: '' });
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!tripId) { navigate('/trips'); return; }
    API.get(`/api/trips/${tripId}`).then(d => {
      if (d.trip) setTripTitle(d.trip.title);
      setStops(d.stops || []);
    });
    loadNotes();
  }, [tripId]);

  async function loadNotes() {
    let url = `/api/notes/${tripId}`;
    if (filter === 'trip') url += '?stop_id=null';
    else if (filter === 'stop' && stopFilter) url += `?stop_id=${stopFilter}`;
    const data = await API.get(url);
    setNotes(data.notes || []);
  }

  useEffect(() => { loadNotes(); }, [filter, stopFilter]);

  function openAdd() {
    setEditId(null);
    setNoteForm({ note_title: '', note_content: '', stop_id: '' });
    setModal(true);
  }

  function openEdit(n) {
    setEditId(n.note_id);
    setNoteForm({ note_title: n.note_title || '', note_content: n.note_content || '', stop_id: n.stop_id || '' });
    setModal(true);
  }

  async function saveNote() {
    const payload = { note_title: noteForm.note_title || null, note_content: noteForm.note_content || null, stop_id: noteForm.stop_id || null };
    const data = editId
      ? await API.put(`/api/notes/${tripId}/${editId}`, payload)
      : await API.post(`/api/notes/${tripId}`, payload);
    if (data?.error) return showAlert(data.error);
    setModal(false);
    await loadNotes();
  }

  async function deleteNote(noteId) {
    if (!confirm('Delete this note?')) return;
    await API.del(`/api/notes/${tripId}/${noteId}`);
    await loadNotes();
  }

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
    <div className="container" style={{ maxWidth: 760 }}>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      {tripSubNav}
      <div className="page-header flex items-center justify-between">
        <div><h1>Trip Notes</h1><p>{tripTitle}</p></div>
        <div className="flex gap-1">
          <button className="btn btn-primary" onClick={openAdd}>+ Add Note</button>
          <Link to={`/trip/view?id=${tripId}`} className="btn btn-secondary">← Back</Link>
        </div>
      </div>

      <div className="tab-bar">
        {['all', 'trip', 'stop'].map((f, i) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {['All', 'Trip Level', 'By Stop'][i]}
          </button>
        ))}
      </div>

      {filter === 'stop' && (
        <div className="form-group">
          <select className="form-control" value={stopFilter} onChange={e => setStopFilter(e.target.value)}>
            <option value="">All Stops</option>
            {stops.map(s => <option key={s.stop_id} value={s.stop_id}>{s.city_name}</option>)}
          </select>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="empty-state"><h3>No notes yet</h3><p>Add a note to remember important details about your trip.</p></div>
      ) : notes.map(n => (
        <div key={n.note_id} className="note-card">
          <div className="note-meta">
            {n.city_name ? <span className="badge badge-primary">{n.city_name}</span> : <span className="badge badge-gray">Trip Note</span>}
            {' · '}{fmt(n.created_at)}
          </div>
          {n.note_title && <h3 style={{ marginBottom: '0.4rem' }}>{n.note_title}</h3>}
          <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{n.note_content || ''}</p>
          <div className="flex gap-1 mt-2">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(n)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteNote(n.note_id)}>Delete</button>
          </div>
        </div>
      ))}

      {modal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Edit Note' : 'Add Note'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" placeholder="Hotel check-in, reminder..." value={noteForm.note_title} onChange={e => setNoteForm(f => ({ ...f, note_title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Attach to Stop (optional)</label>
                <select className="form-control" value={noteForm.stop_id} onChange={e => setNoteForm(f => ({ ...f, stop_id: e.target.value }))}>
                  <option value="">Trip-level note</option>
                  {stops.map(s => <option key={s.stop_id} value={s.stop_id}>{s.city_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <textarea className="form-control" rows="5" placeholder="Your notes..." value={noteForm.note_content} onChange={e => setNoteForm(f => ({ ...f, note_content: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
