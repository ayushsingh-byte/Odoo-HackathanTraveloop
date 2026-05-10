import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';

export default function DestinationCard({ destination, size = 'default', index = 0, onClick }) {
  const { name, country, tagline, image, rating, trips, category } = destination;

  const sizeClasses = {
    default: 'h-80',
    large: 'h-96',
    small: 'h-64',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Link
        to={`/explore`}
        className={`group relative block ${sizeClasses[size]} rounded-2xl overflow-hidden`}
      >
        {/* Image */}
        <img
          src={image}
          alt={`${name}, ${country}`}
          className="img-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 overlay-cinematic transition-opacity duration-500" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full glass text-[10px] font-body font-medium uppercase tracking-widest text-white/70">
            {category}
          </span>
        </div>

        {/* Arrow */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <ArrowUpRight className="w-4 h-4 text-luxury-white" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3 h-3 text-luxury-gold" />
                <span className="font-body text-[11px] text-white/50 uppercase tracking-wider">
                  {country}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-luxury-white mb-1">
                {name}
              </h3>
              <p className="font-body text-xs text-white/40 line-clamp-1">
                {tagline}
              </p>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3.5 h-3.5 text-luxury-gold fill-luxury-gold" />
              <span className="font-body text-sm font-medium text-luxury-white">
                {rating}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
