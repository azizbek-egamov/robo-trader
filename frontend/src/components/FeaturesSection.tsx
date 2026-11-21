import React from 'react';
import { Reveal } from './Reveal';
import {
  TrendingUp,
  Shield,
  Layers,
  Users,
  Lock
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Layers,
      color: "text-red-400 bg-red-950/50 border-red-800/40",
      title: "Investment Units + NAV",
      desc: "Fond mexanizmi. Depozit kiritilgan vaqtdagi NAV bo‘yicha Units beriladi. Yangi investorlar avvalgi investorlarning ishlab topgan foydasiga da'vo qilolmaydi."
    },
    {
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-950/50 border-emerald-800/40",
      title: "50% XF / 50% Investorlar",
      desc: "Master hisobdagi har bir muvaffaqiyatli sessiyadan olingan sof foydaning yarmi avtomatik tarzda investorlar balansiga units ulushiga ko‘ra taqsimlanadi."
    },
    {
      icon: Users,
      color: "text-purple-400 bg-purple-950/50 border-purple-800/40",
      title: "5% Hamkorlik (Referal) Dasturi",
      desc: "Platformaga taklif qilgan do‘stingiz ishlab topgan har bir sof foydasidan 5% sizning hisobingizga doimiy passiv bonus sifatida o‘tkazib beriladi."
    },
    {
      icon: Shield,
      color: "text-cyan-400 bg-cyan-950/50 border-cyan-800/40",
      title: "High-Water Mark Kafolati",
      desc: "Agar hisobda avval zarar bo‘lsa, u to‘liq qoplanmaguncha XF o‘ziga komissiya ushlamaydi. Sizning kapitalingiz maksimal darajada himoyalangan."
    },
    {
      icon: Lock,
      color: "text-amber-400 bg-amber-950/50 border-amber-800/40",
      title: "Double-Entry Moliyaviy Ledger",
      desc: "Hech qanday balans qo‘lda o‘zgartirilmaydi. Har bir kirim, chiqim va taqsimot tranzaksiya jurnali (Ledger) orqali yozib boriladi va tekshirilishi mumkin."
    },
    {
      icon: TrendingUp,
      color: "text-rose-400 bg-rose-950/50 border-rose-800/40",
      title: "Tezkor P2P Karta Tranzaksiyalari",
      desc: "Uzcard va Humo kartalari orqali to‘g‘ridan-to‘g‘ri kiritish va chiqarish. Barcha so‘rovlar admin tomonidan tezkor tasdiqlanadi."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#090d16] border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Nega XF CopyTrade?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Kapitalni Boshqarishning Zamonaviy Standarti
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Oddiy shubhali tizimlar emas, balki xalqaro investitsiya fondlari tamoyillariga asoslangan ishonchli mexanizm.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div
                  className="rounded-3xl border border-slate-800 bg-[#0f172a]/60 p-6 sm:p-8 hover:border-slate-700 hover:bg-[#0f172a] transition duration-300 space-y-4 h-full"
                >
                  <div className={`inline-flex p-3 rounded-2xl border ${f.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
