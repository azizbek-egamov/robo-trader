import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider, useWebSocket } from './context/WebSocketContext';
import { api } from './services/api';
import { InvestmentPool, NAVHistoryPoint, TradeSession } from './types';

import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { LiveNotifications } from './components/LiveNotifications';
import { HeroSection } from './components/HeroSection';
import { NAVChartSection } from './components/NAVChartSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PropTradingSection } from './components/PropTradingSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { InvestorCabinet } from './components/InvestorCabinet';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginGate } from './components/AdminLoginGate';
import { Footer } from './components/Footer';

import { AuthModal } from './components/AuthModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { PropExamModal } from './components/PropExamModal';
import { OfertaModal } from './components/OfertaModal';

import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { latestAlert, clearAlert } = useWebSocket();

  const [activeTab, setActiveTab] = useState<'landing' | 'cabinet' | 'admin' | 'prop' | 'leaderboard'>('landing');

  // Modals
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [propModalOpen, setPropModalOpen] = useState(false);
  const [ofertaModalOpen, setOfertaModalOpen] = useState(false);

  // Pool & Market Data
  const [pool, setPool] = useState<InvestmentPool | null>(null);
  const [navHistory, setNavHistory] = useState<NAVHistoryPoint[]>([]);
  const [sessions, setSessions] = useState<TradeSession[]>([]);

  const loadData = () => {
    api.get('/invest/pool/').then((res) => setPool(res.data)).catch(console.error);
    api.get('/invest/nav-history/').then((res) => setNavHistory(res.data)).catch(console.error);
    api.get('/invest/sessions/').then((res) => setSessions(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadData();

    // Check URL parameters, hash or pathname for admin or referral
    if (
      window.location.pathname.includes('/admin') ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin')
    ) {
      setActiveTab('admin');
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && !isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'register' });
    }
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleOpenDeposit = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' });
    } else {
      setDepositModalOpen(true);
    }
  };

  const handleOpenWithdraw = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' });
    } else {
      setWithdrawModalOpen(true);
    }
  };

  const handleOpenPropModal = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' });
    } else {
      setPropModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-red-950 selection:text-red-300">
      
      {/* 1. Seamless XF Loading Screen Animation */}
      <LoadingScreen />

      {/* Global WebSocket Alert Banner */}
      {latestAlert && (
        <div className="fixed top-24 right-5 z-50 max-w-md animate-fade-in">
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/50 bg-[#0f172a]/95 p-4 shadow-2xl backdrop-blur-xl">
            {latestAlert.type === 'PROFIT' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 pr-2">
              <strong className="block text-xs font-black text-white uppercase tracking-wider">
                {latestAlert.title}
              </strong>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {latestAlert.message}
              </p>
            </div>
            <button
              onClick={clearAlert}
              className="text-slate-400 hover:text-white transition shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenOferta={() => setOfertaModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main>
        {activeTab === 'landing' && (
          <>
            <HeroSection
              pool={pool}
              onOpenDeposit={handleOpenDeposit}
              onGoToProp={() => setActiveTab('prop')}
            />
            <NAVChartSection
              navHistory={navHistory}
              sessions={sessions}
            />
            <FeaturesSection />
            <PropTradingSection
              onOpenPropModal={handleOpenPropModal}
            />
            <LeaderboardSection />
          </>
        )}

        {activeTab === 'prop' && (
          <div className="pt-6">
            <PropTradingSection onOpenPropModal={handleOpenPropModal} />
            <FeaturesSection />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="pt-6">
            <LeaderboardSection />
          </div>
        )}

        {activeTab === 'cabinet' && isAuthenticated && (
          <InvestorCabinet
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
            onOpenProp={handleOpenPropModal}
          />
        )}

        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminPanel />
          ) : (
            <AdminLoginGate onBackToHome={() => setActiveTab('landing')} />
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenOferta={() => setOfertaModalOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Live Activity Ticker (identical in spirit to xorazm-forex) */}
      <LiveNotifications />

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onOpenOferta={() => {
          setAuthModal({ isOpen: false, mode: 'register' });
          setOfertaModalOpen(true);
        }}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={() => {
          loadData();
          alert("To‘lov chekingiz muvaffaqiyatli qabul qilindi! Admin ko‘rib chiqishi bilan balansingizga Units qo‘shiladi.");
        }}
      />

      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onSuccess={() => {
          loadData();
          alert("Pul yechish so‘rovingiz adminga yuborildi! Tez orada kartangizga o‘tkaziladi.");
        }}
      />

      <PropExamModal
        isOpen={propModalOpen}
        onClose={() => setPropModalOpen(false)}
        onSuccess={() => {
          loadData();
          alert("100 000 so‘mlik to‘lov chekingiz qabul qilindi! Admin tasdiqlashi bilan kabinetingizga MT5 Demo login va parol chiqadi.");
        }}
      />

      {/* Oferta Modal */}
      <OfertaModal
        isOpen={ofertaModalOpen}
        onClose={() => setOfertaModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <MainApp />
      </WebSocketProvider>
    </AuthProvider>
  );
}
