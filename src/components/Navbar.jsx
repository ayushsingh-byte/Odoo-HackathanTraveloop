import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, Search } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'My Trips', path: '/my-trips' },
  { name: 'Community', path: '/community' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-peach flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Globe className="w-5 h-5 text-luxury-black" />
              </div>
              <span className="font-display text-xl font-semibold tracking-wide text-luxury-white">
                Traveloop
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative font-body text-sm tracking-wide transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-luxury-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-luxury-gold"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/explore" className="p-2.5 rounded-full hover:bg-white/5 transition-colors duration-300 group" aria-label="Search">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Search className="w-4.5 h-4.5 text-white/60 group-hover:text-luxury-gold" />
                </motion.div>
              </Link>
              <Link
                to="/profile"
                className="p-2.5 rounded-full hover:bg-white/5 transition-colors duration-300 group"
                aria-label="Profile"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <User className="w-4.5 h-4.5 text-white/60 group-hover:text-luxury-gold" />
                </motion.div>
              </Link>
              <Link to="/create-trip" className="btn-primary text-xs py-2.5 px-6">
                <motion.span whileHover={{ x: 3 }} className="flex items-center gap-2">Plan a Trip</motion.span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-luxury-white" />
              ) : (
                <Menu className="w-6 h-6 text-luxury-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-luxury-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block font-display text-3xl font-medium transition-colors duration-300 ${
                      location.pathname === link.path
                        ? 'text-luxury-gold'
                        : 'text-luxury-white hover:text-luxury-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-white/10"
              >
                <Link to="/create-trip" className="btn-primary w-full justify-center">
                  Plan a Trip
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/profile"
                  className="flex items-center gap-3 text-white/60 hover:text-white/80 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-body text-sm">Profile</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
