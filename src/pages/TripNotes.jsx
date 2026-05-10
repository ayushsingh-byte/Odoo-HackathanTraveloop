import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PenTool, Calendar, Image } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { tripNotes } from '../data/mockData';

export default function TripNotes() {
  const [activeNote, setActiveNote] = useState(0);
  const note = tripNotes[activeNote];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img src={note.image} alt="" className="img-cover opacity-50 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/40 to-luxury-black" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-3 block">Travel Journal</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white">Trip Notes</h1>
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Note List */}
          <div className="lg:col-span-1 space-y-3">
            <button className="w-full glass p-4 rounded-xl flex items-center gap-3 text-white/40 hover:text-luxury-gold hover:border-luxury-gold/20 transition-all duration-300">
              <Plus className="w-4 h-4" /><span className="font-body text-sm">New Note</span>
            </button>
            {tripNotes.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <button onClick={() => setActiveNote(i)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    activeNote === i ? 'glass-gold' : 'glass hover:bg-white/[0.06]'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{n.mood}</span>
                    <span className="font-body text-[10px] text-white/40">{n.date}</span>
                  </div>
                  <h3 className="font-display text-sm font-semibold text-luxury-white mb-1">{n.title}</h3>
                  <p className="font-body text-xs text-white/30 line-clamp-2">{n.content}</p>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Note Detail */}
          <motion.div key={activeNote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <GlassCard variant="elevated" padding="p-0" className="overflow-hidden">
              <div className="relative h-56">
                <img src={note.image} alt="" className="img-cover" />
                <div className="absolute inset-0 overlay-cinematic" />
                <div className="absolute bottom-5 left-6">
                  <span className="text-3xl mb-2 block">{note.mood}</span>
                  <h2 className="font-display text-2xl font-semibold text-luxury-white">{note.title}</h2>
                  <p className="font-body text-xs text-white/50 mt-1">{note.date}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="font-body text-base text-white/60 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                <div className="mt-8 flex items-center gap-4">
                  <button className="flex items-center gap-2 font-body text-xs text-white/30 hover:text-luxury-gold transition-colors"><PenTool className="w-3.5 h-3.5" /> Edit</button>
                  <button className="flex items-center gap-2 font-body text-xs text-white/30 hover:text-luxury-gold transition-colors"><Image className="w-3.5 h-3.5" /> Add Photo</button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
