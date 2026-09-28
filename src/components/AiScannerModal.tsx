import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, FileSearch, ArrowRight, Info } from 'lucide-react';
import { MOCK_OCR_FAKTUR_DATA } from '../data/initialData';

interface AiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOcrData: (data: typeof MOCK_OCR_FAKTUR_DATA) => void;
}

export const AiScannerModal: React.FC<AiScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyOcrData,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<typeof MOCK_OCR_FAKTUR_DATA | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(MOCK_OCR_FAKTUR_DATA);
    }, 1500);
  };

  const handleApply = () => {
    if (scannedResult) {
      onApplyOcrData(scannedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Document Vision & OCR Scanner</h3>
              <p className="text-xs text-slate-400">Ekstrak otomatis data Faktur PBF menjadi form siap simpan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Invoice Image Preview */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-col items-center justify-center relative">
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <FileSearch className="h-4 w-4" /> Samples Invoice PBF Fisik (PT. Parit Padang)
            </div>
            
            <div className="relative w-full h-80 bg-slate-200 rounded-lg overflow-hidden border shadow-inner flex items-center justify-center">
              {/* Image preview of uploaded invoice */}
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
                alt="Faktur Preview"
                className="object-cover w-full h-full opacity-80"
              />
              
              <div className="absolute inset-0 bg-slate-950/60 p-4 flex flex-col justify-between text-white">
                <div className="bg-emerald-500/90 text-slate-950 text-xs font-bold px-2 py-1 rounded w-fit">
                  PBF: PT. PARIT PADANG GLOBAL
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg text-xs space-y-1 backdrop-blur font-mono border border-slate-700">
                  <p><span className="text-slate-400">No Inv:</span> 8141003152</p>
                  <p><span className="text-slate-400">Tgl:</span> 26.09.2026</p>
                  <p><span className="text-slate-400">Items:</span> 4 Produk (Curcuma, Imboost, CP Grow)</p>
                </div>
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Sparkles className="h-10 w-10 text-emerald-400 animate-spin mb-2" />
                  <p className="font-semibold text-sm">AI sedang menganalisis foto faktur...</p>
                  <p className="text-xs text-emerald-300 mt-1">Mengekstrak No Batch, Expired Date & PPN</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>{scannedResult ? 'Scan Ulang Dokumen' : 'Mulai AI OCR Extraction'}</span>
            </button>
          </div>

          {/* Right: Extracted Result */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                Hasil Ekstraksi AI Vision
                {scannedResult && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Akurasi 99.4%
                  </span>
                )}
              </h4>

              {!scannedResult ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex items-start space-x-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Klik "Mulai AI OCR Extraction"</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Sistem akan membaca foto faktur PBF Anda dan otomatis mengisi No. Invoice, Jatuh Tempo, Tanggal ED, Nomor Batch per item, serta kalkulasi PPN 11%.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Supplier / PBF:</span>
                      <span className="font-bold text-slate-800">{scannedResult.namaSupplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">No Invoice:</span>
                      <span className="font-mono font-semibold">{scannedResult.noInvoice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">No. Surat Pesanan (SP):</span>
                      <span className="font-mono">{scannedResult.noSp}</span>
                    </div>
                  </div>

                  <div className="border rounded-xl p-3 bg-white space-y-2">
                    <p className="text-xs font-bold text-slate-700 border-b pb-1">Detail Item Obat (4 Batch Terbaca):</p>
                    {scannedResult.items.map((item, idx) => (
                      <div key={idx} className="text-xs bg-slate-50 p-2 rounded border space-y-0.5">
                        <p className="font-semibold text-slate-800">{idx + 1}. {item.namaBarang}</p>
                        <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                          <span>Qty: <b>{item.qty} {item.satuan}</b></span>
                          <span>Batch: <b className="text-emerald-700">{item.noBatch}</b></span>
                          <span>ED: <b className="text-amber-700">{item.expiredDate}</b></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="pt-4 border-t mt-4 flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleApply}
                disabled={!scannedResult}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition ${
                  scannedResult
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Gunakan Data ke Form Input</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
