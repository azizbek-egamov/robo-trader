import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useModalKeyEvents } from '../hooks/useModalKeyEvents';
import { X, ArrowUpRight, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [amountUsd, setAmountUsd] = useState<number>(50);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useModalKeyEvents<HTMLDivElement>({
    isOpen,
    onClose,
    enableEnterNavigation: true,
  });

  if (!isOpen) return null;

  const currentBalance = parseFloat(user?.current_value_usd || '0.00');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amountUsd > currentBalance) {
      setError(`Mablag‘ yetarli emas. Siz yechishingiz mumkin bo‘lgan maksimal summa: $${currentBalance}`);
      return;
    }

    setLoading(true);
    try {
      await api.post('/billing/withdraw/create/', {
        amount_usd: amountUsd,
        target_card_number: cardNumber,
        target_card_holder: cardHolder,
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Pul yechish so‘rovini yuborishda xatolik yuz berdi.");
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div ref={modalRef} className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-950/80 border border-amber-800/40 text-amber-500">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              Mablag‘ Yechib Olish
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Balansingiz: <strong className="text-emerald-400 font-mono">${currentBalance.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Yechiladigan Summa (USD):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500 font-bold">$</span>
              <input
                type="number"
                min="10"
                max={currentBalance}
                step="1"
                required
                value={amountUsd}
                onChange={(e) => setAmountUsd(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-8 pr-4 text-sm text-white font-mono font-bold focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Qabul Qiluvchi Karta Raqami (Uzcard / Humo):
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="8600 **** **** ****"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 px-4 text-sm text-white font-mono font-bold focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Karta Egasining Ism-Familiyasi:
            </label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Masalan: JAVOHIR ALIYEV"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 px-4 text-sm text-white font-bold uppercase focus:border-red-600 focus:outline-none"
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            * Yechishda sizning Investment Units miqdoringiz proporsional kamaytiriladi va so‘m ekvivalentida kartangizga o‘tkaziladi.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-black text-black shadow-xl shadow-amber-950 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Yuborilmoqda...' : 'Yechish So‘rovini Yuborish'}
          </button>
        </form>

      </div>
    </div>
  );
};

