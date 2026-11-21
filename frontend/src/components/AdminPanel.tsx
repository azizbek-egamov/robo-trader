import React, { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../services/api';
import { useModalKeyEvents } from '../hooks/useModalKeyEvents';
import {
  DepositRequest,
  WithdrawalRequest,
  PropExam,
  P2PCardSetting,
  InvestmentPool
} from '../types';
import {
  ShieldAlert,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  Zap,
  Users,
  Settings,
  AlertCircle,
  Eye,
  KeyRound,
  DollarSign
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<'sessions' | 'deposits' | 'withdrawals' | 'prop' | 'card'>('sessions');

  // Trade Session form
  const [grossProfit, setGrossProfit] = useState<number>(70);
  const [traderType, setTraderType] = useState<'XF' | 'EXTERNAL'>('XF');
  const [notes, setNotes] = useState('Kunlik savdo sessiyasi yakuni (+70$)');
  const [sessionSuccess, setSessionSuccess] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Lists
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [propExams, setPropExams] = useState<PropExam[]>([]);
  const [card, setCard] = useState<P2PCardSetting | null>(null);
  const [pool, setPool] = useState<InvestmentPool | null>(null);

  // Modals for image view & MT5 entry
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [activePropId, setActivePropId] = useState<number | null>(null);
  const [mt5Login, setMt5Login] = useState('');
  const [mt5Password, setMt5Password] = useState('');
  const [mt5Server, setMt5Server] = useState('Alpari-MT5-Demo');

  // ESC va Enter boshqaruvi
  const mt5ModalRef = useModalKeyEvents<HTMLDivElement>({
    isOpen: !!activePropId,
    onClose: () => setActivePropId(null),
    enableEnterNavigation: true,
  });

  const viewImageModalRef = useModalKeyEvents<HTMLDivElement>({
    isOpen: !!viewImage,
    onClose: () => setViewImage(null),
    enableEnterNavigation: false,
  });

  const loadAll = () => {
    api.get('/billing/admin/deposits/').then((res) => setDeposits(res.data)).catch(console.error);
    api.get('/billing/admin/withdrawals/').then((res) => setWithdrawals(res.data)).catch(console.error);
    api.get('/prop/admin/exams/').then((res) => setPropExams(res.data)).catch(console.error);
    api.get('/billing/card-details/').then((res) => setCard(res.data)).catch(console.error);
    api.get('/invest/pool/').then((res) => setPool(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // 1. Foyda sessiyasini kiritish ($70)
  const handleExecuteSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionLoading(true);
    setSessionSuccess(null);

    try {
      const res = await api.post('/invest/admin/execute-session/', {
        gross_profit_usd: grossProfit,
        trader_type: traderType,
        notes: notes,
      });
      setSessionLoading(false);
      setSessionSuccess(`Sessiya muvaffaqiyatli yakunlandi! Sessiya ID: ${res.data.session_id}. Yangi NAV: $${res.data.nav_after}. Barcha investorlarga daromad taqsimlandi!`);
      loadAll();
    } catch (err: any) {
      setSessionLoading(false);
      alert(err.response?.data?.error || "Sessiyani taqsimlashda xatolik.");
    }
  };

  // 2. Depozitni tasdiqlash
  const handleApproveDeposit = async (id: number) => {
    try {
      await api.post(`/billing/admin/deposits/${id}/approve/`);
      alert("Depozit tasdiqlandi va units berildi!");
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Xatolik yuz berdi");
    }
  };

  // 3. Depozitni rad etish
  const handleRejectDeposit = async (id: number) => {
    const reason = prompt("Rad etish sababini kiriting:");
    if (!reason) return;
    try {
      await api.post(`/billing/admin/deposits/${id}/reject/`, { notes: reason });
      alert("Depozit rad etildi.");
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Xatolik yuz berdi");
    }
  };

  // 4. Pul yechishni to'langan deb belgilash
  const handleProcessWithdrawal = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/billing/admin/withdrawals/${id}/process/`, { action });
      alert(action === 'approve' ? "Pul yechish to‘landi deb belgilandi!" : "Rad etildi");
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Xatolik yuz berdi");
    }
  };

  // 5. Prop Imtihonga MT5 demo berish
  const handleApprovePropExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePropId || !mt5Login || !mt5Password) return;

    try {
      await api.post(`/prop/admin/exams/${activePropId}/approve/`, {
        mt5_login: mt5Login,
        mt5_password: mt5Password,
        mt5_server: mt5Server,
      });
      alert("MT5 Demo hisob ma'lumotlari foydalanuvchiga yuborildi va imtihon faollashdi!");
      setActivePropId(null);
      setMt5Login('');
      setMt5Password('');
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Xatolik");
    }
  };

  // 6. Karta ma'lumotlarini yangilash
  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    try {
      await api.post('/billing/admin/card-details/', card);
      alert("Karta sozlamalari saqlandi!");
      loadAll();
    } catch (err: any) {
      alert("Saqlashda xatolik");
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">
            Xorazm Forex Boshqaruv Markazi
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            Admin Nazorat Paneli
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            NAV: <strong className="text-emerald-400 font-mono">${pool?.current_nav}</strong> •
            Kapital: <strong className="text-white font-mono">${pool?.total_equity_usd}</strong> •
            Jami Units: <strong className="text-cyan-400 font-mono">{pool?.total_units}</strong>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800">
        {[
          { id: 'sessions', label: 'Savdo Sessiyasi (+$70)', icon: TrendingUp },
          { id: 'deposits', label: `Depozit Cheklari (${deposits.filter(d => d.status === 'PENDING').length})`, icon: CreditCard },
          { id: 'withdrawals', label: `Pul Yechish (${withdrawals.filter(w => w.status === 'PENDING').length})`, icon: DollarSign },
          { id: 'prop', label: `Imtihon Arizalari (${propExams.filter(p => p.status === 'PENDING_PAYMENT_APPROVAL').length})`, icon: Zap },
          { id: 'card', label: 'Karta va Kurs Sozlamalari', icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition ${
                isActive
                  ? 'border-amber-500 text-amber-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Execute Trade Session Form */}
      {tab === 'sessions' && (
        <div className="max-w-2xl rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-500 block">
              Dinamik Taqsimot Dvigateli
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Savdo Sessiyasi Natijasini Kiritish
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              "70$ foyda yopdim deb adminkada komanda tashiman..." — kiritilgan summa 50/50 taqsimlanadi va barcha investorlar hamda referallarga WebSocket orqali real-time yetkaziladi.
            </p>
          </div>

          {sessionSuccess && (
            <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800 p-4 text-xs text-emerald-300 font-medium">
              {sessionSuccess}
            </div>
          )}

          <form onSubmit={handleExecuteSession} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Yalpi Foyda / Zarar Miqdori (USD):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={grossProfit}
                  onChange={(e) => setGrossProfit(parseFloat(e.target.value) || 0)}
                  placeholder="Masalan: 70.00"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-8 pr-4 text-base font-black text-white font-mono focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Split Preview */}
            <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-2 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Taqsimot Namunasi:
              </span>
              <div className="flex justify-between items-center text-slate-300">
                <span>XF Kompaniya daromadi (50%):</span>
                <strong className="text-white font-mono">+${(grossProfit * 0.50).toFixed(2)}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Investorlar jamg‘armasiga (50%):</span>
                <strong className="text-emerald-400 font-mono">+${(grossProfit * 0.50).toFixed(2)}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                <span>* Referali bor investorlar ulushidan:</span>
                <span className="text-purple-400 font-mono">5% referalga avtomat o‘tadi</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Treyder Modeli:
              </label>
              <select
                value={traderType}
                onChange={(e) => setTraderType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white focus:border-red-600 focus:outline-none"
              >
                <option value="XF">XF Boshqaruvi (50% XF / 50% Investorlar)</option>
                <option value="EXTERNAL">Tashqi Treyder (25% XF / 25% Treyder / 50% Investorlar)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Izoh / Sessiya qaydlari:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={sessionLoading}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-4 text-sm font-black text-white shadow-xl shadow-red-950 hover:from-red-500 hover:to-red-600 transition disabled:opacity-50"
            >
              {sessionLoading ? 'Taqsimlanmoqda...' : 'Sessiyani Yakunlash va Taqsimlash'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: P2P Deposit Requests */}
      {tab === 'deposits' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6 space-y-4">
          <h3 className="text-xl font-black text-white">
            Kelib Tushgan Depozit Cheklari
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Investor</th>
                  <th className="py-3 px-4">Summa (USD)</th>
                  <th className="py-3 px-4">Summa (UZS)</th>
                  <th className="py-3 px-4">Chek Rasmi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {deposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {d.user_name}
                      <span className="block text-xs text-slate-400 font-mono">{d.user_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${d.amount_usd}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{parseFloat(d.amount_uzs).toLocaleString()} UZS</td>
                    <td className="py-3.5 px-4">
                      {d.receipt_image ? (
                        <button
                          onClick={() => setViewImage(`${API_BASE_URL}${d.receipt_image}`)}
                          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
                        >
                          <Eye className="h-4 w-4" />
                          Chekni ko‘rish
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs">Yuklanmagan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold ${d.status === 'APPROVED' ? 'text-emerald-400' : d.status === 'REJECTED' ? 'text-red-400' : 'text-amber-400'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {d.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveDeposit(d.id)}
                            className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition"
                          >
                            Tasdiqlash
                          </button>
                          <button
                            onClick={() => handleRejectDeposit(d.id)}
                            className="rounded-lg bg-red-900/60 hover:bg-red-800 px-3 py-1.5 text-xs font-bold text-red-300 transition"
                          >
                            Rad etish
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Withdrawal Requests */}
      {tab === 'withdrawals' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6 space-y-4">
          <h3 className="text-xl font-black text-white">
            Pul Yechish So‘rovlari
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Investor</th>
                  <th className="py-3 px-4">Summa</th>
                  <th className="py-3 px-4">Karta Raqami</th>
                  <th className="py-3 px-4">Karta Egasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {w.user_name}
                      <span className="block text-xs text-slate-400 font-mono">{w.user_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      ${w.amount_usd} ({parseFloat(w.amount_uzs).toLocaleString()} UZS)
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white font-bold">{w.target_card_number}</td>
                    <td className="py-3.5 px-4 text-slate-300 uppercase">{w.target_card_holder}</td>
                    <td className="py-3.5 px-4 font-bold text-xs">{w.status}</td>
                    <td className="py-3.5 px-4">
                      {w.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleProcessWithdrawal(w.id, 'approve')}
                            className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition"
                          >
                            To‘landi (Chiqarish)
                          </button>
                          <button
                            onClick={() => handleProcessWithdrawal(w.id, 'reject')}
                            className="rounded-lg bg-red-900/60 hover:bg-red-800 px-3 py-1.5 text-xs font-bold text-red-300 transition"
                          >
                            Rad etish
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Prop Exams */}
      {tab === 'prop' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6 space-y-4">
          <h3 className="text-xl font-black text-white">
            Prop Imtihon Arizalari (100 000 so‘mlik to‘lovlar)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Treyder</th>
                  <th className="py-3 px-4">To‘lov</th>
                  <th className="py-3 px-4">Chek</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">MT5 Hisob</th>
                  <th className="py-3 px-4">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {propExams.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.user_name}
                      <span className="block text-xs text-slate-400 font-mono">{p.user_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">100 000 UZS</td>
                    <td className="py-3.5 px-4">
                      {p.receipt_image ? (
                        <button
                          onClick={() => setViewImage(`${API_BASE_URL}${p.receipt_image}`)}
                          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
                        >
                          <Eye className="h-4 w-4" />
                          Chekni ko‘rish
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-xs">{p.status}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      {p.mt5_login ? `Login: ${p.mt5_login}` : "Berilmagan"}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'PENDING_PAYMENT_APPROVAL' && (
                        <button
                          onClick={() => setActivePropId(p.id)}
                          className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-black text-black transition"
                        >
                          MT5 Demo Berish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Card & Exchange Rate Settings */}
      {tab === 'card' && card && (
        <div className="max-w-xl rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-black text-white">
            P2P Karta va Valyuta Kursi Sozlamalari
          </h3>

          <form onSubmit={handleUpdateCard} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Karta Raqami (Uzcard / Humo):
              </label>
              <input
                type="text"
                value={card.card_number}
                onChange={(e) => setCard({ ...card, card_number: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white font-mono font-bold focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Karta Egasining Ism-Familiyasi:
              </label>
              <input
                type="text"
                value={card.card_holder}
                onChange={(e) => setCard({ ...card, card_holder: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white font-bold uppercase focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Bank Nomi:
              </label>
              <input
                type="text"
                value={card.bank_name}
                onChange={(e) => setCard({ ...card, bank_name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Valyuta Kursi (1 USD necha UZS):
              </label>
              <input
                type="number"
                value={card.exchange_rate_usd_uzs}
                onChange={(e) => setCard({ ...card, exchange_rate_usd_uzs: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-sm text-white font-mono font-bold focus:border-red-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 text-sm font-black text-white hover:from-red-500 hover:to-red-600 transition"
            >
              Sozlamalarni Saqlash
            </button>
          </form>
        </div>
      )}

      {/* MT5 Modal */}
      {activePropId && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setActivePropId(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div ref={mt5ModalRef} className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
            <h4 className="text-lg font-black text-white mb-4">
              Alpari MT5 Demo Hisob Ma'lumotlarini Kiritish
            </h4>
            <form onSubmit={handleApprovePropExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  MT5 Login (Hisob Raqami):
                </label>
                <input
                  type="text"
                  required
                  value={mt5Login}
                  onChange={(e) => setMt5Login(e.target.value)}
                  placeholder="Masalan: 8849201"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  MT5 Parol:
                </label>
                <input
                  type="text"
                  required
                  value={mt5Password}
                  onChange={(e) => setMt5Password(e.target.value)}
                  placeholder="TraderPass2026!"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Server Nomi:
                </label>
                <input
                  type="text"
                  value={mt5Server}
                  onChange={(e) => setMt5Server(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-sm text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePropId(null)}
                  className="w-1/2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-amber-500 py-3 text-xs font-black text-black hover:bg-amber-400"
                >
                  Tasdiqlash & Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full image viewer */}
      {viewImage && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setViewImage(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div ref={viewImageModalRef} className="relative max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setViewImage(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-lg"
            >
              Yopish
            </button>
            <img src={viewImage} alt="Receipt" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
};
