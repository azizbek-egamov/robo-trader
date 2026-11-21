import React from 'react';
import { InvestmentPool } from '../types';
import { Reveal } from './Reveal';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Send,
  Users,
  Coins,
  DollarSign,
  PieChart
} from 'lucide-react';

interface HeroSectionProps {
  pool: InvestmentPool | null;
  onOpenDeposit: () => void;
  onGoToProp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ pool, onOpenDeposit, onGoToProp }) => {
  const currentNav = pool ? parseFloat(pool.current_nav) : 1.0058;
  const equityUsd = pool ? parseFloat(pool.total_equity_usd) : 6035;
  const investorsCount = pool?.total_investors_count || 3;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[550px] w-[1000px] rounded-full bg-gradient-to-b from-red-600/10 via-red-950/5 to-transparent blur-3xl -z-10" />
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-red-700/5 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Institutional Pitch */}
          <div className="lg:col-span-7 space-y-6">
            
            <Reveal direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-400 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                XF Master Fund & Umumiy G‘azna
              </div>
            </Reveal>

            <Reveal direction="up" delay={70}>
              <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl leading-[1.04]">
                Bilimdan strategiyaga.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400">
                  Strategiyadan kapitalga.
                </span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={130}>
              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
                Xorazm Forex boshqaruvidagi professional <strong>Alpari MT5 Master Account</strong> orqali investitsiya qiling.
                Investment Units + Dinamik NAV modeli orqali yangi kiritilgan mablag‘lar eski foydani talashmaydi.
                Daromad esa toza <strong>50% XF / 50% Investorlar</strong> o‘rtasida adolatli taqsimlanadi.
              </p>
            </Reveal>

            {/* Telegram Lead Pill (Like xorazm-forex) */}
            <Reveal direction="up" delay={180} className="pt-1">
              <a
                href="https://t.me/xorazmforex"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3.5 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/50 via-blue-950/30 to-slate-900 p-3 text-white shadow-xl transition hover:-translate-y-0.5 hover:border-sky-400"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-105 transition">
                  <Send className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-sky-300">
                    🎁 Rasmiy Telegram Kanal
                  </span>
                  <span className="block text-sm font-black text-white">
                    Jonli savdo hisobotlari va bepul tahlillar
                  </span>
                </div>
                <span className="ml-2 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase text-black">
                  Kanalga o‘tish
                </span>
              </a>
            </Reveal>

            {/* Action Buttons */}
            <Reveal direction="up" delay={240} className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onOpenDeposit}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-7 py-4 text-base font-black text-white shadow-xl shadow-red-950 hover:from-red-500 hover:to-red-600 transition hover:-translate-y-0.5"
              >
                <span>Investitsiya kiritish</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onGoToProp}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-950/20 px-7 py-4 text-base font-black text-amber-300 hover:bg-amber-950/40 hover:border-amber-400 transition"
              >
                <Zap className="h-5 w-5 text-amber-400" />
                <span>100 000 so‘mga Imtihon</span>
              </button>
            </Reveal>

            {/* Institutional Trust Badges */}
            <Reveal direction="up" delay={300} className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
              {[
                "Investor Paroli Shaffofligi",
                "High-Water Mark Kafolati",
                "Do‘stingiz Foydasidan 5%"
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{text}</span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Right Column: Founder Authority Card & Master Pool Stats */}
          <div className="lg:col-span-5 space-y-4">
            <Reveal direction="right" delay={120}>
              <div className="relative rounded-3xl border border-slate-800 bg-[#0f172a] overflow-hidden shadow-2xl">
                
                {/* Founder Image with Glass Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src="/images/corporate/hero-sardorbek.webp"
                    alt="Sardorbek Vaisov — Xorazm Forex asoschisi"
                    className="w-full h-full object-cover object-top filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                  
                  {/* Founder Title Overlay */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400 block">
                      Founder & Chief Trader
                    </span>
                    <h3 className="text-xl font-black">
                      Sardorbek Vaisov
                    </h3>
                    <p className="text-xs text-slate-300">
                      Xorazm Forex akademiyasi asoschisi va Master Account boshqaruvchisi
                    </p>
                  </div>
                </div>

                {/* Master Account Financial Stats Overlay */}
                <div className="p-5 sm:p-6 space-y-4 border-t border-slate-800 bg-[#0b0f19]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase text-slate-400">
                      Joriy NAV Qiymati:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white font-mono">
                        ${currentNav.toFixed(4)}
                      </span>
                      <span className="rounded bg-emerald-950 border border-emerald-800/60 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        +{((currentNav - 1.0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Fond Kapitali</span>
                      <strong className="text-base font-black text-white font-mono mt-0.5 block">
                        ${equityUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Taqsimot Modeli</span>
                      <strong className="text-base font-black text-red-400 mt-0.5 block">
                        50% XF / 50% Siz
                      </strong>
                    </div>
                  </div>

                  {/* Fast Contact Card */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                    <span>Ofis aloqa liniyasi:</span>
                    <a href="tel:+998975600600" className="font-bold text-white hover:text-red-400 transition font-mono">
                      +998 97 560 06 00
                    </a>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
};
