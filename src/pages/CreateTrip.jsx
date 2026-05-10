import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, MapPin, Calendar, Users, Wallet, Heart, Mountain, Palette, Waves, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const moods = [
  { id: 'adventure', icon: <Mountain className="w-6 h-6" />, label: 'Adventure', desc: 'Hiking, diving, exploration' },
  { id: 'romance', icon: <Heart className="w-6 h-6" />, label: 'Romance', desc: 'Intimate, sunset, couples' },
  { id: 'culture', icon: <Palette className="w-6 h-6" />, label: 'Culture', desc: 'History, art, museums' },
  { id: 'relaxation', icon: <Waves className="w-6 h-6" />, label: 'Relaxation', desc: 'Spa, beach, wellness' },
];

const destOptions = [
  { name: 'India', img: '/images/hero-india.png' },
  { name: 'Bali', img: '/images/hero-bali.png' },
  { name: 'Paris', img: '/images/hero-paris.png' },
  { name: 'Santorini', img: '/images/hero-santorini.png' },
  { name: 'Iceland', img: '/images/hero-iceland.png' },
];

export default function CreateTrip() {
  const [step, setStep] = useState(0);
  const [dest, setDest] = useState('');
  const [mood, setMood] = useState('');
  const [bgImg, setBgImg] = useState('/images/hero-india.png');
  const [showCustom, setShowCustom] = useState(false);

  const steps = ['Destination', 'Travel Style', 'Details'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.img key={bgImg} src={bgImg} alt="" className="img-cover" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="relative pt-28 pb-16 px-6 lg:px-8 min-h-screen flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 mb-16">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-semibold transition-all duration-500 ${
                  i <= step ? 'bg-luxury-gold text-luxury-black' : 'glass text-white/40'}`}>{i + 1}</div>
                <span className={`font-body text-xs hidden sm:inline transition-colors duration-300 ${i <= step ? 'text-luxury-white' : 'text-white/30'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-12 h-px transition-colors duration-500 ${i < step ? 'bg-luxury-gold' : 'bg-white/10'}`} />}
              </div>
            ))}
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="text-center mb-12">
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white mb-3">Where to?</h1>
                  <p className="font-body text-sm text-white/40">Choose your dream destination</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {destOptions.map((d, i) => (
                    <motion.div key={d.name} whileHover={{ y: -4 }} onClick={() => { setDest(d.name); setBgImg(d.img); setShowCustom(false); }}
                      className={`relative h-40 rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-500 animate-float ${i % 2 === 0 ? '' : 'animation-delay-500'} ${
                        dest === d.name ? 'border-luxury-gold shadow-gold-glow' : 'border-transparent hover:border-white/20'}`}>
                      <img src={d.img} alt={d.name} className="img-cover object-cover object-center" />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-xl font-semibold text-luxury-white">{d.name}</span>
                      </div>
                      {dest === d.name && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-black text-xs font-bold shadow-lg">✓</div>}
                    </motion.div>
                  ))}
                  {showCustom ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 sm:col-span-1 h-40 rounded-3xl glass p-4 flex flex-col justify-center border border-luxury-gold/50 shadow-gold-glow">
                      <label className="font-body text-[10px] text-white/50 uppercase tracking-wider mb-2 text-center">Custom Destination</label>
                      <input type="text" value={dest} onChange={(e) => { setDest(e.target.value); setBgImg(''); }} placeholder="Where to?" className="w-full bg-transparent border-b border-white/20 text-center font-display text-xl text-luxury-white focus:outline-none focus:border-luxury-gold pb-1 mb-3" autoFocus />
                      <button onClick={() => setShowCustom(false)} className="text-[10px] uppercase tracking-widest font-semibold text-luxury-gold hover:text-luxury-white transition-colors">Done</button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ y: -4 }} onClick={() => setShowCustom(true)} className="h-40 rounded-3xl glass flex items-center justify-center cursor-pointer hover:border-luxury-gold/20 transition-all duration-300 animate-float">
                      <div className="text-center"><span className="text-2xl block mb-1 text-white/60">+</span><span className="font-body text-xs text-white/40">Custom</span></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="text-center mb-12">
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white mb-3">Your Travel Style</h1>
                  <p className="font-body text-sm text-white/40">What kind of journey speaks to you?</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  {moods.map((m, i) => (
                    <motion.div key={m.id} whileHover={{ y: -4 }} onClick={() => setMood(m.id)}
                      className={`glass p-6 rounded-3xl cursor-pointer text-center transition-all duration-500 animate-float ${i % 2 === 0 ? '' : 'animation-delay-500'} ${
                        mood === m.id ? 'border-luxury-gold bg-luxury-gold/10 shadow-gold-glow' : 'hover:border-white/20'}`}>
                      <div className={`mx-auto mb-3 flex justify-center ${mood === m.id ? 'text-luxury-gold' : 'text-white/40'}`}>{m.icon}</div>
                      <h3 className="font-body text-sm font-semibold text-luxury-white mb-1">{m.label}</h3>
                      <p className="font-body text-[10px] text-white/40">{m.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="text-center mb-12">
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white mb-3">Trip Details</h1>
                  <p className="font-body text-sm text-white/40">Finalize your journey</p>
                </div>
                <div className="glass-elevated p-8 rounded-2xl max-w-lg mx-auto space-y-5">
                  <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Trip Name</label><input type="text" defaultValue={`${dest || 'Dream'} Adventure`} className="input-luxury" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Start Date</label><input type="date" className="input-luxury" /></div>
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">End Date</label><input type="date" className="input-luxury" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Travelers</label><input type="number" defaultValue={2} min={1} className="input-luxury" /></div>
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Budget</label><input type="text" defaultValue="$5,000" className="input-luxury" /></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <motion.button 
              whileTap={step > 0 ? { scale: 0.95 } : {}}
              onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-2 font-body text-sm transition-all duration-300 ${step > 0 ? 'text-white/60 hover:text-luxury-white cursor-pointer' : 'text-white/10 cursor-default'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
            {step < 2 ? (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step + 1)} 
                className="btn-primary"
              >
                <span>Continue</span><ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <Link to="/itinerary" className="btn-primary">
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />Create Trip
                </motion.span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
