import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from './UI';
import { Market, MarketStatus } from '../types';
import { calculateOdds, formatCurrency, formatTimeRemaining } from '../utils';
import { Timer } from 'lucide-react';

export const MarketCard: React.FC<{ market: Market }> = ({ market }) => {
  const odds = calculateOdds(market.poolYes, market.poolNo);
  const timeLeft = formatTimeRemaining(market.endDate);
  
  return (
    <Link to={`/market/${market.id}`} className="block group h-full">
        <Card className="h-full hover:border-zinc-600 transition-colors duration-200 flex flex-col">
            {/* Image Section */}
            <div className="h-32 w-full relative overflow-hidden bg-zinc-800 border-b border-border">
                <img 
                    src={market.image} 
                    alt={market.question} 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
                />
                <div className="absolute top-3 right-3">
                    <Badge variant={market.status === MarketStatus.ACTIVE ? 'success' : 'default'}>
                        {market.status === MarketStatus.ACTIVE ? 'Live' : 'Ended'}
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{market.category}</span>
                </div>
                
                <h3 className="font-semibold text-base text-white leading-snug line-clamp-2 mb-6 group-hover:text-primary transition-colors">
                    {market.question}
                </h3>

                <div className="mt-auto space-y-4">
                    {/* Odds Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-emerald-500">{odds.yes}% YES</span>
                            <span className="text-red-500">{odds.no}% NO</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                            <div style={{ width: `${odds.yes}%` }} className="h-full bg-emerald-500" />
                            <div style={{ width: `${odds.no}%` }} className="h-full bg-red-500" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-zinc-500">
                        <span className="font-mono text-zinc-400">
                            {formatCurrency(market.poolTotal)} Vol
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5" />
                            {timeLeft}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    </Link>
  );
};