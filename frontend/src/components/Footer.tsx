import React from 'react';
import { TrendingUp, Phone, Send, MapPin, Globe, FileText } from 'lucide-react';

interface FooterProps {
  onOpenOferta: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOferta, onOpenAdmin }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#06080e] pt-16 pb-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid gap-10 md:grid-cols-12">
          
          {/* Col 1 */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Xorazm Forex Logo"
                className="h-10 w-10 object-contain drop-shadow-md"
              />
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  XORAZM FOREX
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
                  Trading Academy & Invest
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              O‘zbekistondagi professional treyding akademiyasi, XF Master Account orqali passiv investitsiya va 100 000 so‘mlik saralash imtihoni ekotizimi.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/xorazmforex"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-red-600 transition"
                title="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/xfprop"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-amber-500 transition"
                title="Menedjer"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              Platforma & Hujjatlar
            </span>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#hero" className="hover:text-red-400 transition">XF CopyTrade Master</a></li>
              <li><a href="#prop-section" className="hover:text-amber-400 transition">100k Imtihon</a></li>
              <li><a href="#leaderboard-section" className="hover:text-white transition">Leaderboard & XP</a></li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOferta}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition underline font-bold"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Ommaviy oferta (Shartlar)</span>
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="text-slate-500 hover:text-amber-400 transition flex items-center gap-1 font-mono text-[11px]"
                  >
                    🔒 Admin Boshqaruvi
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              Aloqa & Markaz
            </span>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <span>Ofis: <a href="tel:+998975600600" className="font-bold text-white hover:underline">+998 97 560 06 00</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Menedjer: <a href="tel:+998874600600" className="font-bold text-white hover:underline">+998 87 460 06 00</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Urganch shahri, Xorazm viloyati</span>
              </div>
            </div>
          </div>

        </div>

        {/* Risk Disclaimer based on oferta.txt */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4 text-[11px] leading-relaxed text-slate-500 space-y-1">
          <strong className="text-slate-400 block">Xatar haqida ogohlantirish (Risk Warning):</strong>
          <p>Foyda kafolatlanmaydi! Moliyaviy va Forex bozorlarida savdo qilish yuqori risklar bilan bog‘liq. Investor paroli orqali savdolarni shaxsiy kabinetingizdagi foyda va zarar tranzaksiyalari bilan bemalol solishtirib ko‘rishingiz mumkin. Haftaning har juma kuni daromad yechib olish mumkin.</p>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span>© 2026 XORAZM FOREX — XF CopyTrade & Imtihon Platformasi. Barcha huquqlar himoyalangan.</span>
          <button
            onClick={onOpenOferta}
            className="hover:text-slate-400 transition underline"
          >
            Ommaviy oferta va qoidalar
          </button>
        </div>
      </div>
    </footer>
  );
};
