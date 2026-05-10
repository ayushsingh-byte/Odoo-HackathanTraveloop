import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MapPin, Clock } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';
import { communityTrips } from '../data/mockData';

const categories = ['All', 'Trending', 'Asia', 'Europe', 'Adventure', 'Culture'];

export default function CommunityExplore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedTrips, setLikedTrips] = useState(new Set());
  const [savedTrips, setSavedTrips] = useState(new Set());

  const toggleLike = (id) => {
    const newLiked = new Set(likedTrips);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedTrips(newLiked);
  };

  const toggleSave = (id) => {
    const newSaved = new Set(savedTrips);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedTrips(newSaved);
  };

  const filteredTrips = activeCategory === 'All' 
    ? communityTrips 
    : communityTrips.filter(t => t.destination.includes(activeCategory) || activeCategory === 'Trending');
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <img src="/images/hero-paris.png" alt="Community" className="img-cover" />
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-3 block">Community</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-luxury-white text-shadow-hero">Explore</h1>
            <p className="font-body text-sm text-white/50 mt-3 max-w-lg">Discover inspiring journeys from our community of luxury travelers around the world.</p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <motion.button 
              key={c} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2.5 rounded-full font-body text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategory === c ? 'bg-luxury-gold text-luxury-black font-semibold' : 'glass text-white/60 hover:text-luxury-white'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredTrips.map((trip, i) => {
            const heights = ['h-72', 'h-96', 'h-80', 'h-88', 'h-72', 'h-96'];
            const isLiked = likedTrips.has(trip.id);
            const isSaved = savedTrips.has(trip.id);
            
            return (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                className="break-inside-avoid">
                <motion.div whileHover={{ y: -6 }} className={`relative ${heights[i % heights.length]} rounded-2xl overflow-hidden group cursor-pointer`}>
                  <Link to="/shared/1">
                    <img src={trip.image} alt={trip.trip} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 overlay-cinematic opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  </Link>

                  {/* Top Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.preventDefault(); toggleLike(trip.id); }}
                      className={`w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors ${isLiked ? 'bg-luxury-gold/20' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'text-luxury-gold fill-luxury-gold' : 'text-luxury-white'}`} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.preventDefault(); toggleSave(trip.id); }}
                      className={`w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors ${isSaved ? 'bg-luxury-gold/20' : ''}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'text-luxury-gold fill-luxury-gold' : 'text-luxury-white'}`} />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <Link to="/shared/1" className="absolute bottom-0 left-0 right-0 p-5">
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
                      <span className="flex items-center gap-1"><Heart className={`w-3 h-3 ${isLiked ? 'text-luxury-gold fill-luxury-gold' : 'text-white/30'}`} /><span className="font-body text-[10px] text-white/50">{(trip.likes + (isLiked ? 1 : 0)).toLocaleString()}</span></span>
                      <span className="flex items-center gap-1"><Bookmark className={`w-3 h-3 ${isSaved ? 'text-luxury-gold fill-luxury-gold' : 'text-white/30'}`} /><span className="font-body text-[10px] text-white/50">{(trip.saves + (isSaved ? 1 : 0)).toLocaleString()}</span></span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
