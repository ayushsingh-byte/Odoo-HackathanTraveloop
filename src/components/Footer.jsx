import { Link } from 'react-router-dom';
import { Globe, Instagram, Twitter, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Explore: [
    { name: 'Destinations', path: '/explore' },
    { name: 'Activities', path: '/activities' },
    { name: 'Community', path: '/community' },
    { name: 'Featured Trips', path: '/community' },
  ],
  Plan: [
    { name: 'Create Trip', path: '/create-trip' },
    { name: 'My Trips', path: '/my-trips' },
    { name: 'Itinerary Builder', path: '/itinerary' },
    { name: 'Packing Lists', path: '/packing' },
  ],
  Company: [
    { name: 'About Us', path: '/' },
    { name: 'Careers', path: '/' },
    { name: 'Press', path: '/' },
    { name: 'Contact', path: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-peach flex items-center justify-center">
                <Globe className="w-5 h-5 text-luxury-black" />
              </div>
              <span className="font-display text-xl font-semibold text-luxury-white">
                Traveloop
              </span>
            </Link>
            <p className="text-white/40 font-body text-sm leading-relaxed max-w-xs mb-8">
              Craft extraordinary journeys with cinematic precision. Premium travel planning for the modern explorer.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-luxury-gold hover:border-luxury-gold/20 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-body text-label uppercase text-luxury-gold tracking-widest mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="font-body text-sm text-white/40 hover:text-luxury-white transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 font-body text-xs">
            © 2025 Traveloop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/20 font-body text-xs hover:text-white/40 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
