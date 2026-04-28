import { CompanyData, EnvironmentData } from "./types";

interface ExtractedData {
  company: Partial<CompanyData>;
  environment: Partial<EnvironmentData>;
}

/**
 * Extract structured data from raw text using aggressive pattern matching.
 * Designed to work with uploaded DRKPL / laporan lingkungan documents.
 */
export function extractDataFromText(text: string): ExtractedData {
  const company: Partial<CompanyData> = {};
  const environment: Partial<EnvironmentData> = {};

  // Normalize text: collapse whitespace, normalize line endings
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\t/g, " ");

  // ─── Helper functions ───

  // Extract value after a label (case-insensitive, handles various separators)
  const extractAfter = (patterns: string[], maxLen = 200): string => {
    for (const pattern of patterns) {
      // Match: label followed by optional : or whitespace, then capture value
      const regex = new RegExp(
        `${escapeRegex(pattern)}\\s*[:;=\\-]?\\s*([^\\n]{1,${maxLen}})`,
        "i"
      );
      const match = normalized.match(regex);
      if (match && match[1].trim().length > 1) return match[1].trim();
    }
    return "";
  };

  // Extract numeric value after label (returns just the number + unit)
  const extractNumeric = (patterns: string[]): string => {
    for (const pattern of patterns) {
      const regex = new RegExp(
        `${escapeRegex(pattern)}\\s*[:;=\\-]?\\s*([\\d.,]+\\s*(?:ton|m3|GJ|ha|kg|liter|kWh|MW|%|orang|hektar)?[^\\n]{0,30})`,
        "i"
      );
      const match = normalized.match(regex);
      if (match) return match[1].trim();
    }
    return "";
  };

  // Extract a paragraph between two keywords
  const extractParagraph = (startKw: string, endKw: string): string => {
    const regex = new RegExp(
      `${escapeRegex(startKw)}[\\s\\S]{0,50}?(.*?)(?=${escapeRegex(endKw)}|\\n\\s*\\n\\s*(?=[A-Z][a-z])|\\Z)`,
      "i"
    );
    const match = normalized.match(regex);
    if (match) return match[1].trim().substring(0, 800);
    return "";
  };

  // Extract list items after a heading
  const extractList = (headingPattern: string, maxItems = 8): string[] => {
    const idx = normalized.search(new RegExp(escapeRegex(headingPattern), "i"));
    if (idx === -1) return [];
    const section = normalized.substring(idx, idx + 2000);
    const items: string[] = [];
    const liRegex = /(?:^|\n)\s*(?:[-•*]|\d+[.)])\s*(.+)/gm;
    let match;
    let count = 0;
    while ((match = liRegex.exec(section)) !== null && count < maxItems) {
      const item = match[1].trim();
      if (item.length > 3) items.push(item);
      count++;
    }
    return items;
  };

  // ─── Company Data ───

  company.namaPerusahaan =
    extractAfter(["Nama Perusahaan", "Perusahaan", "Company Name", "PT\\.", "PT "], 100) ||
    extractCompanyName(normalized);

  company.bidangUsaha = extractAfter([
    "Bidang Usaha", "Jenis Usaha", "Jenis Kegiatan", "Sektor", "Industri",
    "Bergerak di bidang", "Business Sector", "Kegiatan Usaha",
  ]);

  company.alamat = extractAfter([
    "Alamat Perusahaan", "Alamat Lengkap", "Alamat Kantor", "Address",
    "Beralamat di", "Alamat Pabrik", "Head Office",
  ], 300);

  company.lokasi = extractAfter([
    "Lokasi", "Kota", "Kabupaten", "Wilayah", "Location", "Site",
  ]);

  company.namaPenanggungJawab = extractAfter([
    "Penanggung Jawab", "Nama Penanggung Jawab", "Direktur Utama",
    "President Director", "Direktur", "Manager", "Pimpinan", "Kepala",
    "Nama Pimpinan", "Penanggungjawab",
  ]);

  company.jabatan = extractAfter([
    "Jabatan", "Posisi", "Title", "Sebagai",
  ]);

  company.tahunPenilaian = extractYear(normalized);

  company.nomorIzin = extractAfter([
    "Nomor Izin", "Izin Lingkungan", "No\\. Izin", "No Izin",
    "Nomor SK", "Izin Usaha", "NIB", "SIUP",
  ]);

  company.kapasitasProduksi = extractAfter([
    "Kapasitas Produksi", "Kapasitas", "Production Capacity",
    "Kapasitas Terpasang", "Kapasitas Olah",
  ]);

  company.jumlahKaryawan = extractAfter([
    "Jumlah Karyawan", "Karyawan", "Tenaga Kerja", "Pekerja",
    "Total Karyawan", "Jumlah Tenaga Kerja", "Employees",
  ]);

  company.luasLahan = extractAfter([
    "Luas Lahan", "Luas Area", "Luas Tanah", "Land Area",
    "Luas Wilayah", "Area Konsesi",
  ]);

  // ─── Environment Data ───

  environment.pemakaianEnergi = extractNumeric([
    "Pemakaian Energi", "Konsumsi Energi", "Total Energi",
    "Pemakaian Listrik", "Penggunaan Energi", "Energy Consumption",
  ]);

  environment.sumberEnergi = extractAfter([
    "Sumber Energi", "Sumber Listrik", "Bahan Bakar", "Fuel",
    "Sumber Daya Energi", "Energy Source", "Jenis Energi",
  ]);

  environment.programEfisiensiEnergi = extractParagraph(
    "program efisiensi energi", "hasil efisiensi"
  ) || extractParagraph("efisiensi energi", "penurunan emisi");

  environment.hasilEfisiensiEnergi = extractParagraph(
    "hasil efisiensi energi", "penurunan emisi"
  ) || extractAfter(["Hasil Efisiensi Energi", "Penghematan Energi", "Energy Saving"]);

  environment.emisiGRK = extractNumeric([
    "Emisi GRK", "Emisi Gas Rumah Kaca", "Emisi CO2", "GHG Emission",
    "CO2e", "Beban Emisi GRK", "Total Emisi GRK",
  ]);

  environment.emisiKonvensional = extractNumeric([
    "Emisi Konvensional", "Emisi SOx", "Emisi NOx", "Emisi Partikulat",
    "Emisi Udara", "SO2", "NO2",
  ]);

  environment.programPenguranganEmisi = extractParagraph(
    "program pengurangan emisi", "hasil pengurangan"
  ) || extractParagraph("penurunan emisi", "efisiensi air");

  environment.hasilPenguranganEmisi = extractParagraph(
    "hasil pengurangan emisi", "efisiensi air"
  ) || extractAfter(["Hasil Pengurangan Emisi", "Penurunan Emisi", "Emission Reduction"]);

  environment.penggunaanAir = extractNumeric([
    "Penggunaan Air", "Konsumsi Air", "Pemakaian Air",
    "Water Consumption", "Kebutuhan Air", "Total Air",
  ]);

  environment.airLimbah = extractNumeric([
    "Air Limbah", "Limbah Cair", "Beban Air Limbah",
    "Wastewater", "Debit Air Limbah", "BOD", "COD",
  ]);

  environment.programKonservasiAir = extractParagraph(
    "program konservasi air", "hasil konservasi"
  ) || extractParagraph("konservasi air", "limbah");

  environment.hasilKonservasiAir = extractParagraph(
    "hasil konservasi air", "limbah b3"
  ) || extractAfter(["Hasil Konservasi Air", "Penghematan Air", "Water Saving"]);

  environment.limbahB3 = extractNumeric([
    "Limbah B3", "Limbah Berbahaya", "Hazardous Waste",
    "Timbulan B3", "B3", "Limbah Bahan Berbahaya",
  ]);

  environment.program3RB3 = extractParagraph(
    "program 3r limbah b3", "hasil 3r"
  ) || extractParagraph("pengelolaan limbah b3", "limbah non");

  environment.hasil3RB3 = extractParagraph(
    "hasil 3r limbah b3", "limbah non b3"
  ) || extractAfter(["Hasil 3R B3", "Pengurangan B3"]);

  environment.limbahNonB3 = extractNumeric([
    "Limbah Non B3", "Limbah Non Berbahaya", "Limbah Padat",
    "Non Hazardous", "Timbulan Non B3", "Limbah Domestik",
  ]);

  environment.program3RNonB3 = extractParagraph(
    "program 3r limbah non b3", "hasil 3r"
  ) || extractParagraph("pengelolaan limbah non", "pengelolaan sampah");

  environment.hasil3RNonB3 = extractParagraph(
    "hasil 3r limbah non b3", "pengelolaan sampah"
  ) || extractAfter(["Hasil 3R Non B3", "Pengurangan Non B3"]);

  // New fields
  environment.jumlahSampah = extractNumeric([
    "Jumlah Sampah", "Timbulan Sampah", "Sampah",
    "Timbulan Sampah Domestik", "Solid Waste",
  ]);

  environment.programPengelolaanSampah = extractParagraph(
    "program pengelolaan sampah", "hasil pengelolaan"
  ) || extractParagraph("pengelolaan sampah", "keanekaragaman");

  environment.hasilPengelolaanSampah = extractParagraph(
    "hasil pengelolaan sampah", "keanekaragaman hayati"
  ) || extractAfter(["Hasil Pengelolaan Sampah"]);

  environment.programKehati = extractParagraph(
    "program keanekaragaman hayati", "hasil kehati"
  ) || extractParagraph("keanekaragaman hayati", "pemberdayaan");

  environment.luasKonservasi = extractNumeric([
    "Luas Konservasi", "Area Konservasi", "Luas Kehati",
    "Area Lindung", "Konservasi", "Hektar",
  ]);

  environment.hasilKehati = extractParagraph(
    "hasil perlindungan kehati", "pemberdayaan masyarakat"
  ) || extractAfter(["Hasil Kehati", "Hasil Konservasi"]);

  environment.lingkupLCA = extractParagraph(
    "lingkup lca", "metodologi lca"
  ) || extractParagraph("life cycle assessment", "metodologi") || extractAfter(["Lingkup LCA", "Ruang Lingkup LCA"]);

  environment.metodologiLCA = extractParagraph(
    "metodologi lca", "hasil lca"
  ) || extractAfter(["Metodologi LCA", "Metode LCA", "ISO 14040"]);

  environment.hasilLCA = extractParagraph(
    "hasil lca", "sistem manajemen"
  ) || extractAfter(["Hasil LCA", "Hasil Penilaian Daur Hidup"]);

  return { company, environment };
}

// ─── Helpers ───

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractCompanyName(text: string): string {
  // Look for PT patterns
  const ptMatch = text.match(/PT\.?\s+[A-Z][A-Za-z0-9\s&.,()\-]+?(?=\n|,|\.|$)/i);
  if (ptMatch) return ptMatch[0].trim();

  // Look for CV patterns
  const cvMatch = text.match(/CV\.?\s+[A-Z][A-Za-z0-9\s&.,()\-]+?(?=\n|,|\.|$)/i);
  if (cvMatch) return cvMatch[0].trim();

  // Look for company name after header
  const headerMatch = text.match(
    /(?:nama perusahaan|profil perusahaan|company profile)[\s\S]{0,100}?([A-Z][A-Za-z0-9\s&.,()\-]{3,60})/i
  );
  if (headerMatch) return headerMatch[1].trim();

  return "";
}

function extractYear(text: string): string {
  // Find 4-digit year (2000-2099)
  const matches = text.match(/\b(20[2-9]\d)\b/g);
  if (matches) {
    // Return the most recent year found
    return matches.sort().reverse()[0];
  }
  return new Date().getFullYear().toString();
}
