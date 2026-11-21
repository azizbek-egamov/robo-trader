import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { NAVHistoryPoint, TradeSession } from '../types';
import { Reveal } from './Reveal';
import { History } from 'lucide-react';

interface NAVChartSectionProps {
  navHistory: NAVHistoryPoint[];
  sessions: TradeSession[];
}

export const NAVChartSection: React.FC<NAVChartSectionProps> = ({ navHistory, sessions }) => {
  const chartData = (navHistory.length > 0 ? navHistory : [
    { recorded_at: '2026-11-20', nav: '1.0000' },
    { recorded_at: '2026-11-21', nav: '1.0058' }
  ]).map((pt, idx) => ({
    name: pt.recorded_at ? new Date(pt.recorded_at).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : `Nuqta ${idx+1}`,
    nav: parseFloat(pt.nav),
  }));

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-[#070a12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Shaffof Matematik Model
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Investment Units va NAV O‘sish Grafigi
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Master Account savdolaridan olingan har bir dollar to‘g‘ridan-to‘g‘ri NAV narxini oshiradi.
              Hech qanday eski foyda yangi investorlarga adolatsiz berilmaydi.
            </p>
          </div>
        </Reveal>

        {/* Interactive Chart Container */}
        <Reveal direction="up" delay={120}>
          <div className="mt-12 rounded-3xl border border-slate-800 bg-[#0f172a]/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  NAV Dinamikasi (USD)
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-black text-white font-mono">
                    ${chartData[chartData.length - 1]?.nav.toFixed(4) || '1.0058'}
                  </span>
                  <span className="rounded-full bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    Faol o‘sish
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  NAV Trayektoriyasi
                </span>
                <span>•</span>
                <span>Baza: $1.0000 USD</span>
              </div>
            </div>

            {/* Recharts Area */}
            <div className="h-[280px] sm:h-[360px] w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    domain={['dataMin - 0.005', 'dataMax + 0.005']}
                    tickFormatter={(val) => `$${val.toFixed(3)}`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '1rem',
                      color: '#fff',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    formatter={(value: any) => [`$${Number(value).toFixed(4)} USD`, 'NAV Narxi']}
                  />
                  <Area
                    type="monotone"
                    dataKey="nav"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#navGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        {/* Recent Trade Sessions Table */}
        <Reveal direction="up" delay={180}>
          <div className="mt-12 rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <History className="h-5 w-5 text-red-500" />
                <h3 className="text-xl font-black text-white">
                  So‘nggi Savdo Sessiyalari Natijalari
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                50/50 Avtomatik taqsimot
              </span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Sessiya ID</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Yalpi Foyda</th>
                    <th className="py-3 px-4">XF Ulushi (50%)</th>
                    <th className="py-3 px-4 text-emerald-400">Investorlar (50%)</th>
                    <th className="py-3 px-4">NAV Natijasi</th>
                    <th className="py-3 px-4">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {sessions.length > 0 ? (
                    sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {sess.session_id}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <span className="rounded bg-red-950 border border-red-800/50 px-2 py-0.5 text-xs text-red-400 font-bold">
                            {sess.trader_type === 'XF' ? 'XF Master' : 'Treyder'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white font-mono">
                          +${parseFloat(sess.gross_profit_usd).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          ${parseFloat(sess.xf_share_usd).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                          +${parseFloat(sess.investors_share_usd).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">
                          ${parseFloat(sess.nav_after).toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {new Date(sess.created_at).toLocaleDateString('uz-UZ')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500">
                        Hozircha sessiyalar mavjud emas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
