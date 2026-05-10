import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MapPin, Clock } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { API } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Trending', 'Asia', 'Europe', 'Adventure', 'Culture'];

export default function CommunityExplore() {
  const [posts, setPosts] = useState([]);
  const [postModal, setPostModal] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', body: '', category: 'experience', image_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/api/community?limit=12').then(data => {
      if (!data) return;
      const list = Array.isArray(data) ? data : (data?.posts || []);
      setPosts(list.map(post => ({
        id: post.post_id,
        trip: post.title,
        user: post.author_name,
        destination: post.category,
        duration: post.created_at ? new Date(post.created_at).toLocaleDateString() : '',
        likes: post.likes_count || 0,
        saves: 0,
        image: post.image_url || '/images/hero-japan.png',
        avatar: post.author_name ? post.author_name.charAt(0).toUpperCase() : '✈',
      })));
    });
  }, []);

  const submitPost = async () => {
    if (!postForm.title.trim() || !postForm.body.trim()) return;
    setSubmitting(true);
    const data = await API.post('/api/community', postForm);
    setSubmitting(false);
    if (data?.error) return;
    setPostModal(false);
    setPostForm({ title: '', body: '', category: 'experience', image_url: '' });
    API.get('/api/community?limit=12').then(d => {
      if (d?.posts) setPosts(d.posts.map(post => ({
        id: post.post_id,
        trip: post.title,
        user: post.author_name,
        destination: post.category,
        duration: new Date(post.created_at).toLocaleDateString(),
        likes: post.likes_count,
        saves: 0,
        image: post.image_url || '/images/hero-japan.png',
        avatar: (post.author_name||'U').charAt(0),
      })));
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <img src="/images/hero-paris.png" alt="Community" className="img-cover" />
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-3 block">Community</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-luxury-white text-shadow-hero">Explore</h1>
            <p className="font-body text-sm text-white/50 mt-3 max-w-lg">Discover inspiring journeys from our community of luxury travelers around the world.</p>
            <button onClick={() => setPostModal(true)} className="btn-primary mt-4 self-start">
              + Share Your Journey
            </button>
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((c, i) => (
            <button key={c} className={`px-5 py-2.5 rounded-full font-body text-sm whitespace-nowrap transition-all duration-300 ${
              i === 0 ? 'bg-luxury-gold text-luxury-black font-semibold' : 'glass text-white/60 hover:text-luxury-white'}`}>{c}</button>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {posts.map((trip, i) => {
            const heights = ['h-72', 'h-96', 'h-80', 'h-88', 'h-72', 'h-96'];
            return (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                className="break-inside-avoid">
                <motion.div whileHover={{ y: -6 }} className={`relative ${heights[i % heights.length]} rounded-2xl overflow-hidden group cursor-pointer`}>
                  <img src={trip.image} alt={trip.trip} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 overlay-cinematic opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <button className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4 text-luxury-white" />
                    </button>
                    <button className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Bookmark className="w-4 h-4 text-luxury-white" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{trip.avatar}</span>
                      <span className="font-body text-xs text-white/60">{trip.user}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-luxury-white mb-1">{trip.trip}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-luxury-gold" /><span className="font-body text-[10px] text-white/50">{trip.destination}</span></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-white/30" /><span className="font-body text-[10px] text-white/50">{trip.duration}</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-white/30" /><span className="font-body text-[10px] text-white/50">{trip.likes.toLocaleString()}</span></span>
                      <span className="flex items-center gap-1"><Bookmark className="w-3 h-3 text-white/30" /><span className="font-body text-[10px] text-white/50">{trip.saves.toLocaleString()}</span></span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {postModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 520, backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#faf9f6' }}>Share Your Journey</h2>
              <button onClick={() => setPostModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            {['title', 'body'].map(field => (
              <div key={field} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>{field === 'title' ? 'Title' : 'Your Story'}</label>
                {field === 'body' ? (
                  <textarea value={postForm[field]} onChange={e => setPostForm(f => ({...f, [field]: e.target.value}))} rows={4} className="input-luxury w-full" style={{ resize: 'vertical', minHeight: 100 }} placeholder="Share your travel story..." />
                ) : (
                  <input type="text" value={postForm[field]} onChange={e => setPostForm(f => ({...f, [field]: e.target.value}))} className="input-luxury w-full" placeholder="Amazing sunset in Santorini..." />
                )}
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Category</label>
                <select value={postForm.category} onChange={e => setPostForm(f => ({...f, category: e.target.value}))} className="input-luxury w-full">
                  <option value="experience">Experience</option>
                  <option value="tip">Travel Tip</option>
                  <option value="photo">Photo</option>
                  <option value="review">Review</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Image URL</label>
                <input type="url" value={postForm.image_url} onChange={e => setPostForm(f => ({...f, image_url: e.target.value}))} className="input-luxury w-full" placeholder="https://..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setPostModal(false)} className="btn-secondary text-sm py-2.5 px-6">Cancel</button>
              <button onClick={submitPost} disabled={submitting} className="btn-primary text-sm py-2.5 px-6">{submitting ? 'Posting...' : 'Post'}</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
