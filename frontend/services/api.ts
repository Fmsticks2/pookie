import { Market, MarketCategory, MarketStatus, BetQuote, Shift, Position, CreateMarketPayload } from '../types';
import { wait } from '../utils';

// MOCK DATA
const MOCK_MARKETS: Market[] = [
  {
    id: 'm-1',
    question: 'Will Bitcoin break $100k by end of 2024?',
    description: 'This market resolves to YES if Bitcoin trades above $100,000.00 USD on Coinbase before Dec 31, 2024 23:59 UTC.',
    category: MarketCategory.CRYPTO,
    endDate: '2024-12-31T23:59:00Z',
    status: MarketStatus.ACTIVE,
    poolTotal: 1542050,
    poolYes: 850000,
    poolNo: 692050,
    participants: 1205,
    image: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 'm-2',
    question: 'Will SpaceX successfully land Starship on Mars in 2025?',
    description: 'Resolves YES if official confirmation of a successful soft landing on Mars surface by Starship vehicle.',
    category: MarketCategory.TECH,
    endDate: '2025-12-31T23:59:00Z',
    status: MarketStatus.ACTIVE,
    poolTotal: 540000,
    poolYes: 120000,
    poolNo: 420000,
    participants: 450,
    image: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 'm-3',
    question: 'Who will win the 2024 US Presidential Election?',
    description: 'Resolves to the candidate inaugurated on Jan 20, 2025.',
    category: MarketCategory.POLITICS,
    endDate: '2024-11-05T23:59:00Z',
    status: MarketStatus.ACTIVE,
    poolTotal: 5200000,
    poolYes: 2600000,
    poolNo: 2600000,
    participants: 15000,
    image: 'https://picsum.photos/400/200?random=3'
  },
  {
    id: 'm-4',
    question: 'Will Ethereum flip Bitcoin in market cap by 2025?',
    description: 'Resolves YES if ETH market cap > BTC market cap for 24h continuous period.',
    category: MarketCategory.CRYPTO,
    endDate: '2025-01-01T00:00:00Z',
    status: MarketStatus.RESOLVED,
    resolvedWinner: 'NO',
    poolTotal: 890000,
    poolYes: 100000,
    poolNo: 790000,
    participants: 890,
    image: 'https://picsum.photos/400/200?random=4'
  }
];

const MOCK_POSITIONS: Position[] = [
  {
    id: 'pos-1',
    marketId: 'm-1',
    marketQuestion: 'Will Bitcoin break $100k by end of 2024?',
    betYes: true,
    amount: 500,
    entryPrice: 0.55,
    currentPrice: 0.58,
    status: 'active',
    pnl: 27.27
  },
  {
    id: 'pos-2',
    marketId: 'm-4',
    marketQuestion: 'Will Ethereum flip Bitcoin in market cap by 2025?',
    betYes: false,
    amount: 200,
    entryPrice: 0.80,
    currentPrice: 1.00,
    status: 'won',
    pnl: 50.00
  }
];

export const api = {
  getMarkets: async (category?: string, search?: string): Promise<Market[]> => {
    await wait(800);
    let markets = [...MOCK_MARKETS];
    if (category && category !== 'All') {
      markets = markets.filter(m => m.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      markets = markets.filter(m => m.question.toLowerCase().includes(q));
    }
    return markets;
  },

  getMarketById: async (id: string): Promise<Market | null> => {
    await wait(500);
    return MOCK_MARKETS.find(m => m.id === id) || null;
  },

  getQuote: async (marketId: string, betYes: boolean, depositAmount: number): Promise<BetQuote> => {
    await wait(600);
    // Simulate quote calculation
    const market = MOCK_MARKETS.find(m => m.id === marketId);
    if (!market) throw new Error("Market not found");

    const odds = betYes 
      ? market.poolYes / market.poolTotal 
      : market.poolNo / market.poolTotal;
    
    // Simulate slight slippage and fee
    const effectiveRate = 1 + (0.98 / (odds || 0.5)) - 1; // Simplified odds logic
    const expected = depositAmount * effectiveRate;

    return {
      quoteId: `q-${Date.now()}`,
      expectedUSDC: expected,
      rate: effectiveRate,
      expiresAt: Date.now() + 120000 // 2 minutes
    };
  },

  confirmBet: async (quoteId: string, marketId: string, betYes: boolean): Promise<Shift> => {
    await wait(1000);
    return {
      shiftId: `shift-${Date.now()}`,
      depositAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      depositAmount: 100, // Should match quote, simplified here
      depositCoin: 'USDC',
      status: 'waiting',
      marketId,
      betYes
    };
  },

  getShiftStatus: async (shiftId: string): Promise<Shift['status']> => {
    // Randomly progress status for demo purposes
    await wait(300);
    const rand = Math.random();
    if (rand > 0.7) return 'confirmed';
    if (rand > 0.4) return 'received';
    return 'waiting';
  },

  getUserPositions: async (address: string): Promise<Position[]> => {
    await wait(800);
    return MOCK_POSITIONS;
  },

  createMarket: async (payload: CreateMarketPayload): Promise<boolean> => {
    await wait(1500);
    console.log("Creating market:", payload);
    return true;
  },

  claimWinnings: async (positionId: string): Promise<boolean> => {
    await wait(1200);
    console.log("Claiming winnings for:", positionId);
    return true;
  }
};