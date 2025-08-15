import React from 'react';
import { Search, Filter, Download, Moon, Sun } from 'lucide-react';
import { StockFilters as Filters } from '../types/stock';
import { sectors } from '../data/mockData';

interface StockFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onExportCSV: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const StockFilters: React.FC<StockFiltersProps> = ({
  filters,
  onFiltersChange,
  onExportCSV,
  isDark,
  onThemeToggle
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Hisse ara..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <select
            value={filters.sector}
            onChange={(e) => onFiltersChange({ ...filters, sector: e.target.value })}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector === 'Tümü' ? '' : sector}>
                {sector}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max F/DD"
            value={filters.priceToBookMax || ''}
            onChange={(e) => onFiltersChange({ 
              ...filters, 
              priceToBookMax: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-32"
            step="0.1"
          />

          <input
            type="number"
            placeholder="Min Temettü %"
            value={filters.dividendYieldMin || ''}
            onChange={(e) => onFiltersChange({ 
              ...filters, 
              dividendYieldMin: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-32"
            step="0.1"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.belowBookValue}
              onChange={(e) => onFiltersChange({ ...filters, belowBookValue: e.target.checked })}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Defter Değeri Altı
            </span>
          </label>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">CSV İndir</span>
          </button>

          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
