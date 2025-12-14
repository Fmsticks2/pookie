import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, Clock } from 'lucide-react'
import { type Market } from '@/types'
import { formatCurrency, calculateOdds, formatTimeRemaining } from '@/lib/utils'

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  const odds = calculateOdds(market.yesPool, market.noPool)
  
  return (
    <Link to={`/market/${market.id}`}>
      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer glass overflow-hidden flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {market.category}
            </Badge>
            {market.status === 'resolved' && (
              <Badge variant="outline" className="border-green-500/50 text-green-500">
                Resolved
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg leading-snug line-clamp-2">
            {market.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 pb-3">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-500 font-bold">YES {odds.yes}%</span>
              <span className="text-red-500 font-bold">NO {odds.no}%</span>
            </div>
            <Progress value={odds.yes} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mt-4">
              <div>
                <span className="block mb-1">Total Pool</span>
                <span className="text-foreground font-mono">{formatCurrency(market.totalPool)}</span>
              </div>
              <div className="text-right">
                <span className="block mb-1">Participants</span>
                <span className="text-foreground font-mono flex items-center justify-end gap-1">
                  <Users className="h-3 w-3" />
                  {market.participants}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 text-xs text-muted-foreground border-t border-white/5 mt-auto pt-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Ends in {formatTimeRemaining(market.endDate)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
