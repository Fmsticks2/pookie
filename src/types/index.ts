export type MarketStatus = 'active' | 'resolved'
export type MarketCategory = 'Crypto' | 'Sports' | 'Politics' | 'Tech'

export interface Market {
  id: string
  question: string
  description?: string
  category: MarketCategory
  endDate: string
  status: MarketStatus
  yesPool: number
  noPool: number
  totalPool: number
  participants: number
  imageUrl?: string
  resolvedOutcome?: boolean // true for YES, false for NO
}

export interface BetQuote {
  quoteId: string
  marketId: string
  betYes: boolean
  depositCoin: string
  depositAmount: number
  expectedUSDC: number
  rate: number
  expiresAt: number // timestamp
}

export interface Shift {
  shiftId: string
  depositAddress: string
  depositAmount: number
  depositCoin: string
  status: 'waiting' | 'pending' | 'settled' | 'expired'
  txHash?: string
}

export interface Position {
  id: string
  marketId: string
  marketQuestion: string
  betYes: boolean
  amount: number // in USDC equivalent
  potentialWinnings: number
  odds: number
  status: 'active' | 'won' | 'lost' | 'claimed'
  timestamp: string
}
