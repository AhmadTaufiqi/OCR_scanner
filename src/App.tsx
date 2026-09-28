import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InvoiceForm } from './components/InvoiceForm';
import { StockLedger } from './components/StockLedger';
import { InvoiceHistory } from './components/InvoiceHistory';
import { ProductMasterView } from './components/ProductMasterView';
import { AiScannerModal } from './components/AiScannerModal';

import {
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_STOCK,
  MOCK_OCR_FAKTUR_DATA,
} from './data/initialData';
import { Supplier, ProductMaster, StockBatch, InvoiceHeader } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('input-faktur');

  // Master & Transaction States
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [products, setProducts] = useState<ProductMaster[]>(INITIAL_PRODUCTS);
  const [stockBatches, setStockBatches] = useState<StockBatch[]>(INITIAL_STOCK);
  
  // Pre-load Initial Invoice from PBF Parit Padang
  const [invoices, setInvoices] = useState<InvoiceHeader[]>([
    {
      id: 'inv-init-1',
      noInvoice: '8141003152',
      tglInvoice: '2026-09-26',
      tglJatuhTempo: '2026-11-02',
      supplierId: 'sup-1',
      namaSupplier: 'PT. PARIT PADANG GLOBAL',
      noSp: '6140558692 / 14LKX06',
      items: [
        {
          id: 'it-1',
          productId: 'prod-1',
          namaBarang: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml /D-6',
          satuan: 'BOX',
          qty: 192,
          noBatch: '26F0064',
          expiredDate: '2028-06-30',
          hargaUnit: 26500,
          jumlahRp: 5088000,
          kodeRak: 'Rak A-02',
        },
        {
          id: 'it-2',
          productId: 'prod-1',
          namaBarang: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml /D-6',
          satuan: 'BOX',
          qty: 83,
          noBatch: '26F0068',
          expiredDate: '2028-07-31',
          hargaUnit: 26500,
          jumlahRp: 2199500,
          kodeRak: 'Rak A-02',
        },
        {
          id: 'it-3',
          productId: 'prod-2',
          namaBarang: 'CP GROW TABLET ORANGE 20\'S /D-9',
          satuan: 'BOX',
          qty: 720,
          noBatch: '26D0355',
          expiredDate: '2028-06-30',
          hargaUnit: 18500,
          jumlahRp: 13320000,
          kodeRak: 'Rak B-01',
        },
        {
          id: 'it-4',
          productId: 'prod-3',
          namaBarang: 'IMBOOST EXTRA VIT C & VIT D 4\'S /D-6',
          satuan: 'BOX',
          qty: 198,
          noBatch: '26D0173',
          expiredDate: '2028-06-30',
          hargaUnit: 85000,
          jumlahRp: 16830000,
          kodeRak: 'Rak B-03',
        },
      ],
      subTotal: 37437500,
      discount: 2645850,
      hargaJual: 34791650,
      dpp: 31892346,
      ppn: 3827082,
      totalBayar: 38618732,
      createdAt: '2026-09-26T14:35:32Z',
    },
  ]);

  // AI Modal & OCR Preset state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [ocrPresetData, setOcrPresetData] = useState<any>(null);

  // Save Invoice Handler
  const handleSaveInvoice = (newInvoice: InvoiceHeader, newBatches: StockBatch[]) => {
    setInvoices(prev => [newInvoice, ...prev]);
    setStockBatches(prev => [...newBatches, ...prev]);
  };

  // Add Product Handler
  const handleAddProduct = (newProd: ProductMaster) => {
    setProducts(prev => [...prev, newProd]);
  };

  // Add Supplier Handler
  const handleAddSupplier = (newSup: Supplier) => {
    setSuppliers(prev => [...prev, newSup]);
  };

  // Apply OCR Data to Form
  const handleApplyOcrData = (data: typeof MOCK_OCR_FAKTUR_DATA) => {
    setOcrPresetData(data);
    setActiveTab('input-faktur');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiScanner={() => setIsAiModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {activeTab === 'input-faktur' && (
          <InvoiceForm
            suppliers={suppliers}
            products={products}
            onSaveInvoice={handleSaveInvoice}
            ocrPresetData={ocrPresetData}
            openAiModal={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === 'stok-gudang' && (
          <StockLedger stockBatches={stockBatches} />
        )}

        {activeTab === 'riwayat-faktur' && (
          <InvoiceHistory invoices={invoices} />
        )}

        {activeTab === 'master-obat' && (
          <ProductMasterView
            products={products}
            suppliers={suppliers}
            onAddProduct={handleAddProduct}
            onAddSupplier={handleAddSupplier}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4 px-6 text-center">
        <p>PharmaWMS © 2026 — Sistem Informasi Pergudangan Obat & Pengendalian Expired Date (FEFO)</p>
      </footer>

      {/* AI OCR Scanner Modal */}
      <AiScannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyOcrData={handleApplyOcrData}
      />

    </div>
  );
}

export default App;
