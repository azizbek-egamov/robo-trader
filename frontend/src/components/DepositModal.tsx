import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { P2PCardSetting } from '../types';
import { useModalKeyEvents } from '../hooks/useModalKeyEvents';
import { X, CreditCard, Copy, Check, Upload, AlertCircle, ArrowRight } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [card, setCard] = useState<P2PCardSetting | null>(null);
  const [amountUsd, setAmountUsd] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.get('/billing/card-details/')
        .then((res) => setCard(res.data))
        .catch((err) => console.error("Card fetch error:", err));
    }
  }, [isOpen]);

  const modalRef = useModalKeyEvents<HTMLDivElement>({
    isOpen,
    onClose,
    enableEnterNavigation: true,
  });

  if (!isOpen) return null;

  const rate = card ? parseFloat(card.exchange_rate_usd_uzs) : 12800;
  const amountUzs = amountUsd * rate;

  const handleCopyCard = () => {
    if (card?.card_number) {
      navigator.clipboard.writeText(card.card_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Iltimos, to‘lov cheki rasmini yuklang.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('amount_usd', amountUsd.toString());
    formData.append('amount_uzs', amountUzs.toString());
    formData.append('card_used', `${card?.bank_name} - ${card?.card_number}`);
    formData.append('receipt_image', file);

    try {
      await api.post('/billing/deposit/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Depozit so‘rovini yuborishda xatolik yuz berdi.");
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div ref={modalRef} className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-950/80 border border-red-800/40 text-red-500">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              P2P Depozit Kiritish
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Karta orqali to‘lang va chekni yuklang
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Card info box */}
        <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>To‘lov Qabul Qiluvchi Karta</span>
            <span className="text-emerald-400 font-mono">1 USD = {rate.toLocaleString()} UZS</span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div>
              <span className="block font-mono text-base font-black text-white tracking-wider">
                {card?.card_number || "8600 5704 1234 5678"}
              </span>
              <span className="block text-xs font-semibold text-slate-400">
                {card?.card_holder || "SARDORBEK VAISOV"} ({card?.bank_name || "Uzcard"})
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCard}
              className="flex items-center gap-1.5 rounded-lg bg-red-950/80 border border-red-800/60 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Nusxa olindi' : 'Nusxa olish'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Depozit Summasi (USD):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500 font-bold">$</span>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={amountUsd}
                onChange={(e) => setAmountUsd(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3 pl-8 pr-4 text-sm text-white font-mono font-bold focus:border-red-600 focus:outline-none"
              />
            </div>
            <span className="block mt-1 text-xs text-slate-400">
              To‘lanadigan so‘m miqdori:{' '}
              <strong className="text-amber-400 font-mono">
                {amountUzs.toLocaleString('uz-UZ')} UZS
              </strong>
            </span>
          </div>

          {/* Upload receipt */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              To‘lov Cheki (Skrinshot):
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-700 hover:border-red-500 bg-slate-900/60 p-4 text-center cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <span className="block text-xs font-bold text-slate-200">
                {file ? file.name : "Chek rasmini bu yerga tashlang yoki tanlang"}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                PNG, JPG, JPEG (Max 10MB)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 text-sm font-black text-white shadow-xl shadow-red-950 hover:from-red-500 hover:to-red-600 transition disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Yuborilmoqda...' : 'Chekni Tasdiqlashga Yuborish'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

