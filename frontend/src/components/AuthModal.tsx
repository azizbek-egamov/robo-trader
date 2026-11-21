import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useModalKeyEvents } from '../hooks/useModalKeyEvents';
import { formatUzbekPhone, cleanUzbekPhone, isValidUzbekPhone } from '../utils/phone';
import { X, Lock, Phone, User, Share2, AlertCircle, FileText } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onOpenOferta?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onOpenOferta
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prop o'zgarganda yoki modal ochilganda rejimni to'g'ri yangilash (Register / Login)
  useEffect(() => {
    setMode(initialMode);
    setError(null);
    if (!phone || phone.trim() === '+998' || phone.trim() === '') {
      setPhone('+998 ');
    }
  }, [initialMode, isOpen]);

  // ESC orqali yopish va Enter orqali keyingi inputga o'tish
  const modalRef = useModalKeyEvents<HTMLDivElement>({
    isOpen,
    onClose,
    enableEnterNavigation: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Telefon raqam to'liq formatlanganligini tekshirish
    if (!isValidUzbekPhone(phone)) {
      setError("Iltimos, telefon raqamini to‘liq kiriting (+998 XX XXX XX XX)");
      return;
    }

    setLoading(true);
    const rawPhone = cleanUzbekPhone(phone);

    if (mode === 'login') {
      const res = await login(rawPhone, password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Kirishda xatolik yuz berdi.');
      }
    } else {
      const res = await register(fullName, rawPhone, password, refCode);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
      }
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div ref={modalRef} className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 pb-4 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`pb-2 px-4 text-base font-black transition border-b-2 -mb-[18px] ${
              mode === 'login'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Tizimga Kirish
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`pb-2 px-4 text-base font-black transition border-b-2 -mb-[18px] ${
              mode === 'register'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                To‘liq Ism-Familiya:
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masalan: Sardorbek Vaisov"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase text-slate-400">
                Telefon Raqam:
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                +998 XX XXX XX XX
              </span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatUzbekPhone(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    const input = e.currentTarget;
                    const { selectionStart, selectionEnd } = input;
                    if (selectionStart !== null && selectionEnd !== null && selectionStart === selectionEnd && selectionStart <= 5) {
                      e.preventDefault();
                    }
                  }
                }}
                placeholder="+998 90 123 45 67"
                maxLength={17}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-red-600 focus:outline-none font-mono tracking-wider font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Parol:
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Taklif (Referal) Kodi (Ixtiyoriy):
                </label>
                <div className="relative">
                  <Share2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    placeholder="Masalan: XF12AB"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-red-600 focus:outline-none font-mono uppercase"
                  />
                </div>
              </div>

              {/* Oferta disclaimer */}
              <div className="pt-1 text-[11px] text-slate-400">
                Ro‘yxatdan o‘tish orqali siz loyihaning{' '}
                <button
                  type="button"
                  onClick={onOpenOferta}
                  className="text-red-400 font-bold underline hover:text-red-300"
                >
                  Ommaviy oferta
                </button>{' '}
                va xatarlar to‘g‘risidagi shartlariga rozilik bildirasiz.
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 text-sm font-black text-white shadow-xl shadow-red-950 hover:from-red-500 hover:to-red-600 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Bajarilmoqda...' : mode === 'login' ? 'Kabinetga Kirish' : 'Ro‘yxatdan O‘tish'}
          </button>
        </form>

      </div>
    </div>
  );
};
