import { Supplier, ProductMaster, StockBatch, InvoiceHeader } from '../types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    nama: 'PT. PARIT PADANG GLOBAL',
    noIjinPbf: 'PBF (81202048320990126)',
    alamat: 'Kawasan Industri Candi Jl. Gatot Subroto Blok 11 D No. 8A, Semarang',
    telepon: '024-7601234'
  },
  {
    id: 'sup-2',
    nama: 'PT. KALA HUSADA PHARMA',
    noIjinPbf: 'PBF (9120201123490100)',
    alamat: 'Jl. Raya Industri No. 45, Jakarta Timur',
    telepon: '021-8901234'
  }
];

export const INITIAL_PRODUCTS: ProductMaster[] = [
  {
    id: 'prod-1',
    kode: 'CP-ORANGE-100',
    nama: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml',
    kategori: 'Bebas',
    satuanBeli: 'BOX',
    satuanJual: 'BTL',
    rasioKonversi: 1,
    stokMinimal: 50
  },
  {
    id: 'prod-2',
    kode: 'CP-GROW-20S',
    nama: 'CP GROW TABLET ORANGE 20\'S',
    kategori: 'Bebas',
    satuanBeli: 'BOX',
    satuanJual: 'STRIP',
    rasioKonversi: 2,
    stokMinimal: 100
  },
  {
    id: 'prod-3',
    kode: 'IMB-EXTRA-4S',
    nama: 'IMBOOST EXTRA VIT C & VIT D 4\'S',
    kategori: 'Bebas',
    satuanBeli: 'BOX',
    satuanJual: 'STRIP',
    rasioKonversi: 12,
    stokMinimal: 50
  },
  {
    id: 'prod-4',
    kode: 'AMX-500-TAB',
    nama: 'AMOXICILLIN 500MG TABLET',
    kategori: 'Keras',
    satuanBeli: 'BOX',
    satuanJual: 'STRIP',
    rasioKonversi: 10,
    stokMinimal: 200
  },
  {
    id: 'prod-5',
    kode: 'VAK-HEPB-COLD',
    nama: 'VAKSIN HEPATITIS B (COLD CHAIN)',
    kategori: 'Cold Chain',
    satuanBeli: 'BOX',
    satuanJual: 'VIAL',
    rasioKonversi: 5,
    stokMinimal: 20
  }
];

export const INITIAL_STOCK: StockBatch[] = [
  {
    id: 'stk-1',
    productId: 'prod-1',
    namaBarang: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml',
    kategori: 'Bebas',
    noBatch: '26F0064',
    expiredDate: '2028-06-30',
    qtySisa: 192,
    satuan: 'BOX',
    hargaBeli: 26500,
    namaSupplier: 'PT. PARIT PADANG GLOBAL',
    noInvoice: '8141003152',
    kodeRak: 'Rak A-02',
    tglMasuk: '2026-09-26'
  },
  {
    id: 'stk-2',
    productId: 'prod-1',
    namaBarang: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml',
    kategori: 'Bebas',
    noBatch: '26F0068',
    expiredDate: '2028-07-31',
    qtySisa: 83,
    satuan: 'BOX',
    hargaBeli: 26500,
    namaSupplier: 'PT. PARIT PADANG GLOBAL',
    noInvoice: '8141003152',
    kodeRak: 'Rak A-02',
    tglMasuk: '2026-09-26'
  },
  {
    id: 'stk-3',
    productId: 'prod-2',
    namaBarang: 'CP GROW TABLET ORANGE 20\'S',
    kategori: 'Bebas',
    noBatch: '26D0355',
    expiredDate: '2028-06-30',
    qtySisa: 720,
    satuan: 'BOX',
    hargaBeli: 18500,
    namaSupplier: 'PT. PARIT PADANG GLOBAL',
    noInvoice: '8141003152',
    kodeRak: 'Rak B-01',
    tglMasuk: '2026-09-26'
  },
  {
    id: 'stk-4',
    productId: 'prod-3',
    namaBarang: 'IMBOOST EXTRA VIT C & VIT D 4\'S',
    kategori: 'Bebas',
    noBatch: '26D0173',
    expiredDate: '2028-06-30',
    qtySisa: 198,
    satuan: 'BOX',
    hargaBeli: 85000,
    namaSupplier: 'PT. PARIT PADANG GLOBAL',
    noInvoice: '8141003152',
    kodeRak: 'Rak B-03',
    tglMasuk: '2026-09-26'
  },
  {
    id: 'stk-5',
    productId: 'prod-4',
    namaBarang: 'AMOXICILLIN 500MG TABLET',
    kategori: 'Keras',
    noBatch: '24A9921',
    expiredDate: '2026-11-15', // Near expiry sample!
    qtySisa: 15,
    satuan: 'BOX',
    hargaBeli: 42000,
    namaSupplier: 'PT. KALA HUSADA PHARMA',
    noInvoice: '772100881',
    kodeRak: 'Rak C-05',
    tglMasuk: '2025-01-10'
  }
];

export const MOCK_OCR_FAKTUR_DATA = {
  namaSupplier: 'PT. PARIT PADANG GLOBAL',
  noInvoice: '8141003152',
  tglInvoice: '2026-09-26',
  tglJatuhTempo: '2026-11-02',
  noSp: '6140558692 / 14LKX06',
  discount: 2645850,
  items: [
    {
      productId: 'prod-1',
      namaBarang: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml /D-6',
      satuan: 'BOX',
      qty: 192,
      noBatch: '26F0064',
      expiredDate: '2028-06',
      hargaUnit: 26500,
      jumlahRp: 5088000,
      kodeRak: 'Rak A-02'
    },
    {
      productId: 'prod-1',
      namaBarang: 'CURCUMA PLUS FRUIT&VEGGIE ORANGE 100ml /D-6',
      satuan: 'BOX',
      qty: 83,
      noBatch: '26F0068',
      expiredDate: '2028-07',
      hargaUnit: 26500,
      jumlahRp: 2199500,
      kodeRak: 'Rak A-02'
    },
    {
      productId: 'prod-2',
      namaBarang: 'CP GROW TABLET ORANGE 20\'S /D-9',
      satuan: 'BOX',
      qty: 720,
      noBatch: '26D0355',
      expiredDate: '2028-06',
      hargaUnit: 18500,
      jumlahRp: 13320000,
      kodeRak: 'Rak B-01'
    },
    {
      productId: 'prod-3',
      namaBarang: 'IMBOOST EXTRA VIT C & VIT D 4\'S /D-6',
      satuan: 'BOX',
      qty: 198,
      noBatch: '26D0173',
      expiredDate: '2028-06',
      hargaUnit: 85000,
      jumlahRp: 16830000,
      kodeRak: 'Rak B-03'
    }
  ]
};
