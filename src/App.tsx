/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Info,
  CheckCircle2
} from 'lucide-react';

const MARKETPLACE_FEE_RATE = 0.15;
const PAYONEER_FEE_RATE = 0.04;
const BANK_WITHDRAW_FEE_RATE = 0.03;

const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export default function App() {
  const [exchangeRate, setExchangeRate] = useState<number>(15000);
  const [modalIDR, setModalIDR] = useState<number>(42400);
  const [calculationMode, setCalculationMode] = useState<'target' | 'manual'>('target');
  const [selectedTarget, setSelectedTarget] = useState<number>(100);
  const [manualSellingPriceUSD, setManualSellingPriceUSD] = useState<number>(6.67);

  const targets = [
    { label: 'BEP (Balik Modal)', value: 0 },
    { label: 'Untung 50%', value: 50 },
    { label: 'Untung 100%', value: 100 },
    { label: 'Untung 150%', value: 150 },
    { label: 'Untung 200%', value: 200 },
    { label: 'Untung 300%', value: 300 },
    { label: 'Untung 400%', value: 400 },
    { label: 'Untung 500%', value: 500 },
  ];

  const stats = useMemo(() => {
    const modalUSD = modalIDR / exchangeRate;
    const totalMultiplier = (1 - MARKETPLACE_FEE_RATE) * (1 - PAYONEER_FEE_RATE) * (1 - BANK_WITHDRAW_FEE_RATE);
    
    let sellingPriceUSD = 0;
    let sellingPriceIDR = 0;

    if (calculationMode === 'target') {
      const targetNetUSD = modalUSD * (1 + selectedTarget / 100);
      sellingPriceUSD = targetNetUSD / totalMultiplier;
      sellingPriceIDR = sellingPriceUSD * exchangeRate;
    } else {
      sellingPriceUSD = manualSellingPriceUSD;
      sellingPriceIDR = manualSellingPriceUSD * exchangeRate;
    }

    const marketplaceAdminFeeUSD = sellingPriceUSD * MARKETPLACE_FEE_RATE;
    const balanceAfterMarketplaceUSD = sellingPriceUSD - marketplaceAdminFeeUSD;
    
    const payoneerFeeUSD = balanceAfterMarketplaceUSD * PAYONEER_FEE_RATE;
    const balanceInPayoneerUSD = balanceAfterMarketplaceUSD - payoneerFeeUSD;
    
    const bankWithdrawalFeeUSD = balanceInPayoneerUSD * BANK_WITHDRAW_FEE_RATE;
    const finalNetUSD = balanceInPayoneerUSD - bankWithdrawalFeeUSD;
    
    const finalNetIDR = finalNetUSD * exchangeRate;
    const netProfitIDR = finalNetIDR - modalIDR;
    const profitPercentage = modalIDR > 0 ? (netProfitIDR / modalIDR) * 100 : 0;

    return {
      modalUSD,
      sellingPriceUSD,
      sellingPriceIDR,
      marketplaceAdminFeeUSD,
      balanceAfterMarketplaceUSD,
      payoneerFeeUSD,
      balanceInPayoneerUSD,
      bankWithdrawalFeeUSD,
      finalNetUSD,
      finalNetIDR,
      netProfitIDR,
      profitPercentage
    };
  }, [modalIDR, calculationMode, selectedTarget, manualSellingPriceUSD, exchangeRate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sticky Header Wrapper */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto p-4 md:px-8 py-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="flex items-center md:items-start gap-3">
            <div className="p-2 bg-slate-900 rounded-xl shadow-lg shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg" 
                alt="Roblox Logo" 
                className="size-5 sm:size-6 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">Kalkulator Untung Roblox</h1>
              <p className="text-slate-500 text-[10px] md:text-xs font-medium truncate max-w-[200px] md:max-w-none">Hitung keuntungan bersih penjualan item Anda secara akurat.</p>
            </div>
          </div>
          <div className="bg-slate-200/50 p-1 rounded-xl active:scale-95 transition-transform w-fit mx-auto md:mx-0">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
              <TrendingUp size={14} className="text-blue-500" />
              <div className="flex items-center">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Kurs 1$ = Rp</span>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="text-[10px] font-black text-slate-600 w-14 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">

        {/* Global Modal Input */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <label htmlFor="modalInput" className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
              <Wallet size={14} className="text-orange-500" />
              Modal / Harga Beli (Rp)
            </label>
            <span className="text-[10px] text-slate-400 font-mono font-medium">~ {formatUSD(stats.modalUSD)}</span>
          </div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-orange-500 transition-colors">Rp</span>
            <input
              id="modalInput"
              type="number"
              value={modalIDR}
              onChange={(e) => setModalIDR(Number(e.target.value))}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-5 pl-12 pr-4 text-3xl font-black text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none"
              placeholder="0"
            />
          </div>
        </section>

        {/* Mode & Details */}
        <div className="space-y-6">
          {/* Mode Switcher */}
          <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit border border-slate-200/50">
            <button
              onClick={() => setCalculationMode('target')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                calculationMode === 'target' 
                ? 'bg-white text-blue-600 shadow-md shadow-slate-200 scale-100' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mode Target Profit
            </button>
            <button
              onClick={() => setCalculationMode('manual')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                calculationMode === 'manual' 
                ? 'bg-white text-blue-600 shadow-md shadow-slate-200 scale-100' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mode Input Manual
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calculationMode === 'target' ? (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 md:col-span-2"
              >
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                  <TrendingUp size={14} className="text-blue-500" />
                  Pilih Target Profit (%)
                </label>
                <div className="relative group">
                  <select
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 pl-4 pr-10 text-base font-black text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                  >
                    {targets.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} (Target {t.value}%)
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <ArrowRight size={18} className="rotate-90" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                  <Info size={16} className="text-blue-500 mt-0.5" />
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Sistem akan menghitung harga jual yang dibutuhkan agar profit bersih Anda mencapai target **{selectedTarget}%**.
                  </p>
                </div>
              </motion.section>
            ) : (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 md:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="manualSellingPrice" className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                    <DollarSign size={14} className="text-blue-500" />
                    Input Harga Jual ($)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">~ {formatIDR(stats.sellingPriceIDR)}</span>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-blue-500 transition-colors">$</span>
                  <input
                    id="manualSellingPrice"
                    type="number"
                    step="0.1"
                    value={manualSellingPriceUSD}
                    onChange={(e) => setManualSellingPriceUSD(Number(e.target.value))}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-5 pl-12 pr-4 text-3xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <Info size={16} className="text-slate-400 mt-0.5" />
                  <p className="text-xs text-slate-500 font-medium italic">
                    Masukkan harga jual dalam USD untuk melihat rincian keuntungan bersih yang Anda terima.
                  </p>
                </div>
              </motion.section>
            )}
          </div>
        </div>

        {/* Summary Dashboard */}
        <motion.section 
          layout
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md divide-x divide-slate-100"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4">
            <div className="p-5 flex flex-col gap-1 border-r border-slate-100">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Untung Bersih (%)</span>
              <span className={`text-2xl font-black ${stats.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(stats.profitPercentage)}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-1 border-r border-slate-100 bg-green-50/20">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Untung Bersih (Rp)</span>
              <span className={`text-2xl font-black ${stats.netProfitIDR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatIDR(stats.netProfitIDR)}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-1 border-r border-slate-100">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Terima Bersih (Rp)</span>
              <span className="text-2xl font-black text-blue-600">
                {formatIDR(stats.finalNetIDR)}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Harga Jual ($)</span>
              <span className="text-2xl font-black text-slate-800 tracking-tight">{formatUSD(stats.sellingPriceUSD)}</span>
            </div>
          </div>
        </motion.section>

        {/* Detailed Breakdown */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Banknote size={20} className="text-blue-500" />
              Detail Potongan Transaksi
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Langkah Biaya</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Rupiah (Rp)</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Dollar ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-sm">
                <tr>
                  <td className="p-4 text-slate-600 font-sans flex items-center gap-2">
                    <Wallet size={14} className="text-orange-400" />
                    Modal Awal
                  </td>
                  <td className="p-4 text-right text-slate-900 font-bold">{formatIDR(modalIDR)}</td>
                  <td className="p-4 text-right text-slate-500">{formatUSD(stats.modalUSD)}</td>
                </tr>
                <tr className="bg-blue-600 text-white">
                  <td className="p-4 font-sans font-bold flex items-center gap-2">
                    <DollarSign size={14} className="text-white brightness-200" />
                    Harga Jual {calculationMode === 'target' ? 'Rekomendasi' : ''}
                  </td>
                  <td className="p-4 text-right font-black text-lg font-mono">
                    {formatIDR(stats.sellingPriceIDR)}
                  </td>
                  <td className="p-4 text-right font-bold opacity-90 font-mono">
                    {formatUSD(stats.sellingPriceUSD)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-sans flex items-center gap-2">
                    <ArrowRight size={14} className="text-red-400" />
                    Admin Marketplace (15%)
                  </td>
                  <td className="p-4 text-right text-red-500 font-medium">-{formatIDR(stats.marketplaceAdminFeeUSD * exchangeRate)}</td>
                  <td className="p-4 text-right text-red-500 font-medium">-{formatUSD(stats.marketplaceAdminFeeUSD)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-sans font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" />
                    Saldo Setelah Marketplace
                  </td>
                  <td className="p-4 text-right text-slate-900">{formatIDR(stats.balanceAfterMarketplaceUSD * exchangeRate)}</td>
                  <td className="p-4 text-right text-slate-500">{formatUSD(stats.balanceAfterMarketplaceUSD)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-sans flex items-center gap-2">
                    <ArrowRight size={14} className="text-red-400" />
                    Potongan Payoneer (4%)
                  </td>
                  <td className="p-4 text-right text-red-500 font-medium">-{formatIDR(stats.payoneerFeeUSD * exchangeRate)}</td>
                  <td className="p-4 text-right text-red-500 font-medium">-{formatUSD(stats.payoneerFeeUSD)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-sans font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" />
                    Saldo Akhir Payoneer
                  </td>
                  <td className="p-4 text-right text-slate-900">{formatIDR(stats.balanceInPayoneerUSD * exchangeRate)}</td>
                  <td className="p-4 text-right text-slate-500">{formatUSD(stats.balanceInPayoneerUSD)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-sans flex items-center gap-2">
                    <ArrowRight size={14} className="text-red-400" />
                    Withdraw Bank (3%)
                  </td>
                  <td className="p-4 text-right text-red-500 font-medium">-{formatIDR(stats.bankWithdrawalFeeUSD * exchangeRate)}</td>
                  <td className="p-4 text-right text-red-500 font-medium">-{formatUSD(stats.bankWithdrawalFeeUSD)}</td>
                </tr>
                <tr className="bg-green-50/30 hover:bg-green-50 transition-colors">
                  <td className="p-4 text-green-800 font-sans font-bold flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    Hasil Akhir (Net)
                  </td>
                  <td className="p-4 text-right text-green-600 font-black text-lg">{formatIDR(stats.finalNetIDR)}</td>
                  <td className="p-4 text-right text-green-600 font-black text-lg">{formatUSD(stats.finalNetUSD)}</td>
                </tr>
                <tr className={`hover:bg-slate-50/50 transition-colors border-t-2 border-slate-200`}>
                  <td className="p-4 text-slate-800 font-sans font-black flex items-center gap-2 text-lg">
                    <TrendingUp size={20} className="text-blue-500" />
                    Untung Bersih (Net)
                  </td>
                  <td className={`p-4 text-right font-black text-xl ${stats.netProfitIDR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatIDR(stats.netProfitIDR)}
                  </td>
                  <td className={`p-4 text-right font-black text-xl ${stats.netProfitIDR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({formatPercent(stats.profitPercentage)})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Footer Info */}
        <footer className="text-center text-slate-400 text-xs py-8 space-y-2">
          <p>Dihitung menggunakan skema biaya standar marketplace Roblox & Payoneer (Multiplier Bersih: 0.79152x).</p>
          <p>© 2025 Roblox Profit Calculator • Precision Financial Tools</p>
        </footer>
      </div>
    </div>
  );
}


