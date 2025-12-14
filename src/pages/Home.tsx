import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MarketCard } from '@/components/MarketCard'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/api/mock'

export function Home() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [status, setStatus] = useState<string>('active')

  const { data: markets, isLoading } = useQuery({
    queryKey: ['markets', category, status],
    queryFn: () => api.getMarkets(status === 'all' ? undefined : status, category)
  })

  const filteredMarkets = markets?.filter(m => 
    m.question.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Market Discovery
          </h1>
          <p className="text-muted-foreground text-lg">
            Predict the future. Bet on outcomes. Earn rewards.
          </p>
        </div>
        <Link to="/create">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Market
          </Button>
        </Link>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-background/95 backdrop-blur py-4 -my-4 px-1 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Politics">Politics</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border p-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))
        ) : filteredMarkets?.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No markets found matching your criteria.
          </div>
        ) : (
          filteredMarkets?.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))
        )}
      </section>
    </div>
  )
}
