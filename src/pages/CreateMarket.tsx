import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { api } from '@/api/mock'
import { type MarketCategory } from '@/types'
import { toast } from 'sonner'

export function CreateMarket() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    question: '',
    category: '',
    endDate: '',
    minBet: '10'
  })

  const createMutation = useMutation({
    mutationFn: api.createMarket,
    onSuccess: (data) => {
      toast.success('Market created successfully!')
      navigate(`/market/${data.id}`)
    },
    onError: () => {
      toast.error('Failed to create market')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.question || !formData.category || !formData.endDate) {
      toast.error('Please fill in all fields')
      return
    }
    createMutation.mutate({
      question: formData.question,
      category: formData.category as MarketCategory,
      endDate: formData.endDate
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Market</h1>
        <p className="text-muted-foreground">Launch a prediction market for any topic.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Details</CardTitle>
          <CardDescription>Define the core parameters of your market.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="e.g., Will Bitcoin hit $100k in 2024?"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Make it clear and resolvable with a definitive YES or NO outcome.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Bet (USD)</Label>
              <Input
                type="number"
                value={formData.minBet}
                onChange={(e) => setFormData({...formData, minBet: e.target.value})}
                min="1"
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Deploy Market
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      {formData.question && (
        <div className="space-y-4 opacity-70 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preview</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {formData.category || 'Category'}
                </span>
              </div>
              <CardTitle>{formData.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Market ends on {formData.endDate ? new Date(formData.endDate).toLocaleString() : '...'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
