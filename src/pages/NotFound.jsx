import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/images/hero-india.png" alt="Lost" className="img-cover opacity-20" />
        <div className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="w-20 h-20 mx-auto rounded-full glass-elevated flex items-center justify-center mb-8">
            <Compass className="w-10 h-10 text-luxury-gold animate-pulse-soft" />
          </div>
          <h1 className="font-display text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-luxury-peach mb-4 text-shadow-sm">
            404
          </h1>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-luxury-white mb-6">
            Off the Map
          </h2>
          <p className="font-body text-lg text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
            It looks like you've wandered into uncharted territory. The destination you're looking for doesn't exist on our map.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Return to Civilization
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
