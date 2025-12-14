import { type Market, type BetQuote, type Shift, type Position } from '@/types'

// Mock Data
const MOCK_MARKETS: Market[] = [
  {
    id: '1',
    question: 'Will Bitcoin hit $100k by 2025?',
    category: 'Crypto',
    endDate: '2024-12-31T23:59:59Z',
    status: 'active',
    yesPool: 150000,
    noPool: 85000,
    totalPool: 235000,
    participants: 1240,
  },
  {
    id: '2',
    question: 'Will Ethereum flip Bitcoin market cap in 2024?',
    category: 'Crypto',
    endDate: '2024-12-31T23:59:59Z',
    status: 'active',
    yesPool: 20000,
    noPool: 180000,
    totalPool: 200000,
    participants: 850,
  },
  {
    id: '3',
    question: 'Will the US Fed cut rates in March 2024?',
    category: 'Politics',
    endDate: '2024-03-31T23:59:59Z',
    status: 'resolved',
    resolvedOutcome: false,
    yesPool: 50000,
    noPool: 50000,
    totalPool: 100000,
    participants: 500,
  },
  {
    id: '4',
    question: 'Will GPT-5 be released before Q3 2025?',
    category: 'Tech',
    endDate: '2025-06-30T23:59:59Z',
    status: 'active',
    yesPool: 75000,
    noPool: 25000,
    totalPool: 100000,
    participants: 300,
  },
  {
    id: '5',
    question: 'Will Manchester City win the Champions League 2024?',
    category: 'Sports',
    endDate: '2024-06-01T23:59:59Z',
    status: 'active',
    yesPool: 40000,
    noPool: 30000,
    totalPool: 70000,
    participants: 450,
  },
]

const MOCK_POSITIONS: Position[] = [
  {
    id: 'p1',
    marketId: '1',
    marketQuestion: 'Will Bitcoin hit $100k by 2025?',
    betYes: true,
    amount: 500,
    potentialWinnings: 783.33,
    odds: 63.8,
    status: 'active',
    timestamp: '2023-11-15T10:00:00Z',
  },
  {
    id: 'p2',
    marketId: '3',
    marketQuestion: 'Will the US Fed cut rates in March 2024?',
    betYes: true,
    amount: 100,
    potentialWinnings: 200,
    odds: 50,
    status: 'lost',
    timestamp: '2024-01-10T14:30:00Z',
  },
]

// API Functions
export const api = {
  getMarkets: async (status?: string, category?: string): Promise<Market[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
    let markets = [...MOCK_MARKETS]
    if (status) {
      markets = markets.filter(m => m.status === status)
    }
    if (category && category !== 'All') {
      markets = markets.filter(m => m.category === category)
    }
    return markets
  },

  getMarket: async (id: string): Promise<Market | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return MOCK_MARKETS.find(m => m.id === id)
  },

  getQuote: async (marketId: string, betYes: boolean, depositCoin: string, depositAmount: number): Promise<BetQuote> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    // Mock quote logic
    const rate = depositCoin === 'BTC' ? 45000 : depositCoin === 'ETH' ? 2500 : 1 // Simplified rates
    const expectedUSDC = depositAmount * rate
    
    return {
      quoteId: Math.random().toString(36).substring(7),
      marketId,
      betYes,
      depositCoin,
      depositAmount,
      expectedUSDC,
      rate,
      expiresAt: Date.now() + 120000, // 2 minutes
    }
  },

  confirmBet: async (_quoteId: string): Promise<Shift> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      shiftId: `shift_${Math.random().toString(36).substring(7)}`,
      depositAddress: '0x1234567890abcdef1234567890abcdef12345678',
      depositAmount: 0.1, // This would match the quote
      depositCoin: 'ETH',
      status: 'waiting',
    }
  },

  getShiftStatus: async (_shiftId: string): Promise<Shift['status']> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Randomly progress status for demo purposes
    const random = Math.random()
    if (random < 0.33) return 'waiting'
    if (random < 0.66) return 'pending'
    return 'settled'
  },

  getUserPositions: async (_address: string): Promise<Position[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return MOCK_POSITIONS
  },

  createMarket: async (data: Omit<Market, 'id' | 'status' | 'yesPool' | 'noPool' | 'totalPool' | 'participants'>): Promise<Market> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newMarket: Market = {
      id: Math.random().toString(36).substring(7),
      ...data,
      status: 'active',
      yesPool: 0,
      noPool: 0,
      totalPool: 0,
      participants: 0,
    }
    MOCK_MARKETS.unshift(newMarket)
    return newMarket
  }
}
