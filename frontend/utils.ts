import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const calculateOdds = (yesPool: number, noPool: number) => {
  const total = yesPool + noPool;
  if (total === 0) return { yes: 50, no: 50 };
  
  // Simple pool ratio calculation
  const yesPct = (yesPool / total) * 100;
  const noPct = (noPool / total) * 100;
  
  return {
    yes: Math.round(yesPct),
    no: Math.round(noPct)
  };
};

export const calculatePotentialWinnings = (
  betAmount: number,
  betYes: boolean,
  yesPool: number,
  noPool: number
) => {
  const totalPool = yesPool + noPool + betAmount;
  // If betting YES, your share is betAmount / (yesPool + betAmount)
  // Winnings is share * totalPool
  
  const poolSide = betYes ? yesPool : noPool;
  const newSidePool = poolSide + betAmount;
  const share = betAmount / newSidePool;
  const winnings = share * totalPool;
  
  return winnings;
};

export const formatTimeRemaining = (endDateStr: string): string => {
  const now = new Date();
  const end = new Date(endDateStr);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));