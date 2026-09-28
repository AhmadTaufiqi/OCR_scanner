export interface Supplier {
  id: string;
  nama: string;
  noIjinPbf: string;
  alamat: string;
  telepon: string;
}

export interface ProductMaster {
  id: string;
  kode: string;
  nama: string;
  kategori: 'Bebas' | 'Keras' | 'Cold Chain' | 'Psikotropika' | 'Narkotika';
  satuanBeli: string;
  satuanJual: string;
  rasioKonversi: number; // e.g. 1 Box = 10 Strip
  stokMinimal: number;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  namaBarang: string;
  satuan: string;
  qty: number;
  noBatch: string;
  expiredDate: string; // YYYY-MM
  hargaUnit: number;
  jumlahRp: number;
  kodeRak?: string;
}

export interface InvoiceHeader {
  id: string;
  noInvoice: string;
  tglInvoice: string;
  tglJatuhTempo: string;
  supplierId: string;
  namaSupplier: string;
  noSp: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  hargaJual: number;
  dpp: number;
  ppn: number;
  totalBayar: number;
  createdAt: string;
}

export interface StockBatch {
  id: string;
  productId: string;
  namaBarang: string;
  kategori: string;
  noBatch: string;
  expiredDate: string; // YYYY-MM-DD
  qtySisa: number;
  satuan: string;
  hargaBeli: number;
  namaSupplier: string;
  noInvoice: string;
  kodeRak: string;
  tglMasuk: string;
}
