import React from 'react';
import { Reveal } from './Reveal';
import {
  Zap,
  Target,
  ShieldAlert,
  Award,
  ArrowRight
} from 'lucide-react';

interface PropTradingSectionProps {
  onOpenPropModal: () => void;
}

export const PropTradingSection: React.FC<PropTradingSectionProps> = ({ onOpenPropModal }) => {
  return (
    <section id="prop-section" className="py-16 md:py-24 bg-[#090d16] border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/30 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
              <Zap className="h-4 w-4" />
              Xorazm Forex Saralash Dasturi
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              100 000 so‘m bilan Imtihon Topshiring
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Mahoratingizni ko‘rsating, 9% maqsadni bajaring va $10 000 lik haqiqiy XF kapitalini boshqaruvchi rasmiy treyderiga aylaning!
            </p>
          </div>
        </Reveal>

        {/* Main Imtihon Card */}
        <Reveal direction="up" delay={120}>
          <div className="mt-12 max-w-4xl mx-auto rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-[#131b2e] to-[#0b0f19] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              
              {/* Left: Info & Pricing */}
              <div className="md:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-amber-500/20 border border-amber-500/40 p-2.5 text-amber-400">
                    <Award className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      Standart Imtihon Sinovi
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      Alpari MT5 Demo Hisob beriladi
                    </span>
                  </div>
                </div>

                {/* Price Tag */}
                <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 inline-block">
                  <span className="text-xs uppercase font-bold text-slate-400 block">
                    Imtihon To‘lovi:
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-400">
                      100 000 so‘m
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      (Bir martalik to‘lov)
                    </span>
                  </div>
                </div>

                {/* Rules List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm font-bold text-white block">
                        Target Foyda: 9% ($900)
                      </strong>
                      <span className="text-xs text-slate-400">
                        Imtihonni muvaffaqiyatli topshirish uchun 9% profit talab qilinadi.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm font-bold text-white block">
                        Kunlik Maksimal Zarar: 4% ($400)
                      </strong>
                      <span className="text-xs text-slate-400">
                        Bir savdo kunida depozitning 4% dan ortiq tushib ketmasligi shart.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm font-bold text-white block">
                        Umumiy Maksimal Zarar: 6% ($600)
                      </strong>
                      <span className="text-xs text-slate-400">
                        Butun imtihon davomida hisob 6% dan pastga tushmasligi kerak.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: How to Get Started & Action */}
              <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-[#070a12]/80 p-6 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                  Qanday Ishlaydi?
                </span>

                <ol className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">1</span>
                    <span>100 000 so‘m to‘lov qilasiz va chekni yuklaysiz.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">2</span>
                    <span>Admin tekshirib, shaxsiy kabinetingizga <strong>Alpari MT5 Demo Login va Parol</strong> yuboradi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">3</span>
                    <span>Savdo qilib 9% target bajarasiz va real kapital olasiz!</span>
                  </li>
                </ol>

                <button
                  onClick={onOpenPropModal}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-amber-950 transition hover:from-amber-400 hover:to-amber-500 mt-2"
                >
                  <span>Imtihonga Yozilish</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
