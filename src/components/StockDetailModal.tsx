import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from './ui/Dialog';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Stock } from '../types/stock';
import { 
  formatCurrency, 
  formatNumber, 
  formatLargeNumber, 
  formatPercentage, 
  formatDate, 
  isNearATH, 
  isBelowBookValue 
} from '../utils/formatters';

interface StockDetailModalProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ 
  stock, 
  isOpen, 
  onClose 
}) => {
  if (!stock) return null;

  const isPositiveChange = stock.dailyChange >= 0;
  const isBelow = isBelowBookValue(stock.currentPrice, stock.bookValue);
  const isNear = isNearATH(stock.currentPrice, stock.allTimeHigh);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="text-xl font-bold">{stock.symbol}</div>
              <div className="text-sm text-slate-500 font-normal">{stock.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fiyat ve Değişim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Mevcut Fiyat</div>
                  <div className={`text-2xl font-bold ${isBelow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {formatCurrency(stock.currentPrice)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isBelow && (
                    <AlertTriangle className="h-5 w-5 text-amber-500" title="Defter Değeri Altında" />
                  )}
                  {isNear && (
                    <Award className="h-5 w-5 text-blue-500" title="ATH'a Yakın" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Günlük Değişim</div>
                  <div className={`text-xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(stock.dailyChangePercent)}
                  </div>
                  <div className={`text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(stock.dailyChange)}
                  </div>
                </div>
                {isPositiveChange ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Piyasa Değeri</span>
              </div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatLargeNumber(stock.marketCap)}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Hacim</span>
              </div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatLargeNumber(stock.volume)}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Sektör</span>
              </div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stock.sector}</div>
            </div>
          </div>

          {/* Finansal Oranlar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Finansal Oranlar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">F/DD</div>
                <div className={`text-lg font-bold ${stock.priceToBook < 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {formatNumber(stock.priceToBook)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">F/K</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {stock.priceToEarnings ? formatNumber(stock.priceToEarnings) : '-'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Defter Değeri</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(stock.bookValue)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Temettü</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {stock.dividendYield ? formatPercentage(stock.dividendYield) : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Fiyat Aralığı */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fiyat Aralığı</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Tüm Zamanlar En Yüksek</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(stock.allTimeHigh)}
                </div>
                <div className="text-xs text-blue-500 dark:text-blue-400">
                  {formatDate(stock.allTimeHighDate)}
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm text-green-600 dark:text-green-400 mb-1">52 Hafta Yüksek</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(stock.fiftyTwoWeekHigh)}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-sm text-red-600 dark:text-red-400 mb-1">52 Hafta Düşük</div>
                <div className="text-lg font-bold text-red-700 dark:text-red-300">
                  {formatCurrency(stock.fiftyTwoWeekLow)}
                </div>
              </div>
            </div>
          </div>

          {/* Ek Bilgiler */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Dolaşımdaki Pay:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                  {stock.floatPercent ? formatPercentage(stock.floatPercent) : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Son Güncelleme:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                  {new Date(stock.lastUpdate).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
