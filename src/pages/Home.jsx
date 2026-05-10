import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import DestinationCard from '../components/DestinationCard';
import { API } from '../services/api';

const heroStats = [
  { icon: '🌏', label: '120+', sub: 'destinations' },
  { icon: '📅', label: '10K+', sub: 'itineraries' },
  { icon: '📸', label: 'infinite', sub: 'memories' },
  { icon: '🏔️', label: 'premium', sub: 'experiences' },
  { icon: '✨', label: 'curated', sub: 'journeys' },
];

const toDestination = (c) => ({
  id: c.city_id,
  name: c.city_name,
  country: c.country_name,
  image: c.image_url || '/images/hero-bali.png',
  rating: ((c.popularity_score || 50) / 10).toFixed(1),
  trips: Math.floor((c.popularity_score || 50) * 30),
  category: 'Culture',
  description: c.description || `Discover the beauty of ${c.city_name}.`,
  tagline: `~$${c.avg_daily_cost}/day`,
});

export default function Home() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);

  const [destinations, setDestinations] = useState([]);
  const [featuredTrips, setFeaturedTrips] = useState([]);

  useEffect(() => {
    API.get('/api/cities?limit=6').then(data => {
      const list = Array.isArray(data) ? data : (data?.cities || []);
      setDestinations(list.map(toDestination));
    });
    API.get('/api/trips').then(data => {
      if (!data) return;
      const all = [
        ...(data.ongoing || []).map(t => ({ ...t, status: 'in-progress' })),
        ...(data.upcoming || []).map(t => ({ ...t, status: 'upcoming' })),
      ];
      setFeaturedTrips(all.slice(0, 3));
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img src="/images/hero-india.png" alt="Explore the World" className="img-cover object-cover object-center" />
        </motion.div>
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        <motion.div style={{ opacity: heroOpacity }} className="relative h-full flex flex-col justify-between px-6 lg:px-12 pt-28 pb-12">
          <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <span className="font-body text-label uppercase tracking-[0.3em] text-luxury-gold mb-6 block">Premium Travel Planning</span>
              <h1 className="font-display text-hero text-luxury-white text-shadow-hero mb-6 max-w-4xl tracking-tight">EXPLORE</h1>
              <p className="font-body text-lg text-white/60 max-w-xl leading-relaxed mb-10">
                Discover the perfect harmony of pristine landscapes, vibrant cultures, and hidden gems. A journey curated for the extraordinary traveler.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="flex flex-wrap items-end gap-3">
              {heroStats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                  className="glass px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-500 cursor-default">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="font-body text-sm font-medium text-luxury-white leading-tight">{s.label}</p>
                    {s.sub && <p className="font-body text-[10px] text-white/40">{s.sub}</p>}
                  </div>
                </motion.div>
              ))}
              <Link to="/create-trip" className="inline-flex items-center gap-2 px-8 py-3 bg-luxury-white text-luxury-black font-body font-semibold text-sm rounded-full hover:bg-white/90 transition-all duration-500 hover:scale-105">
                Book <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
            {['◎', '◉', '◈'].map((ic, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/explore" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/30 hover:text-luxury-gold transition-all duration-300 text-xs">{ic}</Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-1 h-1 rounded-full bg-luxury-gold" />
          </div>
        </motion.div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="Destinations" title="Discover Extraordinary Places" subtitle="Curated destinations for the modern luxury traveler" />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => <DestinationCard key={d.id} destination={d} size={i === 0 ? 'large' : 'default'} index={i} />)}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/explore" className="inline-flex items-center gap-2 font-body text-sm text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300 group">
              View all destinations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="section-line max-w-7xl mx-auto" />

      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="Featured" title="Curated Journeys" subtitle="Handpicked itineraries crafted by our community of luxury travelers" />
          <div className="mt-16 flex gap-6 overflow-x-auto no-scrollbar pb-4">
            {featuredTrips.length > 0 ? featuredTrips.map((trip, i) => {
              const image = trip.cover_image || `https://picsum.photos/seed/${trip.trip_id}/800/600`;
              const dateStr = trip.start_date
                ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '';
              return (
                <motion.div key={trip.trip_id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="flex-shrink-0 w-80">
                  <Link to={`/trip/view?id=${trip.trip_id}`} className="group block">
                    <div className="relative h-52 rounded-t-2xl overflow-hidden">
                      <img src={image} alt={trip.title} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 overlay-cinematic" />
                      <div className="absolute top-3 right-3 glass px-2.5 py-1 rounded-full"><span className="font-body text-[10px] font-medium text-luxury-white">{dateStr}</span></div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1"><Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" /><span className="font-body text-xs text-luxury-white">{trip.status.replace('-', ' ')}</span></div>
                    </div>
                    <div className="glass-elevated rounded-b-2xl p-5 rounded-t-none">
                      <h3 className="font-display text-lg font-semibold text-luxury-white mb-1.5">{trip.title}</h3>
                      <p className="font-body text-xs text-white/40 mb-3 line-clamp-2">{trip.description || `A wonderful journey`}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><span className="text-base">✈️</span><span className="font-body text-xs text-white/50">{trip.stop_count ? `${trip.stop_count} stops` : 'Trip'}</span></div>
                        <span className="font-body text-sm font-semibold text-luxury-gold">{trip.total_budget ? `$${trip.total_budget}` : '—'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            }) : (
              <div className="w-full py-8 text-center">
                <p className="font-body text-sm text-white/30">No featured trips yet. <Link to="/create-trip" className="text-luxury-gold hover:underline">Create your first trip!</Link></p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0"><img src="/images/hero-bali.png" alt="Bali" className="img-cover" /><div className="absolute inset-0 bg-black/60" /></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-body text-label uppercase tracking-[0.3em] text-luxury-gold mb-6 block">Begin Your Journey</span>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-luxury-white text-shadow-hero mb-6">Where Will You<span className="block text-gold-gradient">Go Next?</span></h2>
            <p className="font-body text-lg text-white/50 max-w-xl mx-auto mb-10">Join thousands of luxury travelers who craft their perfect journeys with Traveloop.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create-trip" className="btn-primary"><Sparkles className="w-4 h-4" />Start Planning</Link>
              <Link to="/community" className="btn-secondary"><Play className="w-4 h-4" />Explore Community</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ v: '50K+', l: 'Travelers' }, { v: '120+', l: 'Destinations' }, { v: '4.9', l: 'Rating' }, { v: '10K+', l: 'Itineraries' }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="font-display text-4xl lg:text-5xl font-bold text-gold-gradient mb-2">{s.v}</p>
              <p className="font-body text-sm text-white/40 uppercase tracking-wider">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
