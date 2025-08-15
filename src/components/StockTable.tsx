import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { TrendingUp, TrendingDown, ArrowUpDown, Award, AlertTriangle } from 'lucide-react';
import { Stock, StockFilters } from '../types/stock';
import { formatCurrency, formatNumber, formatLargeNumber, formatPercentage, formatDate, isNearATH, isBelowBookValue } from '../utils/formatters';

const columnHelper = createColumnHelper<Stock>();

interface StockTableProps {
  stocks: Stock[];
  filters: StockFilters;
  onStockClick: (stock: Stock) => void;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, filters, onStockClick }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filteredData = useMemo(() => {
    // Debug: Mevcut filtreleri ve hisse senedi sayısını kontrol et
    console.log('StockTable - Mevcut filtreler:', filters);
    const filtered = stocks.filter(stock => {
      const matchesSearch = 
        stock.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesSector = !filters.sector || stock.sector === filters.sector;
      
      const matchesPriceToBook = 
        !filters.priceToBookMax || stock.priceToBook <= filters.priceToBookMax;
      
      const matchesDividendYield = 
        !filters.dividendYieldMin || 
        (stock.dividendYield && stock.dividendYield >= filters.dividendYieldMin);
      
      const matchesBelowBookValue = 
        !filters.belowBookValue || isBelowBookValue(stock.currentPrice, stock.bookValue);

      return matchesSearch && matchesSector && matchesPriceToBook && matchesDividendYield && matchesBelowBookValue;
    });
    console.log('StockTable - Filtrelenmiş veri uzunluğu:', filtered.length);
    return filtered;
  }, [stocks, filters]);

  const columns = useMemo(() => [
    columnHelper.accessor('symbol', {
      header: 'Hisse',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {row.original.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{row.original.symbol}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {row.original.name}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('currentPrice', {
      header: 'Fiyat',
      cell: ({ getValue, row }) => {
        const price = getValue();
        const isBelow = isBelowBookValue(price, row.original.bookValue);
        const isNear = isNearATH(price, row.original.allTimeHigh);
        
        return (
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isBelow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {formatCurrency(price)}
            </span>
            {isBelow && (
              <AlertTriangle className="h-4 w-4 text-amber-500" title="Defter Değeri Altında" />
            )}
            {isNear && (
              <Award className="h-4 w-4 text-blue-500" title="ATH'a Yakın" />
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('dailyChangePercent', {
      header: 'Günlük Değişim',
      cell: ({ row }) => {
        const change = row.original.dailyChange;
        const changePercent = row.original.dailyChangePercent;
        const isPositive = change >= 0;
        
        return (
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <div className="text-sm">
              <div className="font-semibold">{formatPercentage(changePercent)}</div>
              <div>{formatCurrency(change)}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('marketCap', {
      header: 'Piyasa Değeri',
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">{formatLargeNumber(getValue())}</span>
      ),
    }),
    columnHelper.accessor('priceToBook', {
      header: 'F/DD',
      cell: ({ getValue, row }) => {
        const ratio = getValue();
        const isBelow = ratio < 1;
        
        return (
          <span className={`font-medium ${isBelow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {formatNumber(ratio)}
          </span>
        );
      },
    }),
    columnHelper.accessor('bookValue', {
      header: 'Defter Değeri',
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('priceToEarnings', {
      header: 'F/K',
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {getValue() ? formatNumber(getValue()!) : '-'}
        </span>
      ),
    }),
    columnHelper.accessor('volume', {
      header: 'Hacim',
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">{formatLargeNumber(getValue())}</span>
      ),
    }),
    columnHelper.accessor('dividendYield', {
      header: 'Temettü',
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {getValue() ? formatPercentage(getValue()!) : '-'}
        </span>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {table.getRowModel().rows.map((row) => {
              // Debug: Her bir satırın render edilip edilmediğini kontrol et
              console.log('StockTable - Satır render ediliyor:', row.original.symbol);
              return (
                <tr
                  key={row.id}
                  onClick={() => onStockClick(row.original)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            Filtrelere uygun hisse bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
};
