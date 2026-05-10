import { useState } from 'react';
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
  const { tripName, destination, dates, budget, totalBudget, spent } = itineraryData;
  const [days, setDays] = useState(itineraryData.days);
  const [editingDay, setEditingDay] = useState(null);

  const handleDayChange = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const handleActivityChange = (dayIndex, actIndex, field, value) => {
    const newDays = [...days];
    newDays[dayIndex].activities[actIndex] = { ...newDays[dayIndex].activities[actIndex], [field]: value };
    setDays(newDays);
  };

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
                      <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                        <div>
                          <span className="font-body text-[10px] text-luxury-gold uppercase tracking-wider">Day {day.day} · {day.date}</span>
                          {editingDay === i ? (
                            <input type="text" value={day.title} onChange={(e) => handleDayChange(i, 'title', e.target.value)} className="block w-full bg-black/40 border-b border-luxury-gold text-luxury-white font-display text-2xl font-semibold focus:outline-none mb-1 mt-1" />
                          ) : (
                            <h3 className="font-display text-2xl font-semibold text-luxury-white">{day.title}</h3>
                          )}
                          <div className="flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-white/40" />
                            {editingDay === i ? (
                              <input type="text" value={day.city} onChange={(e) => handleDayChange(i, 'city', e.target.value)} className="bg-transparent border-b border-white/20 text-white/80 font-body text-xs focus:outline-none" />
                            ) : (
                              <span className="font-body text-xs text-white/50">{day.city}</span>
                            )}
                          </div>
                        </div>
                        <button onClick={() => setEditingDay(editingDay === i ? null : i)} className="btn-outline text-[10px] px-3 py-1.5 backdrop-blur-md bg-black/20 hover:bg-luxury-gold hover:text-luxury-black transition-colors">{editingDay === i ? 'Save' : 'Edit'}</button>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {day.activities.map((act, j) => (
                        <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                          <span className="text-base w-8 text-center">{act.icon}</span>
                          <div className="flex-1">
                            {editingDay === i ? (
                              <>
                                <input type="text" value={act.name} onChange={(e) => handleActivityChange(i, j, 'name', e.target.value)} className="block w-full bg-transparent border-b border-white/20 text-luxury-white font-body text-sm focus:outline-none focus:border-luxury-gold mb-1" />
                                <input type="text" value={act.time} onChange={(e) => handleActivityChange(i, j, 'time', e.target.value)} className="block w-20 bg-transparent border-b border-white/20 text-white/40 font-body text-[10px] focus:outline-none" />
                              </>
                            ) : (
                              <>
                                <p className="font-body text-sm text-luxury-white">{act.name}</p>
                                <p className="font-body text-[10px] text-white/40">{act.time}</p>
                              </>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-body border ${typeColors[act.type]}`}>{act.type}</span>
                          {editingDay === i ? (
                            <div className="flex items-center"><span className="text-luxury-gold font-body text-sm mr-1">$</span><input type="number" value={act.cost} onChange={(e) => handleActivityChange(i, j, 'cost', Number(e.target.value))} className="w-12 bg-transparent border-b border-white/20 text-luxury-gold font-body text-sm font-semibold focus:outline-none text-right" /></div>
                          ) : (
                            act.cost > 0 && <span className="font-body text-sm font-semibold text-luxury-gold">${act.cost}</span>
                          )}
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
              <SectionHeading title="Budget Overview" align="left" className="mb-6" />
              
              {/* Premium Budget Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <GlassCard padding="p-4" className="flex flex-col justify-center items-center text-center">
                  <p className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Limit</p>
                  <p className="font-display text-xl font-semibold text-luxury-white">${totalBudget.toLocaleString()}</p>
                </GlassCard>
                <GlassCard padding="p-4" className="flex flex-col justify-center items-center text-center bg-luxury-gold/5 border-luxury-gold/20 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
                  <p className="font-body text-[10px] text-luxury-gold uppercase tracking-wider mb-1">Available</p>
                  <p className="font-display text-xl font-semibold text-emerald-400">${(totalBudget - spent).toLocaleString()}</p>
                </GlassCard>
              </div>

              {/* Horizontal Progress Bar */}
              <GlassCard padding="p-6" className="mb-6 relative overflow-hidden group">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="font-body text-xs text-white/50 mb-1">Total Spent</p>
                    <p className="font-display text-3xl font-bold text-luxury-white">${spent.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-body text-xs text-luxury-gold font-medium bg-luxury-gold/10 px-2 py-1 rounded-md">{Math.round((spent / totalBudget) * 100)}% Used</span>
                  </div>
                </div>
                
                <div className="w-full h-3 rounded-full bg-black/40 border border-white/5 overflow-hidden mb-2 relative">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(spent / totalBudget) * 100}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </GlassCard>

              {/* Category Breakdown */}
              <GlassCard padding="p-6">
                <h4 className="font-body text-xs text-white/40 uppercase tracking-wider mb-5">Expenses by Category</h4>
                <div className="space-y-4">
                  {Object.entries(budget).map(([k, v], index) => (
                    <motion.div key={k} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="group">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-body text-sm text-white/70 capitalize flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${index % 2 === 0 ? 'bg-luxury-gold' : 'bg-white/40'}`} />
                          {k}
                        </span>
                        <span className="font-body text-sm font-semibold text-luxury-white">${v.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(v / totalBudget) * 100}%` }} transition={{ duration: 1, delay: 0.5 + (index * 0.1) }} className={`h-full rounded-full ${index % 2 === 0 ? 'bg-luxury-gold' : 'bg-white/30 group-hover:bg-white/50'} transition-colors`} />
                      </div>
                    </motion.div>
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
