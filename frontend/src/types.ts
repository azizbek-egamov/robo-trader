export interface User {
  id: number;
  phone: string;
  full_name: string;
  role: 'ADMIN' | 'INVESTOR' | 'TRADER';
  referral_code: string;
  referred_by_name?: string | null;
  xp_points: number;
  telegram_id?: string;
  created_at: string;
  units: string;
  current_value_usd: string;
  total_deposited_usd: string;
  total_withdrawn_usd: string;
  total_profit_earned_usd: string;
  referral_earnings_usd: string;
}

export interface InvestmentPool {
  id: number;
  name: string;
  current_nav: string;
  total_units: string;
  total_equity_usd: string;
  high_water_mark: string;
  total_investors_count: number;
  updated_at: string;
}

export interface NAVHistoryPoint {
  id: number;
  nav: string;
  total_units: string;
  total_equity_usd: string;
  event_type: string;
  note: string;
  recorded_at: string;
}

export interface SessionDistribution {
  id: number;
  session: number;
  investor_name: string;
  units_at_session: string;
  gross_share_usd: string;
  referral_deducted_usd: string;
  net_share_usd: string;
  referrer_name?: string | null;
  created_at: string;
}

export interface TradeSession {
  id: number;
  session_id: string;
  trader_type: 'XF' | 'EXTERNAL';
  trader_name?: string | null;
  gross_profit_usd: string;
  xf_share_usd: string;
  trader_share_usd: string;
  investors_share_usd: string;
  nav_before: string;
  nav_after: string;
  total_units_snapshot: string;
  notes: string;
  created_at: string;
  distributions?: SessionDistribution[];
}

export interface P2PCardSetting {
  id: number;
  card_number: string;
  card_holder: string;
  bank_name: string;
  exchange_rate_usd_uzs: string;
  is_active: boolean;
  updated_at: string;
}

export interface DepositRequest {
  id: number;
  deposit_id: string;
  user_name: string;
  user_phone: string;
  amount_uzs: string;
  amount_usd: string;
  units_credited: string;
  card_used: string;
  receipt_image?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_notes: string;
  created_at: string;
  resolved_at?: string | null;
}

export interface WithdrawalRequest {
  id: number;
  withdrawal_id: string;
  user_name: string;
  user_phone: string;
  amount_usd: string;
  amount_uzs: string;
  units_to_redeem: string;
  target_card_number: string;
  target_card_holder: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  admin_notes: string;
  created_at: string;
  resolved_at?: string | null;
}

export interface TransactionLedgerItem {
  id: number;
  tx_type: string;
  amount_usd: string;
  amount_uzs: string;
  units_delta: string;
  balance_after_usd: string;
  description: string;
  created_at: string;
}

export interface PropExam {
  id: number;
  exam_id: string;
  user_name: string;
  user_phone: string;
  fee_uzs: string;
  card_info_used: string;
  receipt_image?: string | null;
  status: 'PENDING_PAYMENT_APPROVAL' | 'ACTIVE' | 'PASSED' | 'FAILED' | 'REJECTED';
  mt5_login?: string;
  mt5_password?: string;
  mt5_server: string;
  demo_balance_usd: string;
  target_profit_percent: string;
  max_loss_percent: string;
  daily_loss_percent: string;
  admin_notes: string;
  created_at: string;
  activated_at?: string | null;
  completed_at?: string | null;
}

export interface LeaderboardUser {
  id: number;
  full_name: string;
  xp_points: number;
  role: string;
  current_value_usd: string;
  units: string;
}

