import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatUzbekPhone, cleanUzbekPhone, isValidUzbekPhone } from '../utils/phone';
import { Shield, Lock, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AdminLoginGateProps {
  onBackToHome: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onBackToHome }) => {
  const { login, isAuthenticated, user, logout } = useAuth();
  const [phone, setPhone] = useState('+998 97 560 06 00');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidUzbekPhone(phone)) {
      setError("Iltimos, telefon raqamini to‘liq kiriting (+998 XX XXX XX XX)");
      return;
    }

    setLoading(true);
    const rawPhone = cleanUzbekPhone(phone);
    const res = await login(rawPhone, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Login yoki parol noto‘g‘ri.");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#0f172a] p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-950/80 border border-amber-600/40 text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Admin Boshqaruv Tizimi
            </h2>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
              XORAZM FOREX — Master Fund
            </span>
          </div>
        </div>

        {isAuthenticated && user?.role !== 'ADMIN' && (
          <div className="mb-6 rounded-2xl bg-red-950/40 border border-red-800/60 p-4 text-xs text-red-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Siz investor profilidasiz: {user?.full_name}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ushbu bo‘lim faqat tizim ma'murlari (Admin) uchun ochiq. Iltimos, admin hisobi orqali kiring.
            </p>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-amber-400 underline font-bold hover:text-amber-300"
            >
              Hozirgi hisobdan chiqish
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase text-slate-400">
                Admin Telefon Raqami:
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                +998 XX XXX XX XX
              </span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatUzbekPhone(e.target.value))}
                placeholder="+998 97 560 06 00"
                maxLength={17}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none font-mono tracking-wider font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Admin Paroli:
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin maxfiy paroli"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-[11px] text-slate-400">
            💡 <strong>Standart Admin hisob:</strong> <span className="font-mono text-slate-300">+998 97 560 06 00</span> / <span className="font-mono text-slate-300">admin123</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-black text-black shadow-xl shadow-amber-950 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Kirilmoqda...' : 'Admin Panelga Kirish'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 transition"
          >
            ← Bosh sahifaga qaytish
          </button>
        </form>
      </div>
    </div>
  );
};

