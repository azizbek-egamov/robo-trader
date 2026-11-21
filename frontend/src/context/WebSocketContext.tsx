import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface ActivityNotification {
  name: string;
  action: string;
  type: string;
  timestamp?: number;
}

interface WebSocketContextType {
  isConnected: boolean;
  activityList: ActivityNotification[];
  latestAlert: { title: string; message: string; type?: string } | null;
  clearAlert: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

// Standart boshlang'ich notifikatsiyalar (sayt kirilgandanoq oqim bo'lishi uchun, xuddi xorazm-forex kabi)
const INITIAL_ACTIVITIES: ActivityNotification[] = [
  { name: "Sultonbek", action: "10 000$ lik prop hisob sotib oldi", type: "PROP" },
  { name: "Sherbek", action: "5 000$ prop hisobdan 1 200$ yechdi", type: "WITHDRAW" },
  { name: "Sherzod", action: "25 000$ lik prop hisob imtihonidan o‘tdi", type: "PASSED" },
  { name: "Ruxshona", action: "XF CopyTrade ga $1 000 depozit kiritdi", type: "DEPOSIT" },
  { name: "Quvondiq", action: "Savdo sessiyasidan +$350 sof foyda oldi", type: "PROFIT" },
  { name: "Aziz", action: "Hamkorlik (5% referal) bo‘yicha $65 bonus oldi", type: "REFERRAL" },
  { name: "Mohira", action: "100 000 so‘mlik Prop Imtihon topshirdi", type: "PROP" },
  { name: "Bahrom", action: "CopyTrade portfelidan 5 000$ foyda yechdi", type: "WITHDRAW" },
  { name: "Elbek", action: "XF Master fondiga 2 500$ depozit qildi", type: "DEPOSIT" },
];

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, refreshProfile } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<ActivityNotification[]>(INITIAL_ACTIVITIES);
  const [latestAlert, setLatestAlert] = useState<{ title: string; message: string; type?: string } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://127.0.0.1:8000/ws/trading/${token ? `?token=${token}` : ''}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { event: evtName, payload } = data;

        if (evtName === 'new_activity_ticker' && payload) {
          setActivityList((prev) => [
            {
              name: payload.name || "Investor",
              action: payload.action || "operatsiyani bajardi",
              type: payload.type || "INFO",
              timestamp: Date.now(),
            },
            ...prev.slice(0, 40),
          ]);
        }

        if (
          evtName === 'profit_distributed' ||
          evtName === 'deposit_approved' ||
          evtName === 'withdrawal_paid' ||
          evtName === 'referral_bonus_credited' ||
          evtName === 'prop_exam_credentials'
        ) {
          refreshProfile();
          setLatestAlert({
            title: "Yangi Xabarnoma",
            message: payload.message || "Hisobingizda o‘zgarish yuz berdi!",
            type: "SUCCESS",
          });
        }

        if (evtName === 'trade_session_completed') {
          setLatestAlert({
            title: "Yangi Savdo Sessiyasi!",
            message: `Foyda: +$${payload.gross_profit_usd} (Investorlar ulushi: +$${payload.investors_share_usd}). Yangi NAV: $${payload.new_nav}`,
            type: "PROFIT",
          });
        }

        if (evtName === 'new_deposit_request' || evtName === 'new_withdrawal_request' || evtName === 'new_prop_exam_application') {
          setLatestAlert({
            title: "Admin Diqqatiga",
            message: payload.message,
            type: "ADMIN",
          });
        }
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    // Ping interval
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, [token]);

  const clearAlert = () => setLatestAlert(null);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        activityList,
        latestAlert,
        clearAlert,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

