import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/mockData';

const categories = ['All', 'Culture', 'Beach', 'Adventure', 'Mountains', 'Urban'];

export default function CitySearch() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('All');

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchCat = active === 'All' || d.category === active;
    return matchSearch && matchCat;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Banner */}
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

      {/* Search + Filter */}
      <section className="px-6 lg:px-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-elevated p-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="input-luxury pl-11 w-full" />
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

      {/* Results Grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-sm text-white/40 mb-8">{filtered.length} destinations found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => <DestinationCard key={d.id} destination={d} index={i} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-white/20 mb-2">No destinations found</p>
              <p className="font-body text-sm text-white/30">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
