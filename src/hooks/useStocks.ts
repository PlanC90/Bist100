import { useQuery } from '@tanstack/react-query';
import { Stock } from '../types/stock';
import { mockStocks } from '../data/mockData';

// Simulated API call - replace with real API
const fetchStocks = async (): Promise<Stock[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockStocks;
};

export const useStocks = () => {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
