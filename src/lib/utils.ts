import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatAddress(address: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function calculateOdds(yesPool: number, noPool: number) {
  const total = yesPool + noPool
  if (total === 0) return { yes: 50, no: 50 }
  return {
    yes: Math.round((noPool / total) * 100),
    no: Math.round((yesPool / total) * 100),
  }
}

export function calculatePotentialWinnings(betAmount: number, betYes: boolean, yesPool: number, noPool: number) {
  const odds = calculateOdds(yesPool, noPool)
  const percentage = betYes ? odds.yes : odds.no
  // Simple pool-based calculation: (betAmount / poolShare) * totalPool
  // This is a simplified version. Real prediction markets use AMM or order books.
  // We'll use a simplified multiplier based on inverse probability.
  const multiplier = 100 / percentage
  return betAmount * multiplier
}

export function formatTimeRemaining(endDate: Date | string) {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${days}d ${hours}h ${minutes}m`
}
