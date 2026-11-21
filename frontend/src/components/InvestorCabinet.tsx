import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DepositRequest, WithdrawalRequest, PropExam, TransactionLedgerItem } from '../types';
import {
  DollarSign,
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownCircle,
  Copy,
  Check,
  Zap,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface InvestorCabinetProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenProp: () => void;
}

export const InvestorCabinet: React.FC<InvestorCabinetProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenProp,
}) => {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'prop' | 'referral' | 'ledger'>('deposits');
  
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [propExams, setPropExams] = useState<PropExam[]>([]);
  const [ledger, setLedger] = useState<TransactionLedgerItem[]>([]);
  const [copiedRef, setCopiedRef] = useState(false);

  const loadData = () => {
    refreshProfile();
    api.get('/billing/deposit/my/').then((res) => setDeposits(res.data)).catch(console.error);
    api.get('/billing/withdraw/my/').then((res) => setWithdrawals(res.data)).catch(console.error);
    api.get('/prop/my/').then((res) => setPropExams(res.data)).catch(console.error);
    api.get('/billing/ledger/my/').then((res) => setLedger(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyReferral = () => {
    if (user?.referral_code) {
      const link = `${window.location.origin}/?ref=${user.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
      case 'PASSED':
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            {status}
          </span>
        );
      case 'REJECTED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-950/80 border border-red-800/50 px-2.5 py-0.5 text-xs font-bold text-red-400">
            <AlertCircle className="h-3 w-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/80 border border-amber-800/50 px-2.5 py-0.5 text-xs font-bold text-amber-400">
            <Clock className="h-3 w-3" />
            Kutilmoqda
          </span>
        );
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
            Shaxsiy Investor Kabineti
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            Xush kelibsiz, {user?.full_name}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Telefon: <strong className="text-white font-mono">{user?.phone}</strong> •
            Rol: <strong className="text-red-400">{user?.role}</strong> •
            XP: <strong className="text-amber-400">{user?.xp_points} ball</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 text-xs font-black text-white shadow-lg shadow-red-950 hover:from-red-500 hover:to-red-600 transition"
          >
            <ArrowDownCircle className="h-4 w-4" />
            Depozit (P2P)
          </button>
          <button
            onClick={onOpenWithdraw}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-5 py-3 text-xs font-black text-white hover:bg-slate-700 transition"
          >
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
            Pul Yechish
          </button>
          <button
            onClick={onOpenProp}
            className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/20 px-5 py-3 text-xs font-black text-amber-300 hover:bg-amber-950/40 transition"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            100k Imtihon
          </button>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Portfel Qiymati */}
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Portfel Qiymati</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-mono">
              ${parseFloat(user?.current_value_usd || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-xs text-slate-400 mt-1 font-mono">
              {parseFloat(user?.units || '0').toFixed(4)} Units
            </span>
          </div>
        </div>

        {/* Card 2: Foyda */}
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Ishlab Topilgan Foyda</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              +${parseFloat(user?.total_profit_earned_usd || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-xs text-slate-400 mt-1">
              50/50 taqsimot natijasida
            </span>
          </div>
        </div>

        {/* Card 3: Referal daromad */}
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Referal Daromadi (5%)</span>
            <Coins className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-purple-400 font-mono">
              +${parseFloat(user?.referral_earnings_usd || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-xs text-slate-400 mt-1">
              Taklif qilinganlar foydasidan
            </span>
          </div>
        </div>

        {/* Card 4: Kiritilgan / Yechilgan */}
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/80 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Depozit / Yechilgan</span>
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-mono">
              ${parseFloat(user?.total_deposited_usd || '0').toFixed(0)} / ${parseFloat(user?.total_withdrawn_usd || '0').toFixed(0)}
            </span>
            <span className="block text-xs text-slate-400 mt-1">
              Jami kirim va chiqim
            </span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 flex flex-wrap gap-2">
        {[
          { id: 'deposits', label: 'Depozitlarim', icon: ArrowDownCircle },
          { id: 'withdrawals', label: 'Pul Yechishlarim', icon: ArrowUpRight },
          { id: 'prop', label: 'Imtihonlarim (MT5)', icon: Zap },
          { id: 'referral', label: 'Referal (5% Daromad)', icon: Users },
          { id: 'ledger', label: 'Tranzaksiyalar (Ledger)', icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition ${
                isActive
                  ? 'border-red-600 text-white bg-slate-900/50'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Deposits */}
      {activeTab === 'deposits' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white">
              Kiritilgan Depozit So‘rovlari
            </h3>
            <button
              onClick={onOpenDeposit}
              className="text-xs font-bold text-red-400 hover:text-red-300"
            >
              + Yangi depozit
            </button>
          </div>

          {deposits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Depozit ID</th>
                    <th className="py-3 px-4">Summa (USD)</th>
                    <th className="py-3 px-4">Summa (UZS)</th>
                    <th className="py-3 px-4">Berilgan Units</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{dep.deposit_id}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${dep.amount_usd}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{parseFloat(dep.amount_uzs).toLocaleString()} UZS</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">{dep.units_credited || "—"}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(dep.status)}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{new Date(dep.created_at).toLocaleDateString('uz-UZ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-6 text-center">Hozircha depozitlar mavjud emas.</p>
          )}
        </div>
      )}

      {/* Tab 2: Withdrawals */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white">
              Pul Yechish So‘rovlari
            </h3>
            <button
              onClick={onOpenWithdraw}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              + Pul yechish
            </button>
          </div>

          {withdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">So‘rov ID</th>
                    <th className="py-3 px-4">Summa (USD)</th>
                    <th className="py-3 px-4">Qabul Karta</th>
                    <th className="py-3 px-4">Karta Egasi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {withdrawals.map((wth) => (
                    <tr key={wth.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{wth.withdrawal_id}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">${wth.amount_usd}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{wth.target_card_number}</td>
                      <td className="py-3.5 px-4 text-slate-300 uppercase">{wth.target_card_holder}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(wth.status)}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{new Date(wth.created_at).toLocaleDateString('uz-UZ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-6 text-center">Hozircha pul yechish so‘rovlari yo‘q.</p>
          )}
        </div>
      )}

      {/* Tab 3: Prop Exams */}
      {activeTab === 'prop' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">
                Mening Prop-Trading Imtihonlarim
              </h3>
              <p className="text-xs text-slate-400">
                100 000 so‘mlik to‘lov tasdiqlanganidan so‘ng, admin bergan MT5 login va parollari bu yerda ko‘rinadi.
              </p>
            </div>
            <button
              onClick={onOpenProp}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-black hover:bg-amber-400 transition"
            >
              + Imtihon topshirish
            </button>
          </div>

          {propExams.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {propExams.map((exam) => (
                <div
                  key={exam.id}
                  className="rounded-2xl border border-slate-800 bg-[#070a12] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {exam.exam_id}
                    </span>
                    {getStatusBadge(exam.status)}
                  </div>

                  {exam.status === 'ACTIVE' && exam.mt5_login ? (
                    <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <KeyRound className="h-4 w-4" />
                        <span>Alpari MT5 Demo Hisob Ma'lumotlari:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Server:</span>
                          <strong className="text-white">{exam.mt5_server}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Demo Balans:</span>
                          <strong className="text-emerald-400">${parseFloat(exam.demo_balance_usd).toFixed(0)}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Login (Hisob raqam):</span>
                          <strong className="text-amber-400 text-sm">{exam.mt5_login}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Parol:</span>
                          <strong className="text-amber-400 text-sm">{exam.mt5_password}</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-900 p-3 text-xs text-slate-400">
                      To‘lovingiz admin tomonidan tekshirilmoqda. Tasdiqlanishi bilan MT5 login va parollari bu yerga chiqadi.
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Target:</span>
                      <strong className="text-white">{exam.target_profit_percent}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Kunlik Limit:</span>
                      <strong className="text-red-400">{exam.daily_loss_percent}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Maksimal:</span>
                      <strong className="text-amber-400">{exam.max_loss_percent}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-6 text-center">
              Sizda hali prop imtihonlar yo‘q. 100 000 so‘m bilan sinovdan o‘ting!
            </p>
          )}
        </div>
      )}

      {/* Tab 4: Referral */}
      {activeTab === 'referral' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-purple-400">
              Hamkorlik Dasturi
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Do‘stingiz Foydasidan 5% Doimiy Bonus
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Sizning referal havolangiz orqali ro‘yxatdan o‘tgan do‘stingiz har safar Master hisob savdosidan sof foyda olganida, uning daromadidan <strong>5% sizning hisobingizga avtomatik</strong> tushadi!
            </p>
          </div>

          {/* Referral link box */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-5 max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 block">
              Sizning Maxsus Taklif Havolangiz:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/?ref=${user?.referral_code || ''}`}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3.5 text-xs text-white font-mono"
              />
              <button
                onClick={handleCopyReferral}
                className="flex items-center gap-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition shrink-0"
              >
                {copiedRef ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedRef ? 'Nusxalandi' : 'Nusxa olish'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span>Referal kodi:</span>
              <strong className="text-purple-400 font-mono text-sm uppercase">{user?.referral_code}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-black text-white">
              Moliyaviy Tranzaksiyalar Jurnali (Double-Entry Ledger)
            </h3>
            <p className="text-xs text-slate-400">
              Hisobingizdagi har bir kirim, chiqim va foyda taqsimoti bu yerda qat'iy saqlanadi.
            </p>
          </div>

          {ledger.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Tranzaksiya</th>
                    <th className="py-3 px-4">Tafsilot</th>
                    <th className="py-3 px-4">Summa (USD)</th>
                    <th className="py-3 px-4">Units O‘zgarishi</th>
                    <th className="py-3 px-4">Qolgan Balans</th>
                    <th className="py-3 px-4">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {ledger.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-bold text-white text-xs">{l.tx_type}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">{l.description}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {parseFloat(l.amount_usd) > 0 ? `+$${l.amount_usd}` : `$${l.amount_usd}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400 text-xs">{l.units_delta}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">${l.balance_after_usd}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{new Date(l.created_at).toLocaleString('uz-UZ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-6 text-center">Hozircha tranzaksiyalar jurnali bo‘sh.</p>
          )}
        </div>
      )}

    </div>
  );
};

