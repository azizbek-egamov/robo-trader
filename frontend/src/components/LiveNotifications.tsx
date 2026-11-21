import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { Award, TrendingUp, CheckCircle, Zap, ArrowDownCircle, Users } from 'lucide-react';

export const LiveNotifications: React.FC = () => {
  const { activityList } = useWebSocket();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!activityList || activityList.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activityList.length);
        setIsVisible(true);
      }, 400);
    }, 4500);

    return () => clearInterval(interval);
  }, [activityList.length]);

  if (!activityList || activityList.length === 0) return null;

  const current = activityList[currentIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case 'PROFIT':
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case 'DEPOSIT':
        return <ArrowDownCircle className="h-5 w-5 text-cyan-400" />;
      case 'WITHDRAW':
        return <CheckCircle className="h-5 w-5 text-amber-400" />;
      case 'PASSED':
        return <Award className="h-5 w-5 text-yellow-400" />;
      case 'REFERRAL':
        return <Users className="h-5 w-5 text-purple-400" />;
      default:
        return <Zap className="h-5 w-5 text-red-400" />;
    }
  };

  return (
    <div
      className={`fixed bottom-5 left-5 z-50 max-w-sm transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
      }`}
    >
      <div className="relative flex items-center gap-3.5 rounded-2xl border border-slate-700/60 bg-[#0f172a]/95 p-3.5 shadow-2xl backdrop-blur-xl">
        {/* Glow corner */}
        <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-red-600/50 blur-sm" />

        {/* Icon box */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/90 border border-slate-700">
          {getIcon(current.type)}
        </div>

        {/* Text */}
        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs text-white truncate">
              {current.name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              Jonli faollik
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-300 leading-snug mt-0.5">
            {current.action}
          </p>
        </div>
      </div>
    </div>
  );
};

