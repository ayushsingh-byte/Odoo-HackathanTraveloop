import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { packingItems as initialItems } from '../data/mockData';

export default function PackingChecklist() {
  const [items, setItems] = useState(initialItems);

  const toggle = (catIdx, itemId) => {
    setItems(prev => prev.map((cat, ci) =>
      ci === catIdx ? { ...cat, items: cat.items.map(it => it.id === itemId ? { ...it, packed: !it.packed } : it) } : cat
    ));
  };

  const totalItems = items.reduce((s, c) => s + c.items.length, 0);
  const packedItems = items.reduce((s, c) => s + c.items.filter(i => i.packed).length, 0);
  const progress = Math.round((packedItems / totalItems) * 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Soft Hero */}
      <section className="relative h-[35vh] min-h-[280px] overflow-hidden">
        <img src="/images/hero-santorini.png" alt="Packing" className="img-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-luxury-black" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-12 pb-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-3 block">10 Days in Japan</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white mb-4">Packing List</h1>
            <div className="flex items-center gap-4">
              <div className="w-48 h-2 rounded-full bg-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach" />
              </div>
              <span className="font-body text-sm text-white/50">{packedItems}/{totalItems} packed</span>
              <span className="font-body text-sm font-semibold text-luxury-gold">{progress}%</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Checklist */}
      <section className="px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((cat, ci) => {
            const catPacked = cat.items.filter(i => i.packed).length;
            return (
              <motion.div key={ci} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 }}>
                <GlassCard variant="elevated" padding="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="font-display text-lg font-semibold text-luxury-white">{cat.category}</h3>
                    </div>
                    <span className="font-body text-xs text-white/40">{catPacked}/{cat.items.length}</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/5 mb-5">
                    <div className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach transition-all duration-500" style={{ width: `${(catPacked / cat.items.length) * 100}%` }} />
                  </div>
                  <div className="space-y-2">
                    {cat.items.map(item => (
                      <button key={item.id} onClick={() => toggle(ci, item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
                          item.packed ? 'bg-luxury-gold/5' : 'hover:bg-white/[0.03]'}`}>
                        {item.packed
                          ? <CheckCircle2 className="w-5 h-5 text-luxury-gold shrink-0" />
                          : <Circle className="w-5 h-5 text-white/20 shrink-0" />}
                        <span className={`font-body text-sm transition-all duration-300 ${item.packed ? 'text-white/40 line-through' : 'text-luxury-white'}`}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
