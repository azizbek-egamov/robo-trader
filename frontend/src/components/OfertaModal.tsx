import React from 'react';
import { useModalKeyEvents } from '../hooks/useModalKeyEvents';
import { X, ShieldAlert, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

interface OfertaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfertaModal: React.FC<OfertaModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useModalKeyEvents<HTMLDivElement>({
    isOpen,
    onClose,
    enableEnterNavigation: false,
  });

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div ref={modalRef} className="relative w-full max-w-2xl max-h-[88vh] rounded-3xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 shadow-2xl flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-950/80 border border-red-800/40 text-red-500">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              Ommaviy Oferta va Shartlar
            </h3>
            <span className="text-xs text-slate-400">
              Xorazm Forex servislaridan foydalanish qoidalari va xatarlar to‘g‘risida ogohlantirish
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-2 my-5 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          {/* Section 1 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <span className="flex h-5 w-5 rounded-full bg-red-600/20 text-red-400 text-xs items-center justify-center font-bold">1</span>
              <span>Loyihaning Maqsadi</span>
            </div>
            <p className="text-slate-400">
              Loyihaning bosh maqsadi — sohaga yangi qiziquvchilar turli noqonuniy va firibgar (scam) loyihalarda adashib yurmasliklari, tushunib-tushunmas sarmoya kiritib pullarini yo‘qotmasliklarini ta’minlashdir.
            </p>
            <p className="text-slate-400">
              Treyding sohasiga haqiqiy qiziqishingiz bo‘lsayu, mustaqil savdo qilishni o‘rgana olmagan bo‘lsangiz, bizning servislarimiz orqali savdo jarayonlarida to‘liq shaffoflik bilan ishtirok etishingiz mumkin.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
              <ShieldAlert className="h-4 w-4" />
              <span>Xatarlar va Kafolatlar Yo‘qligi (Risk Warning)</span>
            </div>
            <p className="text-slate-300">
              <strong>Foyda kafolatlanmaydi!</strong> Moliyaviy va Forex bozorlaridagi har qanday investitsiya yuqori xatarlar (risklar) bilan bevosita bog‘liq. O‘tmishdagi ijobiy ko‘rsatkichlar kelajakda daromadni kafolatlamaydi.
            </p>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <span className="flex h-5 w-5 rounded-full bg-cyan-600/20 text-cyan-400 text-xs items-center justify-center font-bold">2</span>
              <span>To‘liq Shaffoflik va Investor Paroli</span>
            </div>
            <p className="text-slate-400">
              Investor paroli (Investor Password) orqali barcha MT5 savdo operatsiyalarini shaxsiy kabinetingizdagi foyda va zarar tranzaksiyalari bilan bemalol real vaqtda solishtirib ko‘rishingiz mumkin. Har bir operatsiya yopiq emas, shaffof audit qilinadi.
            </p>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <span className="flex h-5 w-5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs items-center justify-center font-bold">3</span>
              <span>Umumiy G‘aznadagi Savdolar va 50/50 Taqsimot</span>
            </div>
            <p className="text-slate-400">
              Umumiy g‘aznadagi savdolar hozir to‘liq <strong>faol (aktiv)</strong>. Har qanday ishtirokchi mablag‘ kiritadi, pul professional savdolarga yo‘naltiriladi va to‘liq hisobot beriladi.
            </p>
            <p className="text-slate-400">
              Pul yechilganda daromadning <strong>50% qismi XF jamoasiga</strong>, <strong>50% qismi esa qolgan barcha mablag‘ egalariga (investorlarga)</strong> ularning units ulushiga proporsional tarzda avtomatik taqdim etiladi.
            </p>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <span className="flex h-5 w-5 rounded-full bg-purple-600/20 text-purple-400 text-xs items-center justify-center font-bold">4</span>
              <span>Pul Yechish Tartibi</span>
            </div>
            <p className="text-slate-400">
              Mablag‘lar va hisoblangan daromadlarni <strong>haftaning har Juma kuni</strong> muntazam ravishda kartaga yechib olish mumkin.
            </p>
          </div>

          {/* Section 6 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <span className="flex h-5 w-5 rounded-full bg-slate-700 text-slate-300 text-xs items-center justify-center font-bold">5</span>
              <span>Kelajakdagi Servislar (Roadmap)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800 text-center">
                <span className="text-xs font-bold text-white block">CopyTrade</span>
                <span className="text-[10px] text-amber-400 uppercase font-black">Tez kunda (Soon)</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800 text-center">
                <span className="text-xs font-bold text-white block">Full Robot</span>
                <span className="text-[10px] text-amber-400 uppercase font-black">Tez kunda (Soon)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Ro‘yxatdan o‘tgan har bir foydalanuvchi ushbu shartlarga rozilik bildirgan hisoblanadi.
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-red-700 hover:bg-red-600 px-6 py-2.5 text-xs font-black text-white transition"
          >
            Tushundim
          </button>
        </div>

      </div>
    </div>
  );
};

