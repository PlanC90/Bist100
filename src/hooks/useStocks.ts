import { useQuery } from '@tanstack/react-query';
import { Stock } from '../types/stock';
import { StockService } from '../services/stockService';

const fetchStocks = async (): Promise<Stock[]> => {
  const stockService = StockService.getInstance();
  return stockService.fetchStocks();
};

export const useStocks = () => {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    refetchInterval: 15 * 60 * 1000, // Her 15 dakikada bir güncelle
    staleTime: 10 * 60 * 1000, // 10 dakika sonra stale kabul et
    retry: 3, // Hata durumunda 3 kez dene
    retryDelay: 5000, // 5 saniye bekle
    refetchOnWindowFocus: false, // Pencere odaklandığında yenileme yapma
    refetchOnMount: true, // Mount olduğunda yenile
  });
};
