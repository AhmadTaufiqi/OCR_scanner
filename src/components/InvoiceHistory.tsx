import React, { useState } from 'react';
import { InvoiceHeader } from '../types';
import { History, FileText, Calendar, Building2, ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface InvoiceHistoryProps {
  invoices: InvoiceHeader[];
}

export const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ invoices }) => {
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(
    invoices[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedInvoiceId(expandedInvoiceId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Riwayat Faktur Masuk PBF
            </h3>
            <p className="text-xs text-slate-500">
              Daftar seluruh dokumen faktur penerimaan barang yang telah disetujui & masuk gudang.
            </p>
          </div>
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border">
            Total {invoices.length} Faktur
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Belum ada faktur yang diinput ke dalam sistem.
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map(inv => {
              const isExpanded = expandedInvoiceId === inv.id;

              return (
                <div
                  key={inv.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition"
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleExpand(inv.id)}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 font-mono text-sm">
                            No. Invoice: {inv.noInvoice}
                          </h4>
                          {inv.noSp && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                              SP: {inv.noSp}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            {inv.namaSupplier}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            Tgl: {inv.tglInvoice}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Total Faktur + PPN</p>
                        <p className="font-mono font-extrabold text-slate-900 text-base text-emerald-700">
                          Rp {inv.totalBayar.toLocaleString('id-ID')}
                        </p>
                      </div>

                      <button className="text-slate-400 hover:text-slate-700 p-1">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Rows */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-lg font-mono">
                        <div>
                          <span className="text-slate-400 block">Subtotal Item:</span>
                          <span className="font-semibold">Rp {inv.subTotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Diskon Faktur:</span>
                          <span className="font-semibold">Rp {inv.discount.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">DPP PMK 131/2024:</span>
                          <span className="font-semibold">Rp {inv.dpp.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">PPN 11%:</span>
                          <span className="font-semibold text-emerald-700">Rp {inv.ppn.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-slate-700">Item Obat Terdaftar Dalam Faktur ini:</p>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                              <th className="p-2">Nama Obat</th>
                              <th className="p-2">Satuan</th>
                              <th className="p-2">Qty</th>
                              <th className="p-2">No Batch</th>
                              <th className="p-2">Exp Date</th>
                              <th className="p-2">Harga Unit</th>
                              <th className="p-2">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {inv.items.map((it, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 font-mono">
                                <td className="p-2 font-sans font-bold text-slate-800">{it.namaBarang}</td>
                                <td className="p-2 uppercase">{it.satuan}</td>
                                <td className="p-2 font-bold">{it.qty}</td>
                                <td className="p-2 font-bold text-emerald-800">{it.noBatch}</td>
                                <td className="p-2 text-amber-800 font-semibold">{it.expiredDate}</td>
                                <td className="p-2">Rp {it.hargaUnit.toLocaleString('id-ID')}</td>
                                <td className="p-2 font-bold">Rp {it.jumlahRp.toLocaleString('id-ID')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
