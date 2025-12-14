import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/api/mock'
import { formatCurrency } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ArrowUpRight, TrendingUp } from 'lucide-react'

export function Portfolio() {
  const { data: positions, isLoading } = useQuery({
    queryKey: ['positions', 'user-1'],
    queryFn: () => api.getUserPositions('user-1')
  })

  // Mock stats
  const totalValue = 1250.50
  const totalProfit = 250.50
  const profitPercentage = 25.5

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Portfolio</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-500">+{formatCurrency(totalProfit)}</div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                {profitPercentage}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Positions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Bets</h2>
        
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : positions?.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card/50">
            <p className="text-muted-foreground mb-4">You don't have any active positions.</p>
            <Link to="/" className="text-primary hover:underline">
              Explore Markets
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {positions?.map((position) => (
              <Card key={position.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Link to={`/market/${position.marketId}`} className="font-semibold hover:underline">
                      {position.marketQuestion}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={position.betYes ? 'default' : 'destructive'} className="uppercase">
                        {position.betYes ? 'YES' : 'NO'}
                      </Badge>
                      <span>•</span>
                      <span>{formatCurrency(position.amount)} invested</span>
                      <span>•</span>
                      <span>Bought at {position.odds}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Current Value</div>
                      <div className="font-mono font-bold">
                        {formatCurrency(position.amount * 1.1)} {/* Mock value */}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">P/L</div>
                      <div className="font-mono font-bold text-green-500 flex items-center justify-end">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {formatCurrency(position.amount * 0.1)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
