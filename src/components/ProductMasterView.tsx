import React, { useState } from 'react';
import { ProductMaster, Supplier } from '../types';
import { BookOpen, Plus, Building2, Pill, Layers, Search, CheckCircle } from 'lucide-react';

interface ProductMasterViewProps {
  products: ProductMaster[];
  suppliers: Supplier[];
  onAddProduct: (prod: ProductMaster) => void;
  onAddSupplier: (sup: Supplier) => void;
}

export const ProductMasterView: React.FC<ProductMasterViewProps> = ({
  products,
  suppliers,
  onAddProduct,
  onAddSupplier,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'suppliers'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // New product form
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newKategori, setNewKategori] = useState<any>('Bebas');
  const [newSatuanBeli, setNewSatuanBeli] = useState('BOX');
  const [newSatuanJual, setNewSatuanJual] = useState('STRIP');
  const [newKonversi, setNewKonversi] = useState(10);

  // New supplier form
  const [supNama, setSupNama] = useState('');
  const [supIjin, setSupIjin] = useState('');
  const [supAlamat, setSupAlamat] = useState('');
  const [supTelepon, setSupTelepon] = useState('');

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama) return;

    onAddProduct({
      id: `prod-${Date.now()}`,
      kode: newKode || `PRD-${Date.now().toString().slice(-4)}`,
      nama: newNama,
      kategori: newKategori,
      satuanBeli: newSatuanBeli,
      satuanJual: newSatuanJual,
      rasioKonversi: newKonversi,
      stokMinimal: 20,
    });

    setNewNama('');
    setNewKode('');
    setShowProductModal(false);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supNama) return;

    onAddSupplier({
      id: `sup-${Date.now()}`,
      nama: supNama,
      noIjinPbf: supIjin,
      alamat: supAlamat,
      telepon: supTelepon,
    });

    setSupNama('');
    setSupIjin('');
    setSupAlamat('');
    setSupTelepon('');
    setShowSupplierModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeSubTab === 'products'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border'
          }`}
        >
          <Pill className="h-4 w-4" />
          <span>Master Obat & Konversi Satuan ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('suppliers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeSubTab === 'suppliers'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Master Distributor PBF ({suppliers.length})</span>
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Katalog Master Obat Gudang Farmasi
              </h3>
              <p className="text-xs text-slate-500">
                Data master obat beserta konversi sediaan (Beli Box $\rightarrow$ Jual Strip/Tablet)
              </p>
            </div>
            
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1 shadow transition cursor-pointer"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Tambah Obat Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Kode</th>
                  <th className="p-3">Nama Obat</th>
                  <th className="p-3">Kategori CDOB</th>
                  <th className="p-3">Satuan Pembelian (Faktur)</th>
                  <th className="p-3">Satuan Pengeluaran</th>
                  <th className="p-3">Konversi Satuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-500">{prod.kode}</td>
                    <td className="p-3 font-bold text-slate-900">{prod.nama}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px] border">
                        {prod.kategori}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-800">{prod.satuanBeli}</td>
                    <td className="p-3 font-mono text-slate-700">{prod.satuanJual}</td>
                    <td className="p-3 font-mono text-slate-600">
                      1 {prod.satuanBeli} = {prod.rasioKonversi} {prod.satuanJual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPPLIERS TAB */}
      {activeSubTab === 'suppliers' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                Daftar PBF (Pedagang Besar Farmasi) Terdaftar
              </h3>
              <p className="text-xs text-slate-500">
                Supplier sah distributor farmasi yang menerbitkan faktur barang datang.
              </p>
            </div>
            
            <button
              onClick={() => setShowSupplierModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1 shadow transition cursor-pointer"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Tambah Supplier PBF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map(sup => (
              <div key={sup.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/60 transition space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{sup.nama}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                    CDOB Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">No Izin PBF: {sup.noIjinPbf || '-'}</p>
                <p className="text-xs text-slate-600">{sup.alamat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ADD PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b pb-2">Tambah Master Obat Baru</h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Obat *</label>
                <input
                  type="text"
                  placeholder="Contoh: Sanmol 500mg Strip"
                  value={newNama}
                  onChange={e => setNewNama(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kategori CDOB</label>
                <select
                  value={newKategori}
                  onChange={e => setNewKategori(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-slate-50"
                >
                  <option value="Bebas">Bebas / OTC</option>
                  <option value="Keras">Keras (K)</option>
                  <option value="Cold Chain">Cold Chain (2-8°C)</option>
                  <option value="Psikotropika">Psikotropika</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Satuan Beli (Faktur)</label>
                  <input
                    type="text"
                    value={newSatuanBeli}
                    onChange={e => setNewSatuanBeli(e.target.value)}
                    className="w-full border p-2 rounded-lg bg-slate-50 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Satuan Pengeluaran</label>
                  <input
                    type="text"
                    value={newSatuanJual}
                    onChange={e => setNewSatuanJual(e.target.value)}
                    className="w-full border p-2 rounded-lg bg-slate-50 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rasio Konversi (1 Box = X Strip)</label>
                <input
                  type="number"
                  value={newKonversi}
                  onChange={e => setNewKonversi(Number(e.target.value))}
                  className="w-full border p-2 rounded-lg bg-slate-50"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg"
                >
                  Simpan Master Obat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD SUPPLIER */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b pb-2">Tambah Supplier PBF Baru</h3>
            <form onSubmit={handleSaveSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama PT PBF *</label>
                <input
                  type="text"
                  placeholder="Contoh: PT. KALBE FARMA PBF"
                  value={supNama}
                  onChange={e => setSupNama(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">No Izin PBF / CDOB</label>
                <input
                  type="text"
                  placeholder="Contoh: PBF (81202048320990126)"
                  value={supIjin}
                  onChange={e => setSupIjin(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap</label>
                <textarea
                  placeholder="Alamat distributor..."
                  value={supAlamat}
                  onChange={e => setSupAlamat(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-slate-50 h-20"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg"
                >
                  Simpan PBF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
