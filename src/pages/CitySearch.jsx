import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import DestinationCard from '../components/DestinationCard';
import { API } from '../services/api';


const categories = ['All', 'Culture', 'Beach', 'Adventure', 'Mountains', 'Urban'];

const toDestination = (c) => ({
  id: c.city_id,
  name: c.city_name,
  country: c.country_name,
  image: c.image_url || `/images/hero-bali.png`,
  rating: (c.popularity_score / 10).toFixed(1),
  trips: Math.floor(c.popularity_score * 30),
  category: 'Culture',
  description: c.description || `Discover the beauty of ${c.city_name}.`,
  tagline: `~$${c.avg_daily_cost}/day`,
});

export default function CitySearch() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('All');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityActivities, setCityActivities] = useState([]);

  const openCity = async (city) => {
    setSelectedCity(city);
    setCityActivities([]);
    const actsData = await API.get(`/api/activities?city_id=${city.id}&limit=10`);
    setCityActivities(actsData?.activities || []);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const url = search
        ? `/api/cities?limit=24&q=${encodeURIComponent(search)}`
        : `/api/cities?limit=24`;
      API.get(url).then(data => {
        const list = Array.isArray(data) ? data : (data?.cities || []);
        setCities(list.map(toDestination));
      }).finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = active === 'All' ? cities : cities.filter(d => d.category === active);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src="/images/hero-santorini.png" alt="Explore" className="img-cover" />
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-16 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-4 block">Explore</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-luxury-white text-shadow-hero mb-6">Discover Cities</h1>
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-elevated p-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="input-luxury pl-11 w-full" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
              {categories.map(c => (
                <motion.button 
                  key={c} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive(c)}
                  className={`px-4 py-2.5 rounded-full font-body text-xs whitespace-nowrap transition-all duration-300 ${
                    active === c ? 'bg-luxury-gold text-luxury-black font-semibold' : 'glass text-white/60 hover:text-luxury-white'
                  }`}
                >
                  {c}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-sm text-white/40 mb-8">{loading ? 'Loading...' : `${filtered.length} destinations found`}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => <DestinationCard key={d.id} destination={d} index={i} onClick={() => openCity(d)} />)}
          </div>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-white/20 mb-2">No destinations found</p>
              <p className="font-body text-sm text-white/30">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {selectedCity && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedCity(null)}>
          <div style={{ background: 'rgba(12,12,12,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', backdropFilter: 'blur(30px)' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative', height: 220 }}>
              <img src={selectedCity.image} alt={selectedCity.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,12,0.9) 0%, transparent 60%)', borderRadius: '20px 20px 0 0' }} />
              <button onClick={() => setSelectedCity(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#faf9f6', margin: 0 }}>{selectedCity.name}</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '4px 0 0' }}>{selectedCity.country}</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>{selectedCity.tagline}</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>★ {selectedCity.rating}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{selectedCity.description}</p>
              {cityActivities.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#faf9f6', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Activities</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {cityActivities.map(a => (
                      <div key={a.activity_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(201,168,76,0.1)', color: '#c9a84c', borderRadius: 4, padding: '0.1rem 0.4rem', marginRight: '0.5rem' }}>{a.category_name}</span>
                          <span style={{ fontSize: '0.9rem', color: '#faf9f6', fontWeight: 500 }}>{a.activity_name}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>${a.estimated_cost}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
