import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Award,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Zap,
  Menu,
  X,
  FileText
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'landing' | 'cabinet' | 'admin' | 'prop' | 'leaderboard';
  setActiveTab: (tab: 'landing' | 'cabinet' | 'admin' | 'prop' | 'leaderboard') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenOferta: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenOferta
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070a12]/95 backdrop-blur-xl">
      {/* Main Bar */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Official Brand Logo (/images/logo.png) */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 text-left group"
        >
          <img
            src="/images/logo.png"
            alt="Xorazm Forex Logo"
            className="h-11 w-11 object-contain drop-shadow-md group-hover:scale-105 transition"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                XORAZM FOREX
              </span>
              <span className="rounded bg-red-950/90 px-1.5 py-0.5 text-[9px] font-black uppercase text-red-400 border border-red-800/50">
                COPYTRADE
              </span>
            </div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Trading Academy & Invest
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'landing'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Bosh Sahifa
          </button>
          
          <button
            onClick={() => setActiveTab('prop')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'prop'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-900'
            }`}
          >
            <Zap className="h-4 w-4 text-amber-400" />
            Imtihon (100k)
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="h-4 w-4 text-amber-400" />
            Leaderboard
          </button>

          <button
            onClick={onOpenOferta}
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition flex items-center gap-1"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            Oferta
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('cabinet')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'cabinet'
                  ? 'bg-red-700 text-white shadow-lg shadow-red-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              Kabinetim
            </button>
          )}

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-black'
                : isAdmin
                  ? 'text-amber-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 border border-slate-800'
            }`}
            title="Boshqaruvchi Admin Paneli"
          >
            <Shield className="h-4 w-4 text-amber-500" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right side: Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-sm font-bold text-white">
                  {user?.full_name}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 font-mono">
                  <span>${user?.current_value_usd || '0.00'}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400">{user?.xp_points} XP</span>
                </span>
              </div>
              <button
                onClick={logout}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-red-400 hover:border-red-900 transition"
                title="Chiqish"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:border-slate-600 hover:bg-slate-800 transition"
              >
                <LogIn className="h-3.5 w-3.5 text-red-500" />
                Kirish
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950 transition hover:from-red-500 hover:to-red-600"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Ro‘yxatdan o‘tish
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b0f19] p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left p-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Bosh Sahifa
          </button>
          
          <button
            onClick={() => { setActiveTab('prop'); setMobileMenuOpen(false); }}
            className="w-full text-left p-2.5 rounded-xl text-sm font-bold text-amber-400 hover:bg-slate-800 flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Imtihon (100k so‘m)
          </button>

          <button
            onClick={() => { setActiveTab('leaderboard'); setMobileMenuOpen(false); }}
            className="w-full text-left p-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            Leaderboard
          </button>

          <button
            onClick={() => { onOpenOferta(); setMobileMenuOpen(false); }}
            className="w-full text-left p-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Ommaviy oferta
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => { setActiveTab('cabinet'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-xl text-sm font-bold bg-red-900/40 text-red-300 border border-red-800/50"
              >
                Kabinetim ({user?.full_name}) - ${user?.current_value_usd}
              </button>
          <button
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-black font-black'
                : isAdmin
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-800/50'
                  : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Shield className="h-4 w-4 text-amber-500" />
            <span>Admin Panel</span>
          </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-slate-800 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Chiqish
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white"
              >
                Kirish
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-red-700 text-center text-xs font-bold text-white"
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
