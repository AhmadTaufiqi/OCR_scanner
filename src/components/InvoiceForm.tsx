import React, { useState } from 'react';
import { Supplier, ProductMaster, InvoiceItem, InvoiceHeader, StockBatch } from '../types';
import { Plus, Trash2, Save, Sparkles, AlertTriangle, Calculator, Building2, Calendar, FileText, CheckCircle } from 'lucide-react';

interface InvoiceFormProps {
  suppliers: Supplier[];
  products: ProductMaster[];
  onSaveInvoice: (invoice: InvoiceHeader, newBatches: StockBatch[]) => void;
  ocrPresetData: any;
  openAiModal: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  suppliers,
  products,
  onSaveInvoice,
  ocrPresetData,
  openAiModal,
}) => {
  // Form State
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [noInvoice, setNoInvoice] = useState<string>('');
  const [tglInvoice, setTglInvoice] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tglJatuhTempo, setTglJatuhTempo] = useState<string>('');
  const [noSp, setNoSp] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      productId: products[0]?.id || '',
      namaBarang: products[0]?.nama || '',
      satuan: products[0]?.satuanBeli || 'BOX',
      qty: 10,
      noBatch: '',
      expiredDate: '',
      hargaUnit: 0,
      jumlahRp: 0,
      kodeRak: 'Rak A-01',
    },
  ]);

  // Handle OCR autofill when passed from parent modal
  React.useEffect(() => {
    if (ocrPresetData) {
      // Find matching supplier
      const matchedSup = suppliers.find(s => s.nama.toLowerCase().includes(ocrPresetData.namaSupplier.toLowerCase())) || suppliers[0];
      if (matchedSup) setSupplierId(matchedSup.id);
      
      setNoInvoice(ocrPresetData.noInvoice);
      setTglInvoice(ocrPresetData.tglInvoice);
      setTglJatuhTempo(ocrPresetData.tglJatuhTempo);
      setNoSp(ocrPresetData.noSp);
      setDiscount(ocrPresetData.discount || 0);

      if (ocrPresetData.items && ocrPresetData.items.length > 0) {
        setItems(
          ocrPresetData.items.map((it: any, index: number) => ({
            id: `item-ocr-${index}`,
            productId: it.productId || products[0]?.id,
            namaBarang: it.namaBarang,
            satuan: it.satuan,
            qty: it.qty,
            noBatch: it.noBatch,
            expiredDate: it.expiredDate,
            hargaUnit: it.hargaUnit,
            jumlahRp: it.qty * it.hargaUnit,
            kodeRak: it.kodeRak || 'Rak A-01',
          }))
        );
      }
    }
  }, [ocrPresetData]);

  // Add Item Row
  const handleAddItem = () => {
    const firstProduct = products[0];
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productId: firstProduct?.id || '',
      namaBarang: firstProduct?.nama || '',
      satuan: firstProduct?.satuanBeli || 'BOX',
      qty: 1,
      noBatch: '',
      expiredDate: '',
      hargaUnit: 0,
      jumlahRp: 0,
      kodeRak: 'Rak A-01',
    };
    setItems([...items, newItem]);
  };

  // Remove Item Row
  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // Update Item Field
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // If product changed, update default product name and unit
        if (field === 'productId') {
          const selectedProd = products.find(p => p.id === value);
          if (selectedProd) {
            updated.namaBarang = selectedProd.nama;
            updated.satuan = selectedProd.satuanBeli;
          }
        }

        // Recalculate Total Rp for this line
        if (field === 'qty' || field === 'hargaUnit') {
          const qtyVal = field === 'qty' ? Number(value) : item.qty;
          const hargaVal = field === 'hargaUnit' ? Number(value) : item.hargaUnit;
          updated.jumlahRp = (qtyVal || 0) * (hargaVal || 0);
        }

        return updated;
      })
    );
  };

  // Calculations
  const subTotal = items.reduce((acc, curr) => acc + (curr.jumlahRp || 0), 0);
  const hargaJual = Math.max(0, subTotal - discount);
  // PMK 131/2024 DPP = 11/12 x Harga Jual
  const dpp = Math.round((11 / 12) * hargaJual);
  // PPN 11% x DPP
  const ppn = Math.round(0.11 * dpp);
  const totalBayar = hargaJual + ppn;

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noInvoice.trim()) {
      alert('Mohon isi Nomor Invoice Faktur!');
      return;
    }

    const selectedSup = suppliers.find(s => s.id === supplierId);

    const newInvoice: InvoiceHeader = {
      id: `inv-${Date.now()}`,
      noInvoice,
      tglInvoice,
      tglJatuhTempo,
      supplierId,
      namaSupplier: selectedSup?.nama || 'Unknown Supplier',
      noSp,
      items,
      subTotal,
      discount,
      hargaJual,
      dpp,
      ppn,
      totalBayar,
      createdAt: new Date().toISOString(),
    };

    // Generate stock batch entries
    const newBatches: StockBatch[] = items.map(item => ({
      id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: item.productId,
      namaBarang: item.namaBarang,
      kategori: products.find(p => p.id === item.productId)?.kategori || 'Bebas',
      noBatch: item.noBatch || 'BATCH-UNK',
      expiredDate: item.expiredDate.length === 7 ? `${item.expiredDate}-28` : item.expiredDate || '2028-12-31',
      qtySisa: item.qty,
      satuan: item.satuan,
      hargaBeli: item.hargaUnit,
      namaSupplier: selectedSup?.nama || 'Unknown PBF',
      noInvoice,
      kodeRak: item.kodeRak || 'Rak A-01',
      tglMasuk: tglInvoice,
    }));

    onSaveInvoice(newInvoice, newBatches);
    setSaveSuccess(true);

    // Reset Form after 2s
    setTimeout(() => {
      setSaveSuccess(false);
      setNoInvoice('');
      setNoSp('');
      setDiscount(0);
      setItems([
        {
          id: `item-${Date.now()}`,
          productId: products[0]?.id || '',
          namaBarang: products[0]?.nama || '',
          satuan: products[0]?.satuanBeli || 'BOX',
          qty: 1,
          noBatch: '',
          expiredDate: '',
          hargaUnit: 0,
          jumlahRp: 0,
          kodeRak: 'Rak A-01',
        },
      ]);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Banner / Notice */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            Form Utama Gudang Obat
          </span>
          <h2 className="text-2xl font-bold mt-2">Penerimaan Barang & Input Faktur PBF</h2>
          <p className="text-slate-400 text-sm mt-1">
            Catat data fisik barang datang, nomor batch, expired date (FEFO), dan kalkulasi PPN PBF otomatis.
          </p>
        </div>

        <button
          type="button"
          onClick={openAiModal}
          className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Isi Otomatis via AI OCR Faktur</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Faktur Berhasil Disimpan!</h4>
            <p className="text-xs text-emerald-700">Stok obat per batch dan kartu stok telah ter-update di sistem gudang.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Header Invoice Data */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Information Header Faktur / Delivery Order
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Supplier / PBF */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Distributor / PBF (Pedagang Besar Farmasi) *
              </label>
              <select
                value={supplierId}
                onChange={e => setSupplierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                required
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* No Invoice */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Invoice / Faktur PBF *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: 8141003152"
                  value={noInvoice}
                  onChange={e => setNoInvoice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            {/* No Surat Pesanan (SP) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Surat Pesanan (SP Farmasi)
              </label>
              <input
                type="text"
                placeholder="Contoh: 6140558692 / 14LKX06"
                value={noSp}
                onChange={e => setNoSp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>

            {/* Tanggal Invoice */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Faktur / Terbit *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={tglInvoice}
                  onChange={e => setTglInvoice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Jatuh Tempo Bayar
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={tglJatuhTempo}
                  onChange={e => setTglJatuhTempo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Dynamic Detail Items (Grid Obat, Batch, ED) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                Detail Item Obat & Pencatatan Batch (FEFO)
              </h3>
              <p className="text-xs text-slate-500">
                Pastikan No. Batch dan Expired Date sesuai dengan fisik barang yang diterima di gudang.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-2 rounded-xl flex items-center space-x-1 shadow transition cursor-pointer"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Tambah Baris Barang</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Nama Obat / Produk</th>
                  <th className="p-3 w-24">Satuan</th>
                  <th className="p-3 w-20">Qty</th>
                  <th className="p-3 w-28">No. Batch *</th>
                  <th className="p-3 w-32">Exp Date (ED) *</th>
                  <th className="p-3 w-32">Harga Satuan (Rp)</th>
                  <th className="p-3 w-36">Subtotal (Rp)</th>
                  <th className="p-3 w-28">Lokasi Rak</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, index) => {
                  // Warning if expired date is short (< 6 months)
                  const isEdShort = item.expiredDate && new Date(item.expiredDate) < new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      
                      {/* Product Name */}
                      <td className="p-2">
                        <select
                          value={item.productId}
                          onChange={e => handleItemChange(item.id, 'productId', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.nama} ({p.kategori})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Satuan */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.satuan}
                          onChange={e => handleItemChange(item.id, 'satuan', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-center uppercase font-mono"
                          placeholder="BOX"
                        />
                      </td>

                      {/* Qty */}
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e => handleItemChange(item.id, 'qty', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-center"
                        />
                      </td>

                      {/* No Batch */}
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="26F0064"
                          value={item.noBatch}
                          onChange={e => handleItemChange(item.id, 'noBatch', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-emerald-800 uppercase"
                          required
                        />
                      </td>

                      {/* Expired Date */}
                      <td className="p-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="YYYY-MM (2028-06)"
                            value={item.expiredDate}
                            onChange={e => handleItemChange(item.id, 'expiredDate', e.target.value)}
                            className={`w-full border rounded-lg p-2 text-xs font-mono font-semibold ${
                              isEdShort ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-300 bg-slate-50'
                            }`}
                            required
                          />
                          {isEdShort && (
                            <span title="Kedaluwarsa < 6 bulan!">
                              <AlertTriangle className="absolute right-2 top-2.5 h-3.5 w-3.5 text-amber-600" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Harga Unit */}
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.hargaUnit}
                          onChange={e => handleItemChange(item.id, 'hargaUnit', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-right"
                        />
                      </td>

                      {/* Total Rp */}
                      <td className="p-2 font-mono font-bold text-slate-800 text-right">
                        Rp {item.jumlahRp.toLocaleString('id-ID')}
                      </td>

                      {/* Kode Rak */}
                      <td className="p-2">
                        <select
                          value={item.kodeRak || 'Rak A-01'}
                          onChange={e => handleItemChange(item.id, 'kodeRak', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs"
                        >
                          <option value="Rak A-01">Rak A-01</option>
                          <option value="Rak A-02">Rak A-02</option>
                          <option value="Rak B-01">Rak B-01</option>
                          <option value="Rak B-03">Rak B-03</option>
                          <option value="Kulkas Cold Chain">Kulkas Cold Chain (2-8°C)</option>
                        </select>
                      </td>

                      {/* Action Delete */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                          className="text-slate-400 hover:text-red-600 p-1 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Tax & Calculations Summary (Perhitungan Pajak PBF PMK 131/2024) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-emerald-600" /> Catatan Pajak PBF & CDOB
            </h4>
            <p>
              • <b>Nomor DPP PMK 131/2024</b>: DPP PPN Obat PBF ditetapkan sebesar <b>11/12 dari Harga Jual</b>.
            </p>
            <p>
              • PPN 11% dihitung dari nilai DPP tersebut (Otomatis sesuai invoice resmi PT Parit Padang Global).
            </p>
            <p className="text-emerald-700 font-semibold mt-2">
              ✓ Setiap faktur yang disimpan akan otomatis memperbarui Stok Gudang per Batch dan Kartu Stok Obat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Subtotal Barang Datang:</span>
              <span className="font-mono font-bold text-slate-800">Rp {subTotal.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Diskon Faktur (Rp):</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value) || 0)}
                className="w-36 bg-slate-50 border border-slate-300 rounded-lg p-1 text-right font-mono text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex justify-between items-center text-xs border-t pt-2">
              <span className="text-slate-700 font-semibold">Harga Jual (Setelah Disc):</span>
              <span className="font-mono font-bold text-slate-900">Rp {hargaJual.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>DPP (11/12 x Harga Jual):</span>
              <span className="font-mono">Rp {dpp.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600">
              <span className="font-semibold text-emerald-800">PPN 11% (x DPP):</span>
              <span className="font-mono font-bold text-emerald-800">Rp {ppn.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-base border-t-2 border-slate-900 pt-3">
              <span className="font-bold text-slate-900">Total Bayar Faktur:</span>
              <span className="font-mono font-extrabold text-xl text-emerald-600">
                Rp {totalBayar.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-600/30 transition cursor-pointer"
            >
              <Save className="h-5 w-5" />
              <span>Simpan Faktur & Update Stok Gudang</span>
            </button>

          </div>

        </div>

      </form>

    </div>
  );
};
