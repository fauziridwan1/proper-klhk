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
  pemakaianEnergi: string;
  sumberEnergi: string;
  programEfisiensiEnergi: string;
  hasilEfisiensiEnergi: string;
  emisiGRK: string;
  emisiKonvensional: string;
  programPenguranganEmisi: string;
  hasilPenguranganEmisi: string;
  penggunaanAir: string;
  airLimbah: string;
  programKonservasiAir: string;
  hasilKonservasiAir: string;
  limbahB3: string;
  program3RB3: string;
  hasil3RB3: string;
  limbahNonB3: string;
  program3RNonB3: string;
  hasil3RNonB3: string;
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

export interface GeneratedDocument {
  title: string;
  content: string;
  sections: { heading: string; body: string }[];
}
