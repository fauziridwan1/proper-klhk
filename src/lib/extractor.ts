import { CompanyData, EnvironmentData } from "./types";

interface ExtractedData {
  company: Partial<CompanyData>;
  environment: Partial<EnvironmentData>;
}

/**
 * Extract structured data from raw text using pattern matching
 * This is a heuristic-based extractor that looks for common patterns
 */
export function extractDataFromText(text: string): ExtractedData {
  const company: Partial<CompanyData> = {};
  const environment: Partial<EnvironmentData> = {};

  // Helper to extract value after label
  const extractAfter = (patterns: string[], defaultVal = ""): string => {
    for (const pattern of patterns) {
      const regex = new RegExp(
        `${pattern}\\s*[:;=]?\\s*([^\\n]{1,200})`,
        "i"
      );
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    return defaultVal;
  };

  // Extract company info
  company.namaPerusahaan =
    extractAfter(["Nama Perusahaan", "PT\\.", "PT ", "Perusahaan"]) ||
    extractCompanyName(text);
  company.bidangUsaha = extractAfter([
    "Bidang Usaha",
    "Jenis Usaha",
    "Kegiatan",
  ]);
  company.namaPenanggungJawab = extractAfter([
    "Penanggung Jawab",
    "Direktur",
    "Manager",
  ]);
  company.jabatan = extractAfter(["Jabatan", "Posisi"]);
  company.tahunPenilaian = extractYear(text);
  company.nomorIzin = extractAfter([
    "Nomor Izin",
    "Izin Lingkungan",
    "No\\. Izin",
  ]);
  company.kapasitasProduksi = extractAfter([
    "Kapasitas Produksi",
    "Produksi",
    "Kapasitas",
  ]);
  company.jumlahKaryawan = extractAfter([
    "Jumlah Karyawan",
    "Karyawan",
    "Tenaga Kerja",
  ]);
  company.luasLahan = extractAfter(["Luas Lahan", "Luas", "Area"]);
  company.lokasi = extractAfter(["Lokasi", "Wilayah", "Alamat"]);
  company.alamat = extractAfter(["Alamat", "Address"]);

  // Extract environment data
  environment.pemakaianEnergi = extractAfter([
    "Pemakaian Energi",
    "Konsumsi Energi",
    "Energi",
  ]);
  environment.sumberEnergi = extractAfter([
    "Sumber Energi",
    "Bahan Bakar",
    "Fuel",
  ]);
  environment.emisiGRK = extractAfter([
    "Emisi GRK",
    "Emisi Gas Rumah Kaca",
    "CO2",
    "GRK",
  ]);
  environment.emisiKonvensional = extractAfter([
    "Emisi Konvensional",
    "NOx",
    "SOx",
    "Partikulat",
  ]);
  environment.penggunaanAir = extractAfter([
    "Penggunaan Air",
    "Konsumsi Air",
    "Air",
  ]);
  environment.airLimbah = extractAfter([
    "Air Limbah",
    "Limbah Cair",
    "Wastewater",
  ]);
  environment.limbahB3 = extractAfter([
    "Limbah B3",
    "Limbah Berbahaya",
    "Hazardous Waste",
  ]);
  environment.limbahNonB3 = extractAfter([
    "Limbah Non B3",
    "Limbah Non Berbahaya",
    "Non Hazardous",
  ]);

  // Extract longer text blocks for programs
  environment.programEfisiensiEnergi = extractParagraph(
    text,
    "program efisiensi energi",
    "hasil efisiensi"
  );
  environment.hasilEfisiensiEnergi = extractParagraph(
    text,
    "hasil absolut efisiensi energi",
    "penurunan emisi"
  );
  environment.programPenguranganEmisi = extractParagraph(
    text,
    "program pengurangan emisi",
    "hasil pengurangan"
  );
  environment.hasilPenguranganEmisi = extractParagraph(
    text,
    "hasil absolut pengurangan emisi",
    "pengelolaan limbah"
  );
  environment.programKonservasiAir = extractParagraph(
    text,
    "program konservasi air",
    "hasil konservasi"
  );
  environment.hasilKonservasiAir = extractParagraph(
    text,
    "hasil absolut konservasi air",
    "limbah b3"
  );
  environment.program3RB3 = extractParagraph(
    text,
    "program 3r limbah b3",
    "hasil 3r"
  );
  environment.hasil3RB3 = extractParagraph(
    text,
    "hasil absolut 3r limbah b3",
    "limbah non b3"
  );
  environment.program3RNonB3 = extractParagraph(
    text,
    "program 3r limbah non b3",
    "hasil 3r"
  );
  environment.hasil3RNonB3 = extractParagraph(
    text,
    "hasil absolut 3r limbah non b3",
    "pengelolaan sampah"
  );

  // New fields: Sampah, Kehati, LCA
  environment.jumlahSampah = extractAfter([
    "Jumlah Sampah",
    "Timbulan Sampah",
    "Sampah",
  ]);
  environment.programPengelolaanSampah = extractParagraph(
    text,
    "program pengelolaan sampah",
    "hasil pengelolaan sampah"
  );
  environment.hasilPengelolaanSampah = extractParagraph(
    text,
    "hasil pengelolaan sampah",
    "keanekaragaman hayati"
  );

  environment.programKehati = extractParagraph(
    text,
    "program keanekaragaman hayati",
    "hasil kehati"
  );
  environment.luasKonservasi = extractAfter([
    "Luas Konservasi",
    "Area Konservasi",
    "Luas Kehati",
  ]);
  environment.hasilKehati = extractParagraph(
    text,
    "hasil perlindungan kehati",
    "pemberdayaan masyarakat"
  );

  environment.lingkupLCA = extractParagraph(
    text,
    "lingkup lca",
    "metodologi lca"
  );
  environment.metodologiLCA = extractParagraph(
    text,
    "metodologi lca",
    "hasil lca"
  );
  environment.hasilLCA = extractParagraph(
    text,
    "hasil lca",
    "sistem manajemen lingkungan"
  );

  return { company, environment };
}

function extractCompanyName(text: string): string {
  // Look for PT patterns
  const ptMatch = text.match(/PT\s+[A-Za-z0-9\s&.,]+/i);
  if (ptMatch) return ptMatch[0].trim();

  // Look for company name after specific headers
  const headerMatch = text.match(
    /(?:profil perusahaan|nama perusahaan)[\s\S]{0,100}?([A-Z][A-Za-z0-9\s&.,]{3,50})/i
  );
  if (headerMatch) return headerMatch[1].trim();

  return "";
}

function extractYear(text: string): string {
  const yearMatch = text.match(/\b(20\d{2})\b/);
  return yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
}

function extractParagraph(
  text: string,
  startKeyword: string,
  endKeyword: string
): string {
  const regex = new RegExp(
    `${startKeyword}[\\s\\S]{0,30}?(.*?)(?=${endKeyword}|\\n\\n|\\Z)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim().substring(0, 500) : "";
}
