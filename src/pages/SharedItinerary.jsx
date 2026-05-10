import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, Plane, Car, Hotel, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';

const timeline = [
  { days: 'Days 1–3', city: 'Dehradun', image: '/images/hero-dehradun.png', desc: 'Robber\'s Cave, Forest Research Institute, local cafes.' },
  { days: 'Days 4–6', city: 'Mussoorie', image: '/images/hero-india.png', desc: 'Mall Road, Kempty Falls, misty mountain views.' },
  { days: 'Days 7–10', city: 'Rishikesh', image: '/images/city-temple.png', desc: 'Ancient temples, Ganga Aarti, yoga retreats.' },
];

const included = [
  { icon: '👨‍🏫', title: 'Guides', desc: '2 local guides who know every hidden trail in Uttarakhand!' },
  { icon: '✈️', title: 'Flights', desc: 'Routes: Delhi — Dehradun (Jolly Grant Airport)' },
  { icon: '🚗', title: 'Transfers', desc: 'Luxury SUVs for smooth mountain travel' },
  { icon: '🏨', title: 'Hotels', desc: 'Premium boutique hotels and eco-resorts (breakfasts included)' },
];

const gallery = [
  '/images/hero-dehradun.png', '/images/hero-india.png', '/images/city-temple.png',
  '/images/city-jaipur.png', '/images/hero-bali.png',
];

export default function SharedItinerary() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.15]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* MASSIVE HERO */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img src="/images/hero-dehradun.png" alt="Dehradun" className="img-cover" />
        </motion.div>
        <div className="absolute inset-0 overlay-cinematic" />

        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-16">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <h1 className="font-display text-[clamp(4rem,10vw,10rem)] font-bold text-luxury-white text-shadow-hero leading-[0.85] mb-8">DEHRADUN</h1>
          </motion.div>

          {/* Floating gallery strip */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {gallery.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}
                className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-white/10 hover:border-luxury-gold/30 transition-all duration-500 cursor-pointer">
                <img src={img} alt="" className="img-cover hover:scale-110 transition-transform duration-700" />
              </motion.div>
            ))}
            <Link to="/create-trip" className="flex-shrink-0 flex items-center gap-2 px-6 py-2 bg-luxury-white text-luxury-black font-body font-semibold text-sm rounded-xl hover:bg-white/90 transition-all duration-500">
              Book <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ABOUT THE TOUR */}
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="About the Tour" />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Description */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="font-body text-base text-white/60 leading-relaxed mb-8">
                We've planned a tranquil 10-day retreat for your trip to Uttarakhand. You'll visit three incredible destinations:
                <span className="text-luxury-gold"> Dehradun, Mussoorie, and Rishikesh.</span>
              </p>
              <p className="font-body text-base text-white/50 leading-relaxed">
                No need to worry about routes, schedules, or finding places — everything is already organized. We'll show you where to go, what to see, and where to eat, so you can simply <em className="text-luxury-white not-italic font-medium">enjoy the mountain breeze.</em>
              </p>
              <div className="flex items-center gap-6 mt-10">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-luxury-gold" /><span className="font-body text-sm text-white/60">10 Days</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-luxury-gold" /><span className="font-body text-sm text-white/60">2 Travelers</span></div>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" /><span className="font-body text-sm text-white/60">4.9</span></div>
              </div>
            </motion.div>

            {/* Right: Timeline */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[45%] top-0 bottom-0 w-px bg-white/10" />

                {timeline.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                    className={`flex items-center gap-6 mb-12 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    {/* Text */}
                    <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <p className="font-body text-xs text-luxury-gold mb-1">{item.days}</p>
                      <h3 className="font-display text-2xl font-semibold text-luxury-white">{item.city}</h3>
                    </div>
                    {/* Dot */}
                    <div className="relative z-10 w-3 h-3 rounded-full bg-luxury-gold shadow-[0_0_15px_rgba(201,168,76,0.4)]" />
                    {/* Image */}
                    <div className="flex-1">
                      <div className="w-full h-28 rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.city} className="img-cover" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH CINEMATIC IMAGE */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img src="/images/hero-india.png" alt="Mussoorie" className="img-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/30" />
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="What's Included" />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="h-full hover:border-luxury-gold/20">
                  <span className="text-2xl mb-4 block">{item.icon}</span>
                  <h3 className="font-display text-lg font-semibold text-luxury-white mb-2">{item.title}</h3>
                  <p className="font-body text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ANOTHER CINEMATIC IMAGE */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <img src="/images/city-temple.png" alt="Rishikesh" className="img-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/30" />
      </section>

      {/* CONTACT / INQUIRY */}
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-luxury-white mb-4">
              Want to join us,<br />but still have questions?
            </h2>
            <p className="font-body text-sm text-white/40 mb-8">Leave a request</p>
            <form className="space-y-4 max-w-md">
              <input type="text" placeholder="Your name" className="input-luxury" />
              <input type="tel" placeholder="Phone number" className="input-luxury" />
              <textarea placeholder="Comment" rows={3} className="input-luxury resize-none" />
              <button type="button" className="w-full py-3.5 bg-luxury-white text-luxury-black font-body font-semibold text-sm rounded-xl hover:bg-white/90 transition-all duration-500">
                Send
              </button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="hidden lg:block">
            <div className="h-96 rounded-2xl overflow-hidden">
              <img src="/images/hero-dehradun.png" alt="Dehradun" className="img-cover" />
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
