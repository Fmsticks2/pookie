import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/api/mock'
import { type Market, type BetQuote, type Shift } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface BetModalProps {
  market: Market
  defaultSide?: 'YES' | 'NO'
  // prediction prop alias for defaultSide to match usage
  prediction?: 'yes' | 'no' 
}

type Step = 'input' | 'quote' | 'deposit'

const COINS = [
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'SOL', name: 'Solana' },
]

export function BetModal({ market, defaultSide = 'YES', prediction }: BetModalProps) {
  const [open, setOpen] = useState(false)
  const initialSide = prediction ? prediction.toUpperCase() as 'YES' | 'NO' : defaultSide
  
  const [step, setStep] = useState<Step>('input')
  const [side, setSide] = useState<'YES' | 'NO'>(initialSide)
  const [amount, setAmount] = useState('')
  const [coin, setCoin] = useState('USDC')
  const [quote, setQuote] = useState<BetQuote | null>(null)
  const [shift, setShift] = useState<Shift | null>(null)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setStep('input')
      setSide(initialSide)
      setQuote(null)
      setShift(null)
      setAmount('')
    }
  }

  // Get Quote Mutation
  const quoteMutation = useMutation({
    mutationFn: async () => {
      const numAmount = parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) throw new Error("Invalid amount")
      return api.getQuote(market.id, side === 'YES', coin, numAmount)
    },
    onSuccess: (data) => {
      setQuote(data)
      setStep('quote')
    },
    onError: () => {
      toast.error('Failed to get quote')
    }
  })

  // Confirm Bet Mutation
  const confirmMutation = useMutation({
    mutationFn: async () => {
      if (!quote) throw new Error("No quote")
      return api.confirmBet(quote.quoteId)
    },
    onSuccess: (data) => {
      setShift(data)
      setStep('deposit')
    },
    onError: () => {
      toast.error('Failed to confirm bet')
    }
  })

  // Poll Shift Status
  useQuery({
    queryKey: ['shift', shift?.shiftId],
    queryFn: async () => {
      if (!shift) return null
      const status = await api.getShiftStatus(shift.shiftId)
      if (status === 'settled') {
        toast.success('Deposit confirmed! Position created.')
        handleOpenChange(false)
      }
      return status
    },
    enabled: !!shift && step === 'deposit',
    refetchInterval: 5000,
  })

  const copyAddress = () => {
    if (shift?.depositAddress) {
      navigator.clipboard.writeText(shift.depositAddress)
      toast.success('Address copied to clipboard')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={initialSide === 'YES' ? 'default' : 'destructive'}>
          Bet {initialSide}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place Bet on {side}</DialogTitle>
          <DialogDescription className="line-clamp-1">
            {market.question}
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-4 py-4">
            <Tabs value={side} onValueChange={(v) => setSide(v as 'YES' | 'NO')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="YES" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  YES
                </TabsTrigger>
                <TabsTrigger value="NO" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  NO
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-2">
              <Label>Deposit Asset</Label>
              <Select value={coin} onValueChange={setCoin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COINS.map(c => (
                    <SelectItem key={c.symbol} value={c.symbol}>
                      {c.name} ({c.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-12"
                />
                <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                  {coin}
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => quoteMutation.mutate()} 
              disabled={quoteMutation.isPending || !amount}
            >
              {quoteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Quote
            </Button>
          </div>
        )}

        {step === 'quote' && quote && (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You Pay</span>
                <span className="font-medium">{quote.depositAmount} {quote.depositCoin}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Value</span>
                <span className="font-medium">~{formatCurrency(quote.expectedUSDC)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium">1 {quote.depositCoin} ≈ {formatCurrency(quote.rate)}</span>
              </div>
              <div className="border-t border-white/10 my-2" />
              <div className="flex justify-between text-sm font-bold text-primary">
                <span>Potential Payout</span>
                <span>TODO: Calc</span> 
              </div>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Quote expires in <span className="text-orange-500">2:00</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setStep('input')}>Back</Button>
              <Button 
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Bet
              </Button>
            </div>
          </div>
        )}

        {step === 'deposit' && shift && (
          <div className="space-y-6 py-4 flex flex-col items-center text-center">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={shift.depositAddress} size={180} />
            </div>
            
            <div className="w-full space-y-2">
              <Label className="text-left block">Send exactly</Label>
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <span className="font-mono font-bold text-lg">{shift.depositAmount} {shift.depositCoin}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label className="text-left block">To Address</Label>
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <span className="font-mono text-xs break-all text-left">{shift.depositAddress}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-yellow-500 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for deposit...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
