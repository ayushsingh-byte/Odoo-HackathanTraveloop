import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Clock, DollarSign, MapPin, Calendar, Plane, Hotel, Utensils, Camera, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { itineraryData } from '../data/mockData';

const navItems = ['Overview', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
const typeIcons = { transport: Plane, hotel: Hotel, activity: Camera };

export default function ItineraryWorkspace() {
  const [activeDay, setActiveDay] = useState(0);
  const { tripName, destination, dates, days, budget, totalBudget, spent } = itineraryData;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20 min-h-screen">
      {/* Top Bar */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden"><img src="/images/hero-india.png" alt="" className="img-cover" /></div>
            <div><h1 className="font-display text-lg font-semibold text-luxury-white">{tripName}</h1><p className="font-body text-xs text-white/40">{dates}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/timeline" className="btn-outline text-xs py-2 px-4">Timeline View</Link>
            <Link to="/packing" className="btn-outline text-xs py-2 px-4">Packing</Link>
            <Link to="/shared/1" className="btn-primary text-xs py-2 px-4">Share</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-8rem)]">
        {/* LEFT: Navigation */}
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-56 shrink-0 border-r border-white/5 p-4 overflow-y-auto hidden lg:block">
          <p className="font-body text-label uppercase tracking-[0.15em] text-white/30 mb-4 px-3">Trip Days</p>
          {navItems.map((item, i) => (
            <button key={i} onClick={() => setActiveDay(i)}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-sm mb-1 transition-all duration-300 flex items-center gap-3 ${
                activeDay === i ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20' : 'text-white/50 hover:text-luxury-white hover:bg-white/5'}`}>
              {i === 0 ? <Calendar className="w-4 h-4 shrink-0" /> : <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] shrink-0">{i}</span>}
              {item}
            </button>
          ))}
          <button className="w-full text-left px-3 py-2.5 rounded-xl font-body text-sm text-white/30 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all duration-300 flex items-center gap-3 mt-2">
            <Plus className="w-4 h-4" /> Add Day
          </button>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="font-body text-label uppercase tracking-[0.15em] text-white/30 mb-4 px-3">Quick Links</p>
            {[{ l: 'Notes', p: '/notes' }, { l: 'Budget', p: '/timeline' }, { l: 'Packing', p: '/packing' }].map(lnk => (
              <Link key={lnk.l} to={lnk.p} className="block px-3 py-2 rounded-xl font-body text-sm text-white/40 hover:text-luxury-white hover:bg-white/5 transition-all duration-300">{lnk.l}</Link>
            ))}
          </div>
        </motion.aside>

        {/* CENTER: Timeline */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeDay === 0 ? (
            /* Overview */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="overview">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-8">
                <img src="/images/hero-india.png" alt="Japan" className="img-cover" />
                <div className="absolute inset-0 overlay-cinematic" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="font-display text-3xl font-bold text-luxury-white">{tripName}</h2>
                  <p className="font-body text-sm text-white/50">{destination} · {dates}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {days.map((day, i) => (
                  <GlassCard key={i} hover onClick={() => setActiveDay(i + 1)} className="cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0"><img src={day.image} alt="" className="img-cover" /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body text-[10px] text-luxury-gold uppercase tracking-wider">Day {day.day}</span>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-luxury-gold transition-colors" />
                        </div>
                        <h3 className="font-display text-base font-semibold text-luxury-white mb-1">{day.title}</h3>
                        <p className="font-body text-xs text-white/40">{day.city} · {day.activities.length} activities</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Day View */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`day-${activeDay}`}>
              {days[activeDay - 1] && (() => {
                const day = days[activeDay - 1];
                return (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-xl overflow-hidden"><img src={day.image} alt="" className="img-cover" /></div>
                      <div>
                        <span className="font-body text-[10px] text-luxury-gold uppercase tracking-wider">Day {day.day} · {day.date}</span>
                        <h2 className="font-display text-2xl font-semibold text-luxury-white">{day.title}</h2>
                        <p className="font-body text-xs text-white/40">{day.city}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative ml-4 border-l border-white/10 pl-8 space-y-4">
                      {day.activities.map((act, j) => {
                        const Icon = typeIcons[act.type] || Camera;
                        return (
                          <motion.div key={j} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.1 }}>
                            <div className="absolute -left-[5px]" style={{ top: `${j * 92 + 8}px` }}>
                              <div className="w-2.5 h-2.5 rounded-full bg-luxury-gold shadow-[0_0_10px_rgba(201,168,76,0.3)]" />
                            </div>
                            <GlassCard padding="p-4" className="flex items-center gap-4 group hover:border-luxury-gold/20">
                              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                                <span className="text-lg">{act.icon}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Clock className="w-3 h-3 text-white/30" />
                                  <span className="font-body text-[10px] text-white/40">{act.time}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-body ${
                                    act.type === 'hotel' ? 'bg-blue-400/10 text-blue-400' :
                                    act.type === 'transport' ? 'bg-purple-400/10 text-purple-400' :
                                    'bg-luxury-gold/10 text-luxury-gold'}`}>{act.type}</span>
                                </div>
                                <h4 className="font-body text-sm font-medium text-luxury-white">{act.name}</h4>
                              </div>
                              {act.cost > 0 && (
                                <span className="font-body text-sm font-semibold text-luxury-gold">${act.cost}</span>
                              )}
                            </GlassCard>
                          </motion.div>
                        );
                      })}
                    </div>

                    <button className="mt-6 ml-12 flex items-center gap-2 font-body text-sm text-white/30 hover:text-luxury-gold transition-colors duration-300">
                      <Plus className="w-4 h-4" /> Add activity
                    </button>
                  </>
                );
              })()}
            </motion.div>
          )}
        </main>

        {/* RIGHT: Budget Panel */}
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-72 shrink-0 border-l border-white/5 p-6 overflow-y-auto hidden xl:block">
          <h3 className="font-display text-lg font-semibold text-luxury-white mb-6">Budget</h3>
          
          {/* Budget Ring */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#goldGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(spent / totalBudget) * 264} 264`} />
              <defs><linearGradient id="goldGrad"><stop offset="0%" stopColor="#c9a84c" /><stop offset="100%" stopColor="#e8a87c" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-luxury-white">{Math.round((spent / totalBudget) * 100)}%</span>
              <span className="font-body text-[10px] text-white/40">spent</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 text-center">
            <div><p className="font-body text-xs text-white/40">Total</p><p className="font-body text-sm font-semibold text-luxury-white">${totalBudget.toLocaleString()}</p></div>
            <div><p className="font-body text-xs text-white/40">Spent</p><p className="font-body text-sm font-semibold text-luxury-gold">${spent.toLocaleString()}</p></div>
            <div><p className="font-body text-xs text-white/40">Left</p><p className="font-body text-sm font-semibold text-emerald-400">${(totalBudget - spent).toLocaleString()}</p></div>
          </div>

          <div className="section-line mb-6" />

          {/* Breakdown */}
          <div className="space-y-3">
            {Object.entries(budget).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-xs text-white/50 capitalize">{key}</span>
                  <span className="font-body text-xs text-luxury-white">${val.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach" style={{ width: `${(val / totalBudget) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
