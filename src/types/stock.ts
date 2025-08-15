export interface Stock {
  id: string;
  symbol: string;
  name: string;
  logo?: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  marketCap: number;
  bookValue: number;
  priceToBook: number;
  priceToEarnings?: number;
  floatPercent?: number;
  volume: number;
  allTimeHigh: number;
  allTimeHighDate: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  dividendYield?: number;
  sector: string;
  lastUpdate: string;
}

export interface StockFilters {
  search: string;
  sector: string;
  priceToBookMax?: number;
  dividendYieldMin?: number;
  belowBookValue: boolean;
}
