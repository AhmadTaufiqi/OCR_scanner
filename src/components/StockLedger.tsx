import React, { useState } from 'react';
import { StockBatch } from '../types';
import { Package, Search, AlertTriangle, CheckCircle, ShieldAlert, ArrowUpDown, Filter, Building2, MapPin } from 'lucide-react';

interface StockLedgerProps {
  stockBatches: StockBatch[];
}

export const StockLedger: React.FC<StockLedgerProps> = ({ stockBatches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('ALL');
  const [filterStatusEd, setFilterStatusEd] = useState('ALL');
  const [sortByFefo, setSortByFefo] = useState(true);

  // Helper calculation for ED Days Remaining
  const getDaysRemaining = (edString: string) => {
    const edDate = new Date(edString);
    const today = new Date();
    const diffTime = edDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper status ED
  const getEdStatus = (days: number) => {
    if (days < 0) return { label: 'KADALUWARSA', color: 'bg-red-100 text-red-800 border-red-300', icon: ShieldAlert };
    if (days <= 90) return { label: 'KRITIS (< 3 Bln)', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle };
    if (days <= 180) return { label: 'WARNING (< 6 Bln)', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle };
    return { label: 'AMAN', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle };
  };

  // Filtering
  const filteredBatches = stockBatches.filter(batch => {
    const matchesSearch =
      batch.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.noBatch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.namaSupplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.noInvoice.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesKategori = filterKategori === 'ALL' || batch.kategori === filterKategori;

    const days = getDaysRemaining(batch.expiredDate);
    let matchesStatus = true;
    if (filterStatusEd === 'KRITIS') matchesStatus = days <= 90;
    if (filterStatusEd === 'WARNING') matchesStatus = days > 90 && days <= 180;
    if (filterStatusEd === 'AMAN') matchesStatus = days > 180;

    return matchesSearch && matchesKategori && matchesStatus;
  });

  // Sort FEFO (Expired Date ASC)
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    if (sortByFefo) {
      return new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime();
    }
    return b.qtySisa - a.qtySisa;
  });

  // Metrics
  const totalBatches = stockBatches.length;
  const criticalEdCount = stockBatches.filter(b => getDaysRemaining(b.expiredDate) <= 90).length;
  const warningEdCount = stockBatches.filter(b => {
    const d = getDaysRemaining(b.expiredDate);
    return d > 90 && d <= 180;
  }).length;
  const totalQtyUnit = stockBatches.reduce((acc, curr) => acc + curr.qtySisa, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Batch Aktif Gudang</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalBatches} Batch</h3>
            <p className="text-[11px] text-slate-400">{totalQtyUnit.toLocaleString('id-ID')} Total Box/Unit</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status Aman (&gt; 6 Bulan)</p>
            <h3 className="text-2xl font-bold text-emerald-700">
              {stockBatches.length - criticalEdCount - warningEdCount} Batch
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">Stok Prima Siap Jual</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Warning ED (3 - 6 Bulan)</p>
            <h3 className="text-2xl font-bold text-amber-700">{warningEdCount} Batch</h3>
            <p className="text-[11px] text-amber-600">Prioritaskan Pengeluaran FEFO</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Kritis / Dekat ED (&lt; 3 Bulan)</p>
            <h3 className="text-2xl font-bold text-red-700">{criticalEdCount} Batch</h3>
            <p className="text-[11px] text-red-600 font-medium">Segera Retur / Clearance</p>
          </div>
        </div>

      </div>

      {/* Main Stock Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        
        {/* Controls / Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4">
          
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-600" />
              Buku Stok Obat & Kontrol FEFO (Per Batch)
            </h3>
            <p className="text-xs text-slate-500">
              Sistem menampilkan urutan stok obat berdasarkan **First Expired, First Out (FEFO)**
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Obat / No Batch / PBF..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>

            {/* Filter Kategori */}
            <select
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Bebas">Bebas / OTC</option>
              <option value="Keras">Obat Keras (K)</option>
              <option value="Cold Chain">Cold Chain (Kulkas)</option>
              <option value="Psikotropika">Psikotropika</option>
            </select>

            {/* Filter Status ED */}
            <select
              value={filterStatusEd}
              onChange={e => setFilterStatusEd(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="ALL">Semua Status ED</option>
              <option value="AMAN">Aman (&gt; 6 Bln)</option>
              <option value="WARNING">Warning (3-6 Bln)</option>
              <option value="KRITIS">Kritis (&lt; 3 Bln)</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortByFefo(!sortByFefo)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer border"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-emerald-600" />
              <span>{sortByFefo ? 'Sorted by FEFO (ED Terdekat)' : 'Sorted by Quantity'}</span>
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Urutan FEFO</th>
                <th className="p-3">Nama Obat / Produk</th>
                <th className="p-3">No. Batch</th>
                <th className="p-3">Exp Date (ED)</th>
                <th className="p-3">Sisa Stok</th>
                <th className="p-3">Lokasi Rak</th>
                <th className="p-3">Harga Beli</th>
                <th className="p-3">PBF Distributor</th>
                <th className="p-3">Status ED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedBatches.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    Tidak ada data batch obat yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                sortedBatches.map((batch, index) => {
                  const daysLeft = getDaysRemaining(batch.expiredDate);
                  const statusInfo = getEdStatus(daysLeft);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={batch.id} className="hover:bg-slate-50 transition">
                      
                      <td className="p-3 font-mono font-bold text-slate-400 text-center">
                        #{index + 1}
                      </td>

                      <td className="p-3">
                        <p className="font-bold text-slate-900">{batch.namaBarang}</p>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                          {batch.kategori}
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-emerald-800 uppercase">
                        {batch.noBatch}
                      </td>

                      <td className="p-3 font-mono">
                        <p className="font-bold text-slate-800">{batch.expiredDate}</p>
                        <p className="text-[10px] text-slate-500">({daysLeft} hari lagi)</p>
                      </td>

                      <td className="p-3">
                        <span className="font-extrabold text-slate-900 text-sm">{batch.qtySisa}</span>{' '}
                        <span className="text-slate-500 font-semibold">{batch.satuan}</span>
                      </td>

                      <td className="p-3 font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono text-[11px]">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {batch.kodeRak}
                        </span>
                      </td>

                      <td className="p-3 font-mono font-medium text-slate-700">
                        Rp {batch.hargaBeli.toLocaleString('id-ID')}
                      </td>

                      <td className="p-3 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{batch.namaSupplier}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400">Inv: {batch.noInvoice}</p>
                      </td>

                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
