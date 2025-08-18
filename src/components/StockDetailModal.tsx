import React from 'react';
import { Stock } from '../types/stock';

interface StockDetailModalProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, isOpen, onClose }) => {
  if (!isOpen || !stock) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay, when the modal is open */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-slate-800 opacity-75"></div>
        </div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100" id="modal-title">
                  {stock.name} ({stock.symbol})
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Sektör: {stock.sector}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-700">
            <dl>
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  Mevcut Fiyat
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.currentPrice} TL
                </dd>
              </div>
              <div className="bg-white dark:bg-slate-900 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  Günlük Değişim
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.dailyChangePercent}%
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  Piyasa Değeri
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.marketCap}
                </dd>
              </div>
              <div className="bg-white dark:bg-slate-900 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  F/DD (Fiyat/Defter Değeri)
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.priceToBook}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  F/K (Fiyat/Kazanç)
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.priceToEarnings}
                </dd>
              </div>
              <div className="bg-white dark:bg-slate-900 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  Hacim
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.volume}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  Temettü Verimi
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {stock.dividendYield}
                </dd>
              </div>
            </dl>
          </div>
          <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
