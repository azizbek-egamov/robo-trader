import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LeaderboardUser } from '../types';
import { Reveal } from './Reveal';
import { Crown, Medal, Sparkles, DollarSign } from 'lucide-react';

export const LeaderboardSection: React.FC = () => {
  const [tab, setTab] = useState<'capital' | 'xp'>('capital');
  const [data, setData] = useState<{ by_capital: LeaderboardUser[]; by_xp: LeaderboardUser[] }>({
    by_capital: [],
    by_xp: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard/')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Leaderboard load error:", err))
      .finally(() => setLoading(false));
  }, []);

  const list = tab === 'capital' ? data.by_capital : data.by_xp;

  const getRankBadge = (idx: number) => {
    if (idx === 0) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (idx === 1) return <Medal className="h-5 w-5 text-slate-300" />;
    if (idx === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-mono text-xs font-bold text-slate-500">#{idx + 1}</span>;
  };

  return (
    <section id="leaderboard-section" className="py-16 md:py-24 bg-[#070a12] border-t border-slate-800/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal direction="up">
          <div className="text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Reyting va Gamifikatsiya
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Xorazm Forex TOP Ishtirokchilari
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Eng yirik portfel egalari va faollik uchun XP ballar to‘plagan etakchilar ro‘yxati.
            </p>

            {/* Tab Switcher */}
            <div className="inline-flex rounded-2xl border border-slate-800 bg-[#0f172a] p-1.5 mt-4">
              <button
                onClick={() => setTab('capital')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition ${
                  tab === 'capital'
                    ? 'bg-red-700 text-white shadow-lg shadow-red-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                TOP Kapital Egalari
              </button>
              <button
                onClick={() => setTab('xp')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition ${
                  tab === 'xp'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                TOP XP Ballar
              </button>
            </div>
          </div>
        </Reveal>

        {/* Table / List */}
        <Reveal direction="up" delay={120}>
          <div className="mt-10 rounded-3xl border border-slate-800 bg-[#0f172a]/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Yuklanmoqda...</div>
            ) : list.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {list.map((u, idx) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-800/40 rounded-xl transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center">
                        {getRankBadge(idx)}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {u.full_name}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {u.role === 'ADMIN' ? 'XF Jamoasi' : 'Investor'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {tab === 'capital' ? (
                        <div>
                          <span className="block font-black font-mono text-base text-emerald-400">
                            ${parseFloat(u.current_value_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {parseFloat(u.units).toFixed(2)} Units
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="block font-black font-mono text-base text-amber-400">
                            {u.xp_points} XP
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            Daraja: Faol
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500">
                Ishtirokchilar topilmadi.
              </div>
            )}
          </div>
        </Reveal>

      </div>
    </section>
  );
};
