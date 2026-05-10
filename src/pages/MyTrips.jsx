import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Clock, ArrowUpRight, Filter } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { featuredTrips } from '../data/mockData';

const filters = ['All', 'Upcoming', 'In Progress', 'Completed'];

const trips = [
  { ...featuredTrips[0], status: 'upcoming', dates: 'Oct 15 – Oct 25, 2025' },
  { ...featuredTrips[1], status: 'completed', dates: 'Aug 5 – Aug 12, 2025' },
  { ...featuredTrips[2], status: 'in-progress', dates: 'Sep 1 – Sep 6, 2025' },
  { ...featuredTrips[3], status: 'upcoming', dates: 'Nov 20 – Dec 2, 2025' },
  { ...featuredTrips[4], status: 'completed', dates: 'Jul 10 – Jul 18, 2025' },
];

const statusColors = {
  upcoming: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'in-progress': 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

export default function MyTrips() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? trips : trips.filter(t =>
    t.status === active.toLowerCase().replace(' ', '-')
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-3 block">Your Collection</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white">My Trips</h1>
          </div>
          <Link to="/create-trip" className="btn-primary self-start md:self-auto">+ New Trip</Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-5 py-2.5 rounded-full font-body text-sm whitespace-nowrap transition-all duration-300 ${
                active === f ? 'bg-luxury-gold text-luxury-black font-semibold' : 'glass text-white/60 hover:text-luxury-white hover:bg-white/8'
              }`}>{f}</button>
          ))}
        </div>

        {/* Trip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip, i) => (
            <motion.div key={trip.id + trip.status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
              <Link to="/timeline" className="group block">
                <div className="relative h-56 rounded-t-2xl overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 overlay-cinematic" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full border font-body text-[10px] uppercase tracking-wider ${statusColors[trip.status]}`}>{trip.status.replace('-', ' ')}</span>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4 text-luxury-white" />
                  </div>
                </div>
                <div className="glass-elevated rounded-b-2xl p-5 rounded-t-none">
                  <h3 className="font-display text-xl font-semibold text-luxury-white mb-2">{trip.title}</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/40" /><span className="font-body text-xs text-white/50">{trip.dates}</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-luxury-gold" /><span className="font-body text-xs text-white/50">{trip.destinations.join(' → ')}</span></div>
                    <span className="font-body text-sm font-semibold text-luxury-gold">{trip.price}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
