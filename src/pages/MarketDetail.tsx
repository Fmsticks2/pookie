import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { BetModal } from '@/components/BetModal'
import { api } from '@/api/mock'
import { formatCurrency, calculateOdds, formatTimeRemaining } from '@/lib/utils'
import { Users, Clock, AlertTriangle } from 'lucide-react'

export function MarketDetail() {
  const { id } = useParams()
  const { data: market, isLoading } = useQuery({
    queryKey: ['market', id],
    queryFn: () => api.getMarket(id!),
    enabled: !!id
  })

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full" />
    </div>
  }

  if (!market) return <div>Market not found</div>

  const odds = calculateOdds(market.yesPool, market.noPool)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {market.category}
          </Badge>
          <Badge variant="outline">
            Ends in {formatTimeRemaining(market.endDate)}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {market.question}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Chart/Graph Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Outcome Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-green-500">YES {odds.yes}%</span>
                    <span className="text-red-500">NO {odds.no}%</span>
                  </div>
                  <Progress value={odds.yes} className="h-4" />
                </div>
                
                <div className="h-64 bg-secondary/20 rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                  Probability History Chart Placeholder
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Info */}
          <Card>
            <CardHeader>
              <CardTitle>Market Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                This market will resolve to "Yes" if the event occurs as described. 
                Resolution source will be official announcements or reputable news sources.
              </p>
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 text-yellow-500 rounded-md border border-yellow-500/20">
                <AlertTriangle className="h-4 w-4" />
                <span>Trading closes 24h before market resolution.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="glass sticky top-24">
            <CardHeader>
              <CardTitle>Place Bet</CardTitle>
              <CardDescription>Predict the outcome</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="yes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="yes" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500">
                    YES
                  </TabsTrigger>
                  <TabsTrigger value="no" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500">
                    NO
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="yes" className="pt-4">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-green-500">
                      {odds.yes}%
                    </span>
                    <p className="text-xs text-muted-foreground">Current Probability</p>
                  </div>
                  <BetModal market={market} prediction="yes" />
                </TabsContent>
                <TabsContent value="no" className="pt-4">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-red-500">
                      {odds.no}%
                    </span>
                    <p className="text-xs text-muted-foreground">Current Probability</p>
                  </div>
                  <BetModal market={market} prediction="no" />
                </TabsContent>
              </Tabs>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Volume</span>
                  <span className="font-mono">{formatCurrency(market.totalPool)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Participants</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="h-3 w-3" />
                    {market.participants}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {new Date(market.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
