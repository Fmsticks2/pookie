import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMarketDetail } from '../hooks/useHooks';
import { calculateOdds, formatCurrency, formatTimeRemaining } from '../utils';
import { Button, Card, Skeleton, Badge } from '../components/UI';
import { BetModal } from '../components/BetModal';
import { ArrowUpRight, Clock, Users, DollarSign, Info } from 'lucide-react';

export const MarketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { market, loading } = useMarketDetail(id || '');
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betSide, setBetSide] = useState<boolean>(true);
  const [shared, setShared] = useState(false);

  if (loading) return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse pt-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="md:col-span-2 h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
  );

  if (!market) return <div className="text-center py-32 text-white">Market not found</div>;

  const odds = calculateOdds(market.poolYes, market.poolNo);
  const chartData = [
    { name: 'YES', value: market.poolYes, color: '#10b981' }, // Emerald 500
    { name: 'NO', value: market.poolNo, color: '#ef4444' }, // Red 500
  ];

  const handleBet = (yes: boolean) => {
    setBetSide(yes);
    setBetModalOpen(true);
  };

  const handleShare = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    } catch (err) {
        console.error("Failed to copy", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
         <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
                 <Badge>{market.category}</Badge>
                 <span className="text-zinc-500 text-sm flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Ends in {formatTimeRemaining(market.endDate)}
                 </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {market.question}
            </h1>
         </div>
         <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
                <ArrowUpRight className="w-4 h-4 mr-2" /> {shared ? 'Copied!' : 'Share'}
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Chart & Stats */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="space-y-8 flex-1 w-full">
                        <div>
                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Odds</div>
                            <div className="flex items-end gap-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-emerald-500">{odds.yes}%</div>
                                    <div className="text-xs text-zinc-500 font-bold tracking-wider mt-1">YES</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-red-500">{odds.no}%</div>
                                    <div className="text-xs text-zinc-500 font-bold tracking-wider mt-1">NO</div>
                                </div>
                            </div>
                        </div>

                        {/* Bet Buttons */}
                        <div className="flex gap-4">
                            <Button 
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-12 text-lg font-semibold"
                                onClick={() => handleBet(true)}
                            >
                                Bet YES
                            </Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 h-12 text-lg font-semibold"
                                onClick={() => handleBet(false)}
                            >
                                Bet NO
                            </Button>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="w-56 h-56 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(val: number) => formatCurrency(val)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-mono text-zinc-500 font-bold">POOL</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" /> Rules
                </h3>
                <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-4">
                    {market.description}
                </div>
            </Card>
        </div>

        {/* Sidebar: Stats */}
        <div className="space-y-6">
            <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-white border-b border-border pb-3">Market Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm flex items-center gap-2"><DollarSign className="w-4 h-4"/> Volume</span>
                        <span className="text-white font-mono">{formatCurrency(market.poolTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm flex items-center gap-2"><Users className="w-4 h-4"/> Traders</span>
                        <span className="text-white font-mono">{market.participants}</span>
                    </div>
                    <div className="w-full h-px bg-border my-2" />
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Liquidity (YES)</span>
                        <span className="text-emerald-500 font-mono">{formatCurrency(market.poolYes)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Liquidity (NO)</span>
                        <span className="text-red-500 font-mono">{formatCurrency(market.poolNo)}</span>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="flex justify-between items-center text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                <span className="text-zinc-300 font-mono text-xs">0x...{1000 + i}</span>
                             </div>
                             <span className="text-white font-mono">${(Math.random() * 500).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>

      <BetModal 
        isOpen={betModalOpen} 
        onClose={() => setBetModalOpen(false)} 
        market={market} 
        betYes={betSide} 
      />
    </div>
  );
};