import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, DollarSign, Star, MapPin } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { activities } from '../data/mockData';

const categories = ['All', 'Culture', 'Adventure', 'Food', 'Wellness', 'Nightlife'];

export default function ActivitySearch() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('All');

  const filtered = activities.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = active === 'All' || a.category === active;
    return matchSearch && matchCat;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src="/images/activity-hiking.png" alt="Activities" className="img-cover" />
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-16 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-4 block">Experiences</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-luxury-white text-shadow-hero">Find Activities</h1>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="px-6 lg:px-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-elevated p-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} className="input-luxury pl-11 w-full" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
              {categories.map(c => (
                <button key={c} onClick={() => setActive(c)}
                  className={`px-4 py-2.5 rounded-full font-body text-xs whitespace-nowrap transition-all duration-300 ${
                    active === c ? 'bg-luxury-gold text-luxury-black font-semibold' : 'glass text-white/60 hover:text-luxury-white'
                  }`}>{c}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activity Cards */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-sm text-white/40 mb-8">{filtered.length} activities found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((act, i) => (
              <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="group cursor-pointer">
                <div className="relative h-52 rounded-t-2xl overflow-hidden">
                  <img src={act.image} alt={act.name} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 overlay-cinematic" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full glass text-[10px] font-body uppercase tracking-wider text-white/70">{act.category}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 glass px-2 py-1 rounded-full"><Clock className="w-3 h-3 text-white/50" /><span className="font-body text-[10px] text-white/70">{act.duration}</span></span>
                      <span className="flex items-center gap-1 glass px-2 py-1 rounded-full"><DollarSign className="w-3 h-3 text-luxury-gold" /><span className="font-body text-[10px] text-white/70">{act.price}</span></span>
                    </div>
                  </div>
                </div>
                <div className="glass-elevated rounded-b-2xl p-5 rounded-t-none">
                  <h3 className="font-display text-lg font-semibold text-luxury-white mb-1">{act.name}</h3>
                  <div className="flex items-center gap-1.5 mb-2"><MapPin className="w-3 h-3 text-luxury-gold" /><span className="font-body text-xs text-white/50">{act.city}</span></div>
                  <p className="font-body text-xs text-white/40 line-clamp-2">{act.description}</p>
                  <div className="flex items-center gap-1 mt-3"><Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" /><span className="font-body text-xs text-luxury-white">{act.rating}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
