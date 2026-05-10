import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, Plane, Hotel, Camera, Utensils } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import { itineraryData } from '../data/mockData';

const typeColors = {
  transport: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  hotel: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  activity: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20',
};

export default function ItineraryTimeline() {
  const { tripName, destination, dates, days, budget, totalBudget, spent } = itineraryData;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Banner */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img src="/images/hero-india.png" alt="India" className="img-cover" />
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-3 block">{destination} · {dates}</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-luxury-white text-shadow-hero mb-4">{tripName}</h1>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-white/40" /><span className="font-body text-sm text-white/50">{days.length} days</span></span>
              <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-luxury-gold" /><span className="font-body text-sm text-white/50">${totalBudget.toLocaleString()}</span></span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <SectionHeading title="Travel Timeline" align="left" className="mb-12" />
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-luxury-gold/40 via-luxury-gold/20 to-transparent" />

              {days.map((day, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="relative pl-16 mb-12">
                  {/* Day Dot */}
                  <div className="absolute left-[17px] top-2 w-5 h-5 rounded-full bg-luxury-gold shadow-[0_0_20px_rgba(201,168,76,0.3)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-luxury-black" />
                  </div>

                  {/* Day Card */}
                  <div className="glass-elevated rounded-2xl overflow-hidden">
                    <div className="relative h-40">
                      <img src={day.image} alt={day.city} className="img-cover" />
                      <div className="absolute inset-0 overlay-cinematic" />
                      <div className="absolute bottom-4 left-5">
                        <span className="font-body text-[10px] text-luxury-gold uppercase tracking-wider">Day {day.day} · {day.date}</span>
                        <h3 className="font-display text-2xl font-semibold text-luxury-white">{day.title}</h3>
                        <div className="flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-white/40" /><span className="font-body text-xs text-white/50">{day.city}</span></div>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {day.activities.map((act, j) => (
                        <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                          <span className="text-base w-8 text-center">{act.icon}</span>
                          <div className="flex-1">
                            <p className="font-body text-sm text-luxury-white">{act.name}</p>
                            <p className="font-body text-[10px] text-white/40">{act.time}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-body border ${typeColors[act.type]}`}>{act.type}</span>
                          {act.cost > 0 && <span className="font-body text-sm font-semibold text-luxury-gold">${act.cost}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Budget Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <SectionHeading title="Budget" align="left" className="mb-8" />
              <GlassCard variant="elevated" padding="p-6" className="mb-6">
                {/* Ring */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#tGold)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(spent / totalBudget) * 264} 264`} />
                    <defs><linearGradient id="tGold"><stop offset="0%" stopColor="#c9a84c" /><stop offset="100%" stopColor="#e8a87c" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-lg font-bold text-luxury-white">{Math.round((spent / totalBudget) * 100)}%</span>
                    <span className="font-body text-[9px] text-white/40">used</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                  <div><p className="font-body text-[10px] text-white/40">Total</p><p className="font-body text-sm font-semibold text-luxury-white">${totalBudget.toLocaleString()}</p></div>
                  <div><p className="font-body text-[10px] text-white/40">Spent</p><p className="font-body text-sm font-semibold text-luxury-gold">${spent.toLocaleString()}</p></div>
                  <div><p className="font-body text-[10px] text-white/40">Left</p><p className="font-body text-sm font-semibold text-emerald-400">${(totalBudget - spent).toLocaleString()}</p></div>
                </div>
                <div className="space-y-3">
                  {Object.entries(budget).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between mb-1"><span className="font-body text-xs text-white/50 capitalize">{k}</span><span className="font-body text-xs text-luxury-white">${v.toLocaleString()}</span></div>
                      <div className="w-full h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach" style={{ width: `${(v / totalBudget) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
