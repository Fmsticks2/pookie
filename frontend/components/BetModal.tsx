import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal, Button, Input } from './UI';
import { useQuote } from '../hooks/useHooks';
import { formatCurrency, formatTimeRemaining, formatAddress } from '../utils';
import { Shift, Market } from '../types';
import { api } from '../services/api';
import { CheckCircle2, Clock, Copy, AlertCircle, ArrowRight } from 'lucide-react';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
  betYes: boolean;
}

type Step = 'input' | 'quote' | 'deposit';

const COINS = [
  { symbol: 'USDC', icon: '💲' },
  { symbol: 'USDT', icon: '💵' },
  { symbol: 'ETH', icon: 'Ξ' },
  { symbol: 'BTC', icon: '₿' },
  { symbol: 'SOL', icon: '◎' },
];

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, market, betYes }) => {
  const [step, setStep] = useState<Step>('input');
  const [amount, setAmount] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [depositData, setDepositData] = useState<Shift | null>(null);
  const [shiftStatus, setShiftStatus] = useState<Shift['status']>('waiting');
  
  const { quote, loading: quoteLoading, getQuote } = useQuote();

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('input');
        setAmount('');
        setDepositData(null);
        setShiftStatus('waiting');
      }, 300);
    }
  }, [isOpen]);

  // Polling for status
  useEffect(() => {
    let interval: any;
    if (step === 'deposit' && depositData?.shiftId) {
      interval = setInterval(async () => {
        const status = await api.getShiftStatus(depositData.shiftId);
        setShiftStatus(status);
        if (status === 'confirmed') {
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, depositData]);

  const handleGetQuote = async () => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      await getQuote(market.id, betYes, Number(amount));
      setStep('quote');
    } catch (e) {
      // Error handled in hook
    }
  };

  const handleConfirmBet = async () => {
    if (!quote) return;
    try {
      const shift = await api.confirmBet(quote.quoteId, market.id, betYes);
      setDepositData(shift);
      setStep('deposit');
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderInputStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
        <span className="text-sm text-zinc-400">You are betting</span>
        <span className={`text-lg font-bold ${betYes ? 'text-emerald-400' : 'text-red-400'}`}>
          {betYes ? 'YES' : 'NO'}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400">Select Token</label>
        <div className="grid grid-cols-5 gap-2">
          {COINS.map(coin => (
            <button
              key={coin.symbol}
              onClick={() => setSelectedCoin(coin)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${selectedCoin.symbol === coin.symbol ? 'bg-primary/20 border-primary text-white' : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'}`}
            >
              <span className="text-xl mb-1">{coin.icon}</span>
              <span className="text-[10px] font-bold">{coin.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400">Amount</label>
        <div className="relative">
          <Input 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="pl-8 text-lg"
          />
          <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
        </div>
        <p className="text-xs text-zinc-500 text-right">Min: $10.00</p>
      </div>

      <Button 
        className="w-full" 
        onClick={handleGetQuote} 
        disabled={!amount || Number(amount) < 10}
        isLoading={quoteLoading}
      >
        Preview Quote
      </Button>
    </div>
  );

  const renderQuoteStep = () => (
    <div className="space-y-6">
       <div className="text-center space-y-1">
        <p className="text-sm text-zinc-400">Potential Return</p>
        <p className="text-3xl font-bold text-emerald-400">
            {formatCurrency(quote?.expectedUSDC || 0)}
        </p>
        <p className="text-xs text-zinc-500">
            ROI: {quote ? (((quote.expectedUSDC - Number(amount)) / Number(amount)) * 100).toFixed(2) : 0}%
        </p>
       </div>

       <div className="bg-white/5 rounded-lg p-4 space-y-3 text-sm">
         <div className="flex justify-between">
           <span className="text-zinc-400">Entry Price</span>
           <span className="text-white">{(1 / (quote?.rate || 1)).toFixed(2)}c</span>
         </div>
         <div className="flex justify-between">
           <span className="text-zinc-400">Fees</span>
           <span className="text-white">$0.00 (Promo)</span>
         </div>
         <div className="flex justify-between">
           <span className="text-zinc-400">Quote Expires</span>
           <span className="text-orange-400 flex items-center gap-1">
             <Clock className="w-3 h-3" /> 2:00
           </span>
         </div>
       </div>

       <div className="flex gap-3">
         <Button variant="outline" className="flex-1" onClick={() => setStep('input')}>Back</Button>
         <Button className="flex-1" onClick={handleConfirmBet}>Confirm Bet</Button>
       </div>
    </div>
  );

  const renderDepositStep = () => (
    <div className="space-y-6 text-center">
       {shiftStatus === 'confirmed' ? (
         <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bet Confirmed!</h3>
            <p className="text-zinc-400 text-sm mb-6">Your position has been secured.</p>
            <Button onClick={onClose} className="w-full">Done</Button>
         </div>
       ) : (
         <>
           <div className="bg-white p-3 rounded-xl w-fit mx-auto">
             <QRCodeSVG value={depositData?.depositAddress || ''} size={160} />
           </div>
           
           <div className="space-y-2">
             <p className="text-sm text-zinc-400">Send exactly <span className="text-white font-bold">{amount} {selectedCoin.symbol}</span> to:</p>
             <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10 group">
                <code className="text-xs text-zinc-300 flex-1 break-all font-mono">{depositData?.depositAddress}</code>
                <button 
                  onClick={() => copyToClipboard(depositData?.depositAddress || '')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors text-zinc-500 hover:text-white"
                >
                    <Copy className="w-4 h-4" />
                </button>
             </div>
           </div>

           <div className="space-y-4 pt-2">
             <div className="flex items-center justify-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${shiftStatus === 'waiting' ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-zinc-300 capitalize">{shiftStatus}...</span>
             </div>
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-primary transition-all duration-500 ${shiftStatus === 'waiting' ? 'w-1/3' : shiftStatus === 'received' ? 'w-2/3' : 'w-full'}`} 
                />
             </div>
           </div>
         </>
       )}
    </div>
  );

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={step === 'deposit' ? 'Complete Deposit' : `Bet ${betYes ? 'YES' : 'NO'} on ${formatAddress(market.id)}`}
    >
        {step === 'input' && renderInputStep()}
        {step === 'quote' && renderQuoteStep()}
        {step === 'deposit' && renderDepositStep()}
    </Modal>
  );
};