import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { P2PCardSetting } from '../types';
import { useModalKeyEvents } from '../hooks/useModalKeyEvents';
import { X, Zap, Copy, Check, Upload, AlertCircle, ArrowRight } from 'lucide-react';

interface PropExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PropExamModal: React.FC<PropExamModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [card, setCard] = useState<P2PCardSetting | null>(null);
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
      setError("Iltimos, 100 000 so‘mlik to‘lov cheki rasmini yuklang.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('card_info_used', `${card?.bank_name} - ${card?.card_number}`);
    formData.append('receipt_image', file);

    try {
      await api.post('/prop/apply/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Arizani yuborishda xatolik yuz berdi.");
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div ref={modalRef} className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-[#0f172a] p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-950/80 border border-amber-800/40 text-amber-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              Imtihonga Yozilish
            </h3>
            <span className="text-xs text-amber-400 font-semibold">
              To‘lov: 100 000 so‘m (Alpari MT5 Demo beriladi)
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Card info */}
        <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>To‘lov Qabul Qiluvchi Karta</span>
            <span className="text-amber-400 font-black">100 000 UZS</span>
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
              className="flex items-center gap-1.5 rounded-lg bg-amber-950/80 border border-amber-800/60 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Nusxa olindi' : 'Nusxa olish'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              100 000 so‘mlik To‘lov Cheki Rasmi:
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-amber-700/50 hover:border-amber-500 bg-slate-900/60 p-4 text-center cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="mx-auto h-8 w-8 text-amber-400 mb-2" />
              <span className="block text-xs font-bold text-slate-200">
                {file ? file.name : "Chek skrinshotini yuklang"}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                Admin tekshirib darhol MT5 Demo hisob yuboradi
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-amber-400 block">Eslatma:</span>
            <p>To‘lov chekingiz tasdiqlanishi bilan, shaxsiy kabinetingizdagi <strong>"Imtihonlarim"</strong> bo‘limida login, parol va server ma'lumotlari faollashadi.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-black text-black shadow-xl shadow-amber-950 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Yuborilmoqda...' : '100 000 so‘m To‘lov Chekini Yuborish'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
