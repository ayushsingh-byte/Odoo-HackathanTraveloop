import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Users, DollarSign, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Search, Bell, Settings, LogOut, Home, Map, MessageSquare } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { adminStats } from '../data/mockData';

const sidebarLinks = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Users, label: 'Users' },
  { icon: Map, label: 'Trips' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: MessageSquare, label: 'Support' },
  { icon: Settings, label: 'Settings' },
];

export default function AdminDashboard() {
  const { totalUsers, activeTrips, revenue, engagement, recentUsers, monthlyData, topDestinations } = adminStats;

  const stats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, change: '+12.5%', up: true },
    { label: 'Active Trips', value: activeTrips.toLocaleString(), icon: Map, change: '+8.2%', up: true },
    { label: 'Revenue', value: revenue, icon: DollarSign, change: '+23.1%', up: true },
    { label: 'Engagement', value: engagement, icon: TrendingUp, change: '-2.4%', up: false },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen bg-luxury-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-peach flex items-center justify-center">
            <Globe className="w-5 h-5 text-luxury-black" />
          </div>
          <span className="font-display text-lg font-semibold text-luxury-white">Traveloop</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all duration-300 ${
              link.active ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20' : 'text-white/40 hover:text-luxury-white hover:bg-white/5'}`}>
              <link.icon className="w-4.5 h-4.5" />{link.label}
            </button>
          ))}
        </nav>
        <button className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-red-400 font-body text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-luxury-white">Dashboard</h1>
            <p className="font-body text-xs text-white/40">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" placeholder="Search..." className="input-luxury pl-10 py-2.5 w-64" />
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-white/40" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-luxury-gold" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard variant="elevated" padding="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center"><s.icon className="w-5 h-5 text-luxury-gold" /></div>
                    <span className={`flex items-center gap-1 font-body text-xs ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{s.change}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-luxury-white mb-1">{s.value}</p>
                  <p className="font-body text-xs text-white/40">{s.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
              <GlassCard variant="elevated" padding="p-6">
                <h3 className="font-display text-lg font-semibold text-luxury-white mb-6">Revenue Overview</h3>
                <div className="flex items-end gap-3 h-48">
                  {monthlyData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-luxury-gold/40 to-luxury-gold/80 hover:from-luxury-gold/60 hover:to-luxury-gold transition-colors cursor-pointer relative group">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[10px] font-body text-luxury-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${(d.revenue / 1000).toFixed(0)}K
                        </div>
                      </motion.div>
                      <span className="font-body text-[10px] text-white/30">{d.month}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Top Destinations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <GlassCard variant="elevated" padding="p-6">
                <h3 className="font-display text-lg font-semibold text-luxury-white mb-6">Top Destinations</h3>
                <div className="space-y-4">
                  {topDestinations.map((d, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-body text-sm text-luxury-white">{d.name}</span>
                        <span className="font-body text-xs text-white/40">{d.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${d.percentage}%` }} transition={{ delay: 0.7 + i * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-luxury-peach" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Users Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard variant="elevated" padding="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold text-luxury-white">Recent Users</h3>
                <button className="font-body text-xs text-luxury-gold hover:text-luxury-gold-bright transition-colors">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['User', 'Email', 'Trips', 'Joined', 'Status'].map(h => (
                        <th key={h} className="text-left font-body text-[10px] uppercase tracking-wider text-white/30 pb-3 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u, i) => (
                      <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-3 font-body text-sm text-luxury-white">{u.name}</td>
                        <td className="py-3.5 px-3 font-body text-sm text-white/40">{u.email}</td>
                        <td className="py-3.5 px-3 font-body text-sm text-luxury-gold">{u.trips}</td>
                        <td className="py-3.5 px-3 font-body text-sm text-white/40">{u.joined}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full font-body text-[10px] uppercase tracking-wider ${
                            u.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>{u.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
