import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Market, Position, Shift, BetQuote } from '../types';

export const useMarkets = (category?: string, searchTerm?: string) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const data = await api.getMarkets(category, searchTerm);
        setMarkets(data);
        setError(null);
      } catch (err) {
        setError("Failed to load markets");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [category, searchTerm]);

  return { markets, loading, error };
};

export const useMarketDetail = (id: string) => {
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        setLoading(true);
        const data = await api.getMarketById(id);
        setMarket(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMarket();
  }, [id]);

  return { market, loading };
};

export const useQuote = () => {
  const [quote, setQuote] = useState<BetQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(async (marketId: string, betYes: boolean, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getQuote(marketId, betYes, amount);
      setQuote(data);
      return data;
    } catch (err) {
      setError("Failed to get quote");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { quote, loading, error, getQuote, setQuote };
};

export const usePositions = (address?: string) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await api.getUserPositions(address);
        setPositions(data);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [address]);

  return { positions, loading };
};

export const useWallet = () => {
  // Simple mock wallet
  const [address, setAddress] = useState<string | null>(null);
  
  const connect = () => {
    setAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  };

  const disconnect = () => {
    setAddress(null);
  };

  return { address, connect, disconnect, isConnected: !!address };
};