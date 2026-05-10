import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API, fmt } from '../../services/api';

const PAGE = 10;

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', body: '', category: 'experience', image_url: '' });
  const [alert, setAlert] = useState(null);
  const searchTimer = useRef(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => { loadPosts(); }, [cat]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(loadPosts, 350);
  }, [search]);

  async function loadPosts(append = false) {
    const off = append ? offset : 0;
    let url = `/api/community?limit=${PAGE}&offset=${off}`;
    if (search) url += `&q=${encodeURIComponent(search)}`;
    if (cat) url += `&category=${cat}`;
    const data = await API.get(url);
    const newPosts = data.posts || [];
    setPosts(append ? prev => [...prev, ...newPosts] : newPosts);
    setHasMore(newPosts.length === PAGE);
    if (!append) setOffset(0);
  }

  async function likePost(id) {
    await API.post(`/api/community/${id}/like`, {});
    setPosts(prev => prev.map(p => p.post_id === id ? { ...p, likes_count: p.likes_count + 1 } : p));
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    await API.del(`/api/community/${id}`);
    setPosts(prev => prev.filter(p => p.post_id !== id));
  }

  async function submitPost() {
    if (!postForm.title.trim() || !postForm.body.trim()) return showAlert('Title and story required');
    const data = await API.post('/api/community', {
      title: postForm.title, body: postForm.body, category: postForm.category,
      image_url: postForm.image_url || null
    });
    if (data?.error) return showAlert(data.error);
    setModal(false);
    setPostForm({ title: '', body: '', category: 'experience', image_url: '' });
    await loadPosts();
    showAlert('Posted!', 'success');
  }

  const catClass = (c) => ({ experience: 'cat-experience', tip: 'cat-tip', photo: 'cat-photo', review: 'cat-review' }[c] || '');

  return (
    <>
      <style>{`
        .post-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:14px;padding:1.5rem;margin-bottom:1.25rem}
        .post-author{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}
        .post-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0}
        .post-meta{font-size:.82rem;color:#6b7280}
        .post-image{width:100%;max-height:280px;object-fit:cover;border-radius:10px;margin:.75rem 0}
        .post-actions{display:flex;align-items:center;gap:1rem;margin-top:1rem;padding-top:.75rem;border-top:1px solid #f1f0ff}
        .like-btn{background:none;border:none;cursor:pointer;color:#6b7280;font-size:.9rem;display:flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:6px;transition:background .15s}
        .like-btn:hover{background:#f1f0ff;color:#6c63ff}
        .category-badge{font-size:.75rem;padding:.2rem .6rem;border-radius:20px;font-weight:600;text-transform:capitalize}
        .cat-experience{background:#ede9ff;color:#6c63ff}
        .cat-tip{background:#d1fae5;color:#065f46}
        .cat-photo{background:#fef3c7;color:#92400e}
        .cat-review{background:#fee2e2;color:#991b1b}
        .filter-row{display:flex;gap:.75rem;margin-bottom:1.5rem;flex-wrap:wrap;align-items:center}
      `}</style>
      <div className="container" style={{ maxWidth: 760 }}>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
        <div className="page-header flex items-center justify-between">
          <div><h1>Community</h1><p>Share experiences, tips, and travel stories</p></div>
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ Share Experience</button>
        </div>

        <div className="filter-row">
          <input type="text" className="form-control" placeholder="Search posts..." style={{ flex: 1, minWidth: 180 }} value={search} onChange={e => setSearch(e.target.value)} />
          <select className="form-control" style={{ maxWidth: 160 }} value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">All Categories</option>
            {['experience', 'tip', 'photo', 'review'].map(c => <option key={c} value={c}>{c === 'tip' ? 'Travel Tip' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state"><h3>No posts yet</h3><p>Be the first to share your travel experience!</p></div>
        ) : posts.map(p => (
          <div key={p.post_id} className="post-card">
            <div className="post-author">
              <div className="post-avatar">{(p.author_name || 'U').charAt(0).toUpperCase()}</div>
              <div>
                <strong>{p.author_name}</strong>
                {p.trip_title && <span className="text-muted" style={{ marginLeft: '0.4rem', fontSize: '0.82rem' }}>on {p.trip_title}</span>}
                <div className="post-meta">{fmt(p.created_at)}</div>
              </div>
              <span className={`category-badge ${catClass(p.category)}`} style={{ marginLeft: 'auto' }}>{p.category}</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{p.title}</h3>
            <p style={{ fontSize: '0.92rem', whiteSpace: 'pre-wrap', color: '#374151' }}>{p.body}</p>
            {p.image_url && <img className="post-image" src={p.image_url} alt="" onError={e => { e.target.style.display = 'none'; }} />}
            <div className="post-actions">
              <button className="like-btn" onClick={() => likePost(p.post_id)}>♥ <span>{p.likes_count}</span></button>
              {(user && (p.author_id === user.user_id || user.role === 'admin')) && (
                <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }} onClick={() => deletePost(p.post_id)}>Delete</button>
              )}
            </div>
          </div>
        ))}

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => { setOffset(o => o + PAGE); loadPosts(true); }}>Load More</button>
          </div>
        )}

        {modal && (
          <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal" style={{ maxWidth: 580 }}>
              <div className="modal-header">
                <h3>Share Experience</h3>
                <button className="modal-close" onClick={() => setModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Amazing sunset in Santorini..." value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={postForm.category} onChange={e => setPostForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="experience">Experience</option>
                    <option value="tip">Travel Tip</option>
                    <option value="photo">Photo</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Story</label>
                  <textarea className="form-control" rows="5" placeholder="Share your travel story..." value={postForm.body} onChange={e => setPostForm(f => ({ ...f, body: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input type="url" className="form-control" placeholder="https://..." value={postForm.image_url} onChange={e => setPostForm(f => ({ ...f, image_url: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitPost}>Post</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
