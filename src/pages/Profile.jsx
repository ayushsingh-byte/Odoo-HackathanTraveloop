import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera, Globe, Award, Heart, Settings, LogOut } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { userProfile, destinations } from '../data/mockData';

const { badges } = userProfile;

export default function Profile() {
  const { user, logout } = useAuth();

  const name = user?.name || 'Traveler';
  const handle = `@${user?.email?.split('@')[0] || 'traveler'}`;
  const bio = user?.additional_info || 'Wandering the world one sunset at a time.';
  const location = user?.city_name && user?.country_name ? `${user.city_name}, ${user.country_name}` : 'Worldwide';
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear().toString() : '2024';

  const [stats, setStats] = useState({ trips: 0, countries: 0, photos: 0, followers: 0, following: 0 });

  useEffect(() => {
    if (!user) return;
    API.get('/api/trips').then(d => {
      const total = (d.ongoing || []).length + (d.upcoming || []).length + (d.completed || []).length;
      setStats(s => ({ ...s, trips: total }));
    });
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <img src="/images/hero-iceland.png" alt="Profile" className="img-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
      </section>

      <section className="px-6 lg:px-8 -mt-24 relative z-10 pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <div className="w-28 h-28 rounded-full glass-gold flex items-center justify-center text-5xl shrink-0 border-2 border-luxury-gold/30">
              ✨
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-luxury-white mb-1">{name}</h1>
              <p className="font-body text-sm text-luxury-gold mb-3">{handle}</p>
              <p className="font-body text-sm text-white/50 max-w-lg mb-4">{bio}</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/30" /><span className="font-body text-xs text-white/40">{location}</span></span>
                <span className="font-body text-xs text-white/30">Member since {memberSince}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline text-xs py-2 px-5" onClick={logout}><LogOut className="w-3.5 h-3.5" />Logout</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
            {[
              { v: stats.trips, l: 'Trips' }, { v: stats.countries, l: 'Countries' },
              { v: stats.photos.toLocaleString(), l: 'Photos' }, { v: stats.followers.toLocaleString(), l: 'Followers' },
              { v: stats.following, l: 'Following' },
            ].map((s, i) => (
              <GlassCard key={i} className="text-center" padding="p-5">
                <p className="font-display text-2xl font-bold text-gold-gradient mb-1">{s.v}</p>
                <p className="font-body text-xs text-white/40 uppercase tracking-wider">{s.l}</p>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12">
            <h2 className="font-display text-xl font-semibold text-luxury-white mb-6">Travel Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((b, i) => (
                <GlassCard key={i} variant="gold" padding="p-5 text-center">
                  <span className="text-3xl mb-3 block">{b.icon}</span>
                  <h3 className="font-body text-sm font-semibold text-luxury-white mb-1">{b.name}</h3>
                  <p className="font-body text-[10px] text-white/40">{b.description}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 className="font-display text-xl font-semibold text-luxury-white mb-6">Saved Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.slice(0, 3).map((d, i) => (
                <motion.div key={d.id} whileHover={{ y: -4 }} className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer">
                  <img src={d.image} alt={d.name} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 overlay-cinematic" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-lg font-semibold text-luxury-white">{d.name}</h3>
                    <p className="font-body text-xs text-white/50">{d.country}</p>
                  </div>
                  <div className="absolute top-3 right-3"><Heart className="w-4 h-4 text-luxury-gold fill-luxury-gold" /></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
