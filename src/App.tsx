import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { useStocks } from './hooks/useStocks';
import { StockTable } from './components/StockTable';
import { StockFilters } from './components/StockFilters';
import { StockDetailModal } from './components/StockDetailModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Stock, StockFilters as Filters } from './types/stock';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { data: stocks, isLoading, error } = useStocks();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    sector: '',
    belowBookValue: false,
  });

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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Hata!</div>
          <div className="text-slate-600 dark:text-slate-400">
            Veriler yüklenirken bir hata oluştu.
          </div>
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
                  BIST 100 Analiz Paneli
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Türkiye'nin en büyük 100 şirketi
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">Son Güncelleme</div>
                BIST Hisse Analiz Paneli
                  {new Date().toLocaleString('tr-TR')}
                </div>
                Borsa İstanbul hisse senetleri analizi
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
