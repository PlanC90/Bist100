import React, { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BarChart3, RefreshCw } from 'lucide-react';
import { useStocks } from './hooks/useStocks';
import { StockService } from './services/stockService';
import { StockTable } from './components/StockTable';
import { StockFilters } from './components/StockFilters';
import { StockDetailModal } from './components/StockDetailModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Stock, StockFilters as Filters } from './types/stock';
import { ScrollToTopButton } from './components/ScrollToTopButton';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { data: stocks, isLoading, error, refetch } = useStocks();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    sector: '',
    belowBookValue: false,
  });

  const sectors = useMemo(() => {
    if (!stocks) return ['Tümü'];
    const uniqueSectors = Array.from(new Set(stocks.map(stock => stock.sector)));
    return ['Tümü', ...uniqueSectors.sort()];
  }, [stocks]);

  // Debug için veri durumunu logla
  useEffect(() => {
    console.log('Stocks data:', stocks);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
  }, [stocks, isLoading, error]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const handleExportCSV = () => {
    if (!stocks) return;
    
    const filteredStocks = stocks.filter(stock => {
      const matchesSearch = 
        stock.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesSector = !filters.sector || stock.sector === filters.sector;
      const matchesPriceToBook = !filters.priceToBookMax || stock.priceToBook <= filters.priceToBookMax;
      const matchesDividendYield = !filters.dividendYieldMin || (stock.dividendYield && stock.dividendYield >= filters.dividendYieldMin);
      const matchesBelowBookValue = !filters.belowBookValue || stock.currentPrice < stock.bookValue;

      return matchesSearch && matchesSector && matchesPriceToBook && matchesDividendYield && matchesBelowBookValue;
    });

    const csvHeaders = [
      'Sembol',
      'Hisse Adı',
      'Mevcut Fiyat',
      'Günlük Değişim (%)',
      'Piyasa Değeri',
      'F/DD',
      'F/K',
      'Hacim',
      'Temettü (%)',
      'Sektör'
    ];

    const csvData = filteredStocks.map(stock => [
      stock.symbol,
      stock.name,
      stock.currentPrice,
      stock.dailyChangePercent,
      stock.marketCap,
      stock.priceToBook,
      stock.priceToEarnings || '',
      stock.volume,
      stock.dividendYield || '',
      stock.sector
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bist100-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await StockService.getInstance().refreshData();
      await refetch();
    } catch (error) {
      console.error('Manuel yenileme hatası:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Hata!</div>
          <div className="text-slate-600 dark:text-slate-400">
            Veriler yüklenirken bir hata oluştu: {error.message}
          </div>
          <button 
            onClick={handleManualRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  BIST Hisse Analiz Paneli
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gerçek Zamanlı BIST Verileri ({stocks?.length || 0} hisse)
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Yenile
              </button>
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">Son Güncelleme</div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {new Date().toLocaleString('tr-TR')}
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <StockFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        sectors={sectors}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <LoadingSpinner />
        ) : stocks ? (
          <StockTable
            stocks={stocks}
            filters={filters}
            onStockClick={setSelectedStock}
          />
        ) : null}
      </main>

      {/* Stock Detail Modal */}
      <StockDetailModal
        stock={selectedStock}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      />
      
      <ScrollToTopButton />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
