import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, MapPin, Calendar, Users, Wallet, Heart, Mountain, Palette, Waves, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { API } from '../services/api';

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
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dest, setDest] = useState('');
  const [mood, setMood] = useState('');
  const [bgImg, setBgImg] = useState('/images/hero-india.png');
  const [customDest, setCustomDest] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('5000');

  const steps = ['Destination', 'Travel Style', 'Details'];

  const effectiveDest = dest || customDest;

  const handleCreate = async () => {
    const finalName = tripName.trim() || `${effectiveDest || 'My'} Adventure`;
    const data = await API.post('/api/trips', {
      title: finalName,
      description: `A ${mood || 'wonderful'} trip to ${effectiveDest || 'an amazing destination'}`,
      start_date: startDate || null,
      end_date: endDate || null,
      total_budget: parseFloat(budget) || 5000,
      currency: 'USD',
      visibility: 'private',
    });
    if (data?.trip_id) navigate(`/trip/builder?id=${data.trip_id}`);
    else navigate('/my-trips');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.img key={bgImg} src={bgImg} alt="" className="img-cover" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="relative pt-28 pb-16 px-6 lg:px-8 min-h-screen flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
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

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="text-center mb-12">
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-white mb-3">Where to?</h1>
                  <p className="font-body text-sm text-white/40">Choose your dream destination</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {destOptions.map(d => (
                    <motion.div key={d.name} whileHover={{ y: -4 }} onClick={() => { setDest(d.name); setBgImg(d.img); }}
                      className={`relative h-40 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
                        dest === d.name ? 'border-luxury-gold shadow-gold-glow' : 'border-transparent hover:border-white/20'}`}>
                      <img src={d.img} alt={d.name} className="img-cover" />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-xl font-semibold text-luxury-white">{d.name}</span>
                      </div>
                      {dest === d.name && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-black text-xs font-bold">✓</div>}
                    </motion.div>
                  ))}
                  <motion.div whileHover={{ y: -4 }} onClick={() => { setShowCustomInput(true); setDest(''); }}
                    className={`h-40 rounded-2xl glass flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 ${
                      showCustomInput ? 'border-luxury-gold bg-luxury-gold/10' : 'border-transparent hover:border-white/20'}`}>
                    {showCustomInput ? (
                      <div className="w-full px-4" onClick={e => e.stopPropagation()}>
                        <p className="font-body text-xs text-luxury-gold text-center mb-2">Enter destination</p>
                        <input
                          autoFocus
                          type="text"
                          value={customDest}
                          onChange={e => setCustomDest(e.target.value)}
                          placeholder="e.g. Tokyo, Japan"
                          className="input-luxury w-full text-center"
                          style={{ fontSize: '0.9rem' }}
                          onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                        />
                        {customDest && <p className="font-body text-[10px] text-luxury-gold text-center mt-1">✓ Custom</p>}
                      </div>
                    ) : (
                      <div className="text-center"><span className="text-2xl block mb-1">+</span><span className="font-body text-xs text-white/40">Custom</span></div>
                    )}
                  </motion.div>
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
                  {moods.map(m => (
                    <motion.div key={m.id} whileHover={{ y: -4 }} onClick={() => setMood(m.id)}
                      className={`glass p-6 rounded-2xl cursor-pointer text-center transition-all duration-500 ${
                        mood === m.id ? 'border-luxury-gold bg-luxury-gold/10 shadow-gold-glow' : 'hover:border-white/20'}`}>
                      <div className={`mx-auto mb-3 ${mood === m.id ? 'text-luxury-gold' : 'text-white/40'}`}>{m.icon}</div>
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
                  <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Trip Name</label><input type="text" value={tripName || `${effectiveDest || 'Dream'} Adventure`} onChange={e => setTripName(e.target.value)} className="input-luxury" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-luxury" /></div>
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-luxury" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Travelers</label><input type="number" defaultValue={2} min={1} className="input-luxury" /></div>
                    <div><label className="font-body text-xs text-white/50 uppercase tracking-wider mb-2 block">Budget (USD)</label><input type="number" value={budget} onChange={e => setBudget(e.target.value)} min="0" className="input-luxury" /></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12">
            <button onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-2 font-body text-sm transition-all duration-300 ${step > 0 ? 'text-white/60 hover:text-luxury-white cursor-pointer' : 'text-white/10 cursor-default'}`}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary"><span>Continue</span><ArrowRight className="w-4 h-4" /></button>
            ) : (
              <button onClick={handleCreate} className="btn-primary"><Sparkles className="w-4 h-4" />Create Trip</button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
