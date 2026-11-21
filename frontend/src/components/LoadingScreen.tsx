import React, { useState, useEffect } from 'react';

const STATUS_MESSAGES = [
  "XAVFSIZ LEDGER PROTOKOLI ISHGA TUSHIRILMOQDA...",
  "XAVFSIZ SERVER BILAN ALOQA O‘RNATILMOQDA...",
  "DINAMIK NAV VA INVESTMENT UNITS SINXRONLASHMOQDA...",
  "TIZIM TO‘LIQ XAVFSIZ VA FOYDALANISHGA TAYYOR"
];

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Silliq va jiddiy foiz oshishi (1.4 soniya ichida)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 6;
        return next > 100 ? 100 : next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setStatusIndex(0);
    else if (progress < 65) setStatusIndex(1);
    else if (progress < 90) setStatusIndex(2);
    else setStatusIndex(3);

    if (progress === 100) {
      const fadeTimer = setTimeout(() => setIsFading(true), 300);
      const doneTimer = setTimeout(() => setIsDone(true), 900);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [progress]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#04060a] p-8 sm:p-12 transition-all duration-700 ease-out select-none ${
        isFading ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background luxury subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(185,28,28,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Corporate Status Badge */}
      <div className="w-full max-w-6xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
            XF SECURE GATEWAY v2.6
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-500 uppercase">
          XF SECURE PLATFORM ONLINE
        </span>
      </div>

      {/* Center Brand & Precision Progress Indicator */}
      <div className="flex flex-col items-center justify-center max-w-md w-full z-10 text-center">
        
        {/* Official Brand Logo */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-3xl bg-red-600/10 blur-xl pointer-events-none" />
          <img
            src="/images/logo.png"
            alt="Xorazm Forex Logo"
            className="h-20 w-20 sm:h-24 sm:w-24 object-contain relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Corporate Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-white">
          XORAZM FOREX
        </h1>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.28em] text-red-500">
          Institutional CopyTrade & Imtihon
        </p>

        {/* Razor-thin High-Precision Progress Bar */}
        <div className="mt-8 w-full max-w-xs space-y-2.5">
          <div className="h-[2px] w-full rounded-full bg-slate-800/80 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(239,68,68,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 font-semibold tracking-wider">
              YUKLANMOQDA
            </span>
            <span className="font-bold text-white font-mono">
              {progress}%
            </span>
          </div>
        </div>

        {/* Live System Status Readout */}
        <div className="mt-5 h-5 flex items-center justify-center">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            {STATUS_MESSAGES[statusIndex]}
          </p>
        </div>

      </div>

      {/* Bottom Institutional Micro-Footer */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900/80 pt-4 z-10 text-[10px] font-mono text-slate-500">
        <span>ASSET BACKED MASTER ACCOUNT • DYNAMIC NAV SYSTEM</span>
        <span>© 2026 XORAZM FOREX ACADEMY • BARCHA HUQUQLAR HIMOYALANGAN</span>
      </div>

    </div>
  );
};
