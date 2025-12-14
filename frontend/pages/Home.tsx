import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useHooks';
import { MarketCard } from '../components/MarketCard';
import { Button, Skeleton } from '../components/UI';
import { MarketCategory } from '../types';
import { Filter, Search, ArrowRight } from 'lucide-react';

export const Home = () => {
  const [category, setCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { markets, loading, error } = useMarkets(category, searchTerm);

  const categories = ['All', ...Object.values(MarketCategory)];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-xl border border-border bg-surface p-8 md:p-12 relative overflow-hidden">
         <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Predict the Future.<br />
                Profit from Truth.
            </h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl">
                Trade on news, crypto, sports, and culture with deep liquidity and instant settlement. The professional's choice for prediction markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/create">
                    <Button size="lg" className="w-full sm:w-auto px-8">Create Market</Button>
                </Link>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Documentation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
         </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-24 z-30 py-4 bg-background/95 backdrop-blur-sm border-b border-transparent">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
                <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                        category === cat 
                        ? 'bg-zinc-100 text-black border-zinc-100' 
                        : 'bg-surfaceHighlight text-zinc-400 border-border hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
        
        <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
             <input 
                type="text" 
                placeholder="Find markets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 rounded-lg bg-surfaceHighlight border border-border pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none transition-colors"
             />
        </div>
      </div>

      {/* Markets Grid */}
      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[300px] rounded-xl border border-border bg-surface p-4 space-y-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="pt-8"><Skeleton className="h-2 w-full" /></div>
                </div>
            ))}
         </div>
      ) : error ? (
         <div className="text-center py-20 text-red-400 border border-red-900/50 bg-red-900/10 rounded-xl">{error}</div>
      ) : markets.length === 0 ? (
         <div className="text-center py-24 border border-dashed border-zinc-800 rounded-xl">
             <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-4">
                 <Filter className="text-zinc-500" />
             </div>
             <h3 className="text-lg font-medium text-white">No markets found</h3>
             <p className="text-zinc-500">Try adjusting your filters.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map(market => (
                <MarketCard key={market.id} market={market} />
            ))}
        </div>
      )}
    </div>
  );
};