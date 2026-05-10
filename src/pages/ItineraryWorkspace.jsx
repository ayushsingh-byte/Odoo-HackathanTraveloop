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
  const [itinerary, setItinerary] = useState(itineraryData);
  const { tripName, destination, dates, days, budget, totalBudget, spent } = itinerary;

  const handleAddDay = () => {
    const newDayNum = days.length + 1;
    const newDay = {
      day: newDayNum,
      date: 'TBD',
      title: `Day ${newDayNum} Exploration`,
      city: destination,
      image: '/images/hero-bali.png',
      activities: []
    };
    setItinerary({ ...itinerary, days: [...days, newDay] });
    setActiveDay(newDayNum);
  };

  const handleAddActivity = (dayIndex) => {
    const newActivity = {
      time: '10:00 AM',
      name: 'New Activity',
      icon: '✨',
      type: 'activity',
      cost: 0
    };
    const newDays = [...days];
    newDays[dayIndex].activities.push(newActivity);
    setItinerary({ ...itinerary, days: newDays });
  };

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
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddDay}
            className="w-full text-left px-3 py-2.5 rounded-xl font-body text-sm text-white/30 hover:text-luxury-gold transition-all duration-300 flex items-center gap-3 mt-2"
          >
            <Plus className="w-4 h-4" /> Add Day
          </motion.button>

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

                    <motion.button 
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddActivity(activeDay - 1)}
                      className="mt-6 ml-12 flex items-center gap-2 font-body text-sm text-white/30 hover:text-luxury-gold transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" /> Add activity
                    </motion.button>
                  </>
                );
              })()}
            </motion.div>
          )}
        </main>

        {/* RIGHT: Budget Panel */}
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-72 shrink-0 border-l border-white/5 p-6 overflow-y-auto hidden xl:block">
          <h3 className="font-display text-lg font-semibold text-luxury-white mb-6">Budget Overview</h3>
          
          {/* Premium Budget Cards */}
          <div className="flex flex-col gap-3 mb-6">
            <GlassCard padding="p-4" className="flex flex-col justify-center items-center text-center">
              <p className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Limit</p>
              <p className="font-display text-xl font-semibold text-luxury-white">${totalBudget.toLocaleString()}</p>
            </GlassCard>
            <GlassCard padding="p-4" className="flex flex-col justify-center items-center text-center bg-luxury-gold/5 border-luxury-gold/20 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
              <p className="font-body text-[10px] text-luxury-gold uppercase tracking-wider mb-1">Available</p>
              <p className="font-display text-xl font-semibold text-emerald-400">${(totalBudget - spent).toLocaleString()}</p>
            </GlassCard>
          </div>

          <div className="section-line mb-6" />

          {/* Horizontal Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <p className="font-body text-xs text-white/50">Total Spent</p>
              <span className="font-body text-[10px] text-luxury-gold font-medium bg-luxury-gold/10 px-2 py-0.5 rounded-md">{Math.round((spent / totalBudget) * 100)}% Used</span>
            </div>
            <p className="font-display text-2xl font-bold text-luxury-white mb-3">${spent.toLocaleString()}</p>
            
            <div className="w-full h-2 rounded-full bg-black/40 border border-white/5 overflow-hidden mb-2 relative">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(spent / totalBudget) * 100}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="font-body text-xs text-white/40 uppercase tracking-wider mb-4">Expenses by Category</h4>
            <div className="space-y-4">
              {Object.entries(budget).map(([key, val], index) => (
                <motion.div key={key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-body text-xs text-white/70 capitalize flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${index % 2 === 0 ? 'bg-luxury-gold' : 'bg-white/40'}`} />
                      {key}
                    </span>
                    <span className="font-body text-xs font-semibold text-luxury-white">${val.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-black/40 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(val / totalBudget) * 100}%` }} transition={{ duration: 1, delay: 0.5 + (index * 0.1) }} className={`h-full rounded-full ${index % 2 === 0 ? 'bg-luxury-gold' : 'bg-white/30 group-hover:bg-white/50'} transition-colors`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
