export enum MarketStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  CANCELED = 'canceled'
}

export enum MarketCategory {
  CRYPTO = 'Crypto',
  SPORTS = 'Sports',
  POLITICS = 'Politics',
  TECH = 'Tech'
}

export interface Market {
  id: string;
  question: string;
  description: string;
  category: MarketCategory;
  endDate: string; // ISO string
  status: MarketStatus;
  poolTotal: number;
  poolYes: number;
  poolNo: number;
  participants: number;
  image?: string;
  resolvedWinner?: 'YES' | 'NO' | null;
}

export interface BetQuote {
  quoteId: string;
  expectedUSDC: number;
  rate: number;
  expiresAt: number; // timestamp
}

export interface Shift {
  shiftId: string;
  depositAddress: string;
  depositAmount: number;
  depositCoin: string;
  status: 'waiting' | 'received' | 'confirmed' | 'failed';
  marketId: string;
  betYes: boolean;
}

export interface Position {
  id: string;
  marketId: string;
  marketQuestion: string;
  betYes: boolean;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  status: 'active' | 'won' | 'lost';
  pnl?: number;
}

export interface CreateMarketPayload {
  question: string;
  category: MarketCategory;
  endDate: string;
  minBet: number;
}