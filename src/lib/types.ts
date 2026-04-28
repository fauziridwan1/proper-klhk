export interface CompanyData {
  namaPerusahaan: string;
  alamat: string;
  bidangUsaha: string;
  namaPenanggungJawab: string;
  jabatan: string;
  tahunPenilaian: string;
  nomorIzin: string;
  kapasitasProduksi: string;
  jumlahKaryawan: string;
  luasLahan: string;
  lokasi: string;
}

export interface EnvironmentData {
  // Efisiensi Energi
  pemakaianEnergi: string;
  sumberEnergi: string;
  programEfisiensiEnergi: string;
  hasilEfisiensiEnergi: string;
  // Penurunan Emisi
  emisiGRK: string;
  emisiKonvensional: string;
  programPenguranganEmisi: string;
  hasilPenguranganEmisi: string;
  // Efisiensi Air
  penggunaanAir: string;
  airLimbah: string;
  programKonservasiAir: string;
  hasilKonservasiAir: string;
  // Limbah B3
  limbahB3: string;
  program3RB3: string;
  hasil3RB3: string;
  // Limbah Non B3
  limbahNonB3: string;
  program3RNonB3: string;
  hasil3RNonB3: string;
  // Pengelolaan Sampah
  jumlahSampah: string;
  programPengelolaanSampah: string;
  hasilPengelolaanSampah: string;
  // Keanekaragaman Hayati
  programKehati: string;
  luasKonservasi: string;
  hasilKehati: string;
  // Penilaian Daur Hidup (LCA)
  lingkupLCA: string;
  metodologiLCA: string;
  hasilLCA: string;
}

export interface SuratPernyataan {
  namaPenandatangan: string;
  jabatanPenandatangan: string;
  tanggalTtd: string;
  tempatTtd: string;
}

export interface SROIData {
  namaProgram: string;
  deskripsiProgram: string;
  stakeholder: string;
  inputInvestasi: string;
  outputKuantitatif: string;
  outcomeJangkaPendek: string;
  outcomeJangkaPanjang: string;
  indikatorKPI: string;
  metodePengukuran: string;
  hasilSROI: string;
  dampakSosial: string;
  dampakLingkungan: string;
}

// --- Rich Media Types ---

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;     // base64 for preview & inline embedding
  caption: string;
  width?: number;
  height?: number;
}

export interface DataTable {
  title: string;
  headers: string[];
  rows: string[][];
  unit?: string;
}

export interface RichMedia {
  // Images
  logoPerusahaan: UploadedImage | null;
  fotoSite: UploadedImage[];
  fotoProgram: UploadedImage[];

  // Data Tables
  energiBulanan: DataTable | null;
  emisiBulanan: DataTable | null;
  airBulanan: DataTable | null;
  limbahB3Data: DataTable | null;
  limbahNonB3Data: DataTable | null;
  sampahData: DataTable | null;
}

export interface GeneratedDocument {
  title: string;
  content: string;
  sections: { heading: string; body: string }[];
  pageEstimate?: number;
  scoringData?: {
    drkplScore: number;
    smlScore: number;
    totalScore: number;
    pageCount: number;
    pagePenalty: number;
    category: string;
  };
  // Rich media for Word export
  richMedia?: RichMedia;
}
