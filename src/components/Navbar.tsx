import React from 'react';
import { Pill, FileText, PackageCheck, History, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAiScanner }) => {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-lg text-slate-900 font-bold">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Pharma<span className="text-emerald-400">WMS</span>
                <span className="text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                  Faktur & Gudang Obat
                </span>
              </h1>
              <p className="text-xs text-slate-400">Sistem Barang Datang & Control FEFO</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveTab('input-faktur')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'input-faktur'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Input Faktur Masuk</span>
            </button>

            <button
              onClick={() => setActiveTab('stok-gudang')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stok-gudang'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PackageCheck className="h-4 w-4" />
              <span>Stok & Control FEFO</span>
            </button>

            <button
              onClick={() => setActiveTab('riwayat-faktur')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'riwayat-faktur'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Riwayat Faktur</span>
            </button>

            <button
              onClick={() => setActiveTab('master-obat')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'master-obat'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Master Obat</span>
            </button>
          </nav>

          {/* AI Scanner Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openAiScanner}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-semibold px-3 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-lg hover:shadow-emerald-500/20 transition-all border border-emerald-300/30 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-slate-950 fill-slate-950 animate-pulse" />
              <span>AI OCR Scan Faktur</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
