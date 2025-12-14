import React, { useState } from 'react';
import { usePositions, useWallet } from '../hooks/useHooks';
import { Card, Button, Badge, Skeleton } from '../components/UI';
import { formatCurrency, formatAddress } from '../utils';
import { Wallet, TrendingUp, History, AlertTriangle } from 'lucide-react';
import { Position } from '../types';
import { api } from '../services/api';

export const Portfolio = () => {
  const { address, connect, isConnected } = useWallet();
  const { positions, loading } = usePositions(address || undefined);

  if (!isConnected) {
      return (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 border border-primary/20">
                  <Wallet className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Connect your wallet</h2>
              <p className="text-zinc-400 max-w-md">Connect your wallet to view your active positions, claim winnings, and track your performance.</p>
              <Button size="lg" onClick={connect}>Connect Wallet</Button>
          </div>
      );
  }

  const activePositions = positions.filter(p => p.status === 'active');
  const resolvedPositions = positions.filter(p => p.status !== 'active');

  const totalValue = positions.reduce((acc, p) => acc + (p.status === 'active' ? p.amount * (p.currentPrice / p.entryPrice) : 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-end justify-between border-b border-border pb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
                <p className="text-zinc-400 font-mono text-sm">{formatAddress(address || '')}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Total Value Locked</p>
                <p className="text-3xl font-bold text-white font-mono">{formatCurrency(totalValue)}</p>
            </div>
        </div>

        {/* Active Positions */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Active Positions
            </h2>
            
            {loading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
            ) : activePositions.length === 0 ? (
                <Card className="p-8 text-center text-zinc-500 border-dashed">No active positions</Card>
            ) : (
                <div className="grid gap-4">
                    {activePositions.map(pos => (
                        <PositionCard key={pos.id} position={pos} />
                    ))}
                </div>
            )}
        </div>

        {/* History */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-zinc-400" /> Resolved
            </h2>
             {loading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
            ) : resolvedPositions.length === 0 ? (
                <Card className="p-8 text-center text-zinc-500 border-dashed">No history yet</Card>
            ) : (
                <div className="grid gap-4">
                    {resolvedPositions.map(pos => (
                        <PositionCard key={pos.id} position={pos} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

const PositionCard: React.FC<{ position: Position }> = ({ position }) => {
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    
    const isWin = position.status === 'won';
    const currentValue = position.amount * (position.currentPrice / position.entryPrice);
    const roi = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100;

    const handleClaim = async () => {
        setClaiming(true);
        try {
            await api.claimWinnings(position.id);
            setClaimed(true);
        } catch (e) {
            console.error(e);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:border-zinc-600">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant={position.betYes ? 'success' : 'danger'}>
                        {position.betYes ? 'YES' : 'NO'}
                    </Badge>
                    <span className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-md">
                        {position.marketQuestion}
                    </span>
                </div>
                <div className="flex gap-4 text-xs text-zinc-400">
                    <span>Entry: <span className="text-zinc-300 font-mono">{(position.entryPrice * 100).toFixed(1)}¢</span></span>
                    <span>Current: <span className="text-zinc-300 font-mono">{(position.currentPrice * 100).toFixed(1)}¢</span></span>
                </div>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
                 <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">
                        {position.status === 'active' ? formatCurrency(currentValue) : formatCurrency(position.amount + (position.pnl || 0))}
                    </div>
                    <div className={`text-xs font-medium ${roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
                    </div>
                 </div>
                 
                 {position.status === 'won' && !claimed && (
                     <Button size="sm" variant="success" onClick={handleClaim} isLoading={claiming}>Claim</Button>
                 )}
                 {position.status === 'won' && claimed && (
                     <Badge variant="success">Claimed</Badge>
                 )}
                 {position.status === 'lost' && (
                     <Badge variant="outline">Settled</Badge>
                 )}
            </div>
        </Card>
    );
};