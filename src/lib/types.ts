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
  // Pendahuluan tambahan
  deskripsiProsesProduksi: string;
  strukturManajemen: string;
  anggaranLingkungan: string;
  keunggulanPerusahaan: string;
  sertifikasiProduk: string;
  sertifikasiGreenBuilding: string;
}

export interface EnvironmentData {
  pemakaianEnergi: string; sumberEnergi: string;
  programEfisiensiEnergi: string; hasilEfisiensiEnergi: string;
  emisiGRK: string; emisiKonvensional: string;
  programPenguranganEmisi: string; hasilPenguranganEmisi: string;
  penggunaanAir: string; airLimbah: string;
  programKonservasiAir: string; hasilKonservasiAir: string;
  limbahB3: string; program3RB3: string; hasil3RB3: string;
  limbahNonB3: string; program3RNonB3: string; hasil3RNonB3: string;
  jumlahSampah: string; programPengelolaanSampah: string; hasilPengelolaanSampah: string;
  programKehati: string; luasKonservasi: string; hasilKehati: string;
  lingkupLCA: string; metodologiLCA: string; hasilLCA: string;
}

export interface SuratPernyataan {
  namaPenandatangan: string;
  jabatanPenandatangan: string;
  tanggalTtd: string;
  tempatTtd: string;
}

export interface SROIData {
  namaProgram: string; deskripsiProgram: string; stakeholder: string;
  inputInvestasi: string; outputKuantitatif: string;
  outcomeJangkaPendek: string; outcomeJangkaPanjang: string;
  indikatorKPI: string; metodePengukuran: string;
  hasilSROI: string; dampakSosial: string; dampakLingkungan: string;
}

// --- Rich Media Types ---

export interface UploadedImage {
  id: string; name: string; dataUrl: string; caption: string; width?: number; height?: number;
}

export interface DataTable {
  title: string; headers: string[]; rows: string[][]; unit?: string;
}

/** Evidence per environmental section sesuai format KLHK */
export interface SectionEvidence {
  statusTable: DataTable | null;    // Tabel Status
  absolutTable: DataTable | null;   // Tabel Hasil/Nilai Absolut
  sertifikat: string;               // Deskripsi sertifikat/penghargaan
  inovasi: string;                  // Deskripsi inovasi
  paten: string;                    // Deskripsi paten
  fotoEvidence: UploadedImage[];    // Foto bukti (sertifikat, piagam, dll)
}

export interface RichMedia {
  logoPerusahaan: UploadedImage | null;
  fotoSite: UploadedImage[];
  fotoProgram: UploadedImage[];
  anggaranTable: DataTable | null;    // Tabel Anggaran di Pendahuluan

  // Section evidence — sesuai struktur KLHK
  energi: SectionEvidence;
  emisi: SectionEvidence;
  air: SectionEvidence;
  limbahB3: SectionEvidence;
  limbahNonB3: SectionEvidence;
  sampah: SectionEvidence;
  kehati: SectionEvidence;
  pemberdayaan: SectionEvidence;
}

export interface GeneratedDocument {
  title: string;
  content: string;
  sections: { heading: string; body: string }[];
  pageEstimate?: number;
  scoringData?: {
    drkplScore: number; smlScore: number; totalScore: number;
    pageCount: number; pagePenalty: number; category: string;
  };
  richMedia?: RichMedia;
}
