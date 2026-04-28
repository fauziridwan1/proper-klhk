import { CompanyData, EnvironmentData, SuratPernyataan, SROIData, GeneratedDocument, RichMedia, DataTable, UploadedImage, SectionEvidence } from "./types";
import { getPageEstimate, generateScoringSummary, calculateProperScore } from "./scoring";

// ─── HTML Render Helpers ───

function renderImage(img: UploadedImage, maxW = 450): string {
  return `<figure style="text-align:center;margin:12px 0;">
  <img src="${img.dataUrl}" alt="${img.caption || img.name}" style="max-width:${maxW}px;width:100%;border-radius:4px;" />
  ${img.caption ? `<figcaption style="font-size:10px;color:#666;margin-top:4px;">${img.caption}</figcaption>` : ""}
</figure>`;
}

function renderHTMLTable(table: DataTable | null, fallbackNote?: string): string {
  if (!table || table.rows.length === 0) {
    if (fallbackNote) return `<p style="color:#999;font-style:italic;">${fallbackNote}</p>`;
    return "";
  }
  const html = [`<table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:11px;">`];
  if (table.title) {
    html.push(`<caption style="font-weight:bold;margin-bottom:4px;text-align:left;">${table.title}${table.unit ? ` (${table.unit})` : ""}</caption>`);
  }
  html.push(`<thead><tr style="background:#e8f5e9;">`);
  html.push(`<th style="border:1px solid #bbb;padding:4px 6px;text-align:center;">No</th>`);
  table.headers.forEach(h => html.push(`<th style="border:1px solid #bbb;padding:4px 6px;text-align:center;">${h}</th>`));
  html.push(`</tr></thead><tbody>`);
  table.rows.forEach((row, i) => {
    html.push(`<tr><td style="border:1px solid #ddd;padding:3px 6px;text-align:center;">${i + 1}</td>`);
    row.forEach(cell => html.push(`<td style="border:1px solid #ddd;padding:3px 6px;">${cell || "-"}</td>`));
    html.push(`</tr>`);
  });
  html.push(`</tbody></table>`);
  return html.join("\n");
}

function renderEvidenceSection(
  num: string,
  title: string,
  ev: SectionEvidence,
  desc1?: string,
  desc2?: string
): string {
  const parts: string[] = [];
  parts.push(`<h2>${num}. ${title.toUpperCase()}</h2>`);

  // 1. Status (Tabel)
  parts.push(`<h3>${num}.1 Status</h3>`);
  if (desc1) parts.push(`<p>${desc1}</p>`);
  parts.push(renderHTMLTable(ev.statusTable, "Data status belum diisi. Silakan upload data pada step Foto & Data."));

  // 2. Hasil / Nilai Absolut (Tabel)
  parts.push(`<h3>${num}.2 Hasil Absolut</h3>`);
  if (desc2) parts.push(`<p>${desc2}</p>`);
  parts.push(renderHTMLTable(ev.absolutTable, "Data absolut belum diisi. Silakan upload data pada step Foto & Data."));

  // 3. Sertifikat / Penghargaan
  parts.push(`<h3>${num}.3 Sertifikat / Penghargaan</h3>`);
  parts.push(`<p>${ev.sertifikat || "Belum ada data sertifikat/penghargaan."}</p>`);
  if (ev.fotoEvidence.length > 0) {
    parts.push(ev.fotoEvidence.map(img => renderImage(img, 350)).join("\n"));
  }

  // 4. Inovasi
  parts.push(`<h3>${num}.4 Inovasi</h3>`);
  parts.push(`<p>${ev.inovasi || "Belum ada data inovasi."}</p>`);

  // 5. Paten
  parts.push(`<h3>${num}.5 Paten</h3>`);
  parts.push(`<p>${ev.paten || "Belum ada data paten."}</p>`);

  return parts.join("\n");
}

// ─── Main Generator ───

export function generateDRKPLTemplate(
  company: CompanyData,
  env: EnvironmentData,
  richMedia?: RichMedia,
  surat?: SuratPernyataan
): GeneratedDocument {
  const rm = richMedia || emptyRichMedia();
  const ttd = surat || {
    namaPenandatangan: company.namaPenanggungJawab,
    jabatanPenandatangan: company.jabatan,
    tanggalTtd: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    tempatTtd: company.lokasi || "...",
  };

  const logoHTML = rm.logoPerusahaan
    ? `<div style="text-align:center;margin-bottom:12px;"><img src="${rm.logoPerusahaan.dataUrl}" alt="Logo" style="max-width:100px;height:auto;" /></div>`
    : "";

  const sections: { heading: string; body: string }[] = [];

  // ─── SURAT PERNYATAAN ───
  sections.push({
    heading: "SURAT PERNYATAAN",
    body: `<h2 style="text-align:center;">SURAT PERNYATAAN</h2>
<br/>
<p>Yang bertanda tangan di bawah ini:</p>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="width:200px;padding:4px 0;">Nama</td><td style="padding:4px 0;">: <strong>${ttd.namaPenandatangan}</strong></td></tr>
<tr><td style="padding:4px 0;">Jabatan</td><td style="padding:4px 0;">: ${ttd.jabatanPenandatangan}</td></tr>
<tr><td style="padding:4px 0;">Perusahaan</td><td style="padding:4px 0;">: ${company.namaPerusahaan}</td></tr>
</table>
<br/>
<p>Menyatakan bahwa DRKPL ini disusun berdasarkan data yang benar dan dapat dipertanggungjawabkan.</p>
<br/>
<table style="width:100%;"><tr><td style="width:50%;"></td><td style="width:50%;text-align:center;">
<p>${ttd.tempatTtd}, ${ttd.tanggalTtd}</p>
<p><strong>${ttd.namaPenandatangan}</strong></p>
<p>${ttd.jabatanPenandatangan}</p>
<p>___________________</p>
<p><em>Materai Rp10.000</em></p>
</td></tr></table>`,
  });

  // ─── I. PENDAHULUAN ───
  sections.push({
    heading: "I. PENDAHULUAN",
    body: `<h2>I. PENDAHULUAN</h2>
${logoHTML}

<h3>1.1 Profil Perusahaan</h3>
<p><strong>${company.namaPerusahaan}</strong> bergerak di bidang <strong>${company.bidangUsaha || "-"}</strong>, beralamat di ${company.alamat || "-"}. Luas lahan ${company.luasLahan || "-"}, kapasitas produksi ${company.kapasitasProduksi || "-"}, dengan ${company.jumlahKaryawan || "-"} karyawan.</p>
<p><strong>Penanggung Jawab:</strong> ${company.namaPenanggungJawab || "-"} (${company.jabatan || "-"})</p>
<p><strong>Nomor Izin:</strong> ${company.nomorIzin || "-"} | <strong>Lokasi:</strong> ${company.lokasi || "-"}</p>

<h3>1.2 Deskripsi Proses Produksi</h3>
<p>${company.deskripsiProsesProduksi || "Proses produksi perusahaan meliputi pengadaan bahan baku, pengolahan, pengemasan, dan distribusi produk akhir. [Deskripsi detail dapat ditambahkan dari data yang diupload.]"}</p>

<h3>1.3 Struktur Manajemen Perusahaan</h3>
<p>${company.strukturManajemen || "Perusahaan memiliki struktur organisasi yang jelas dengan pembagian tanggung jawab pengelolaan lingkungan di setiap tingkatan. [Detail dapat ditambahkan dari data yang diupload.]"}</p>

<h3>1.4 Deskripsi Anggaran Pengelolaan Lingkungan</h3>
<p>${company.anggaranLingkungan || "Perusahaan mengalokasikan anggaran khusus untuk program pengelolaan dan pemantauan lingkungan hidup. [Detail anggaran dapat ditambahkan dari data yang diupload.]"}</p>

<h3>1.5 Keunggulan Perusahaan</h3>
<p>${company.keunggulanPerusahaan || "Perusahaan memiliki keunggulan dalam pengelolaan lingkungan yang melebihi ketaatan, mencakup efisiensi sumber daya, penurunan emisi, pengelolaan limbah, konservasi keanekaragaman hayati, dan pemberdayaan masyarakat."}</p>

<h3>1.6 Sertifikasi Produk Ramah Lingkungan</h3>
<p>${company.sertifikasiProduk || "Perusahaan terus mengupayakan sertifikasi produk ramah lingkungan sesuai standar yang berlaku. [Data sertifikasi dapat ditambahkan.]"}</p>

<h3>1.7 Sertifikasi Green Building</h3>
<p>${company.sertifikasiGreenBuilding || "Perusahaan berkomitmen terhadap pembangunan berkelanjutan melalui penerapan prinsip green building pada fasilitas operasional. [Data sertifikasi dapat ditambahkan.]"}</p>

<h3>1.8 Penilaian Daur Hidup (LCA)</h3>
<p><strong>Lingkup:</strong> ${env.lingkupLCA || "Gate-to-gate, mencakup input bahan baku, energi, air, serta output produk, emisi, dan limbah."}</p>
<p><strong>Metodologi:</strong> ${env.metodologiLCA || "Mengacu pada SNI ISO 14040:2016 dan SNI ISO 14044:2017."}</p>
<p><strong>Hasil:</strong> ${env.hasilLCA || "Berdasarkan LCA, hotspot lingkungan teridentifikasi dan program perbaikan berkelanjutan telah diterapkan."}</p>`,
  });

  // ─── II. EFISIENSI ENERGI ───
  sections.push({
    heading: "II. EFISIENSI ENERGI",
    body: renderEvidenceSection("II", "Efisiensi Energi", rm.energi,
      `Total pemakaian energi tahun ${company.tahunPenilaian}: <strong>${env.pemakaianEnergi || "-"}</strong>. Sumber: ${env.sumberEnergi || "-"}. Program: ${env.programEfisiensiEnergi || "-"}`,
      `Hasil efisiensi energi: ${env.hasilEfisiensiEnergi || "-"}`
    ),
  });

  // ─── III. PENGURANGAN EMISI ───
  sections.push({
    heading: "III. PENGURANGAN EMISI",
    body: renderEvidenceSection("III", "Pengurangan Emisi", rm.emisi,
      `Beban emisi GRK: <strong>${env.emisiGRK || "-"}</strong>. Emisi konvensional: <strong>${env.emisiKonvensional || "-"}</strong>. Program: ${env.programPenguranganEmisi || "-"}`,
      `Hasil pengurangan emisi: ${env.hasilPenguranganEmisi || "-"}`
    ),
  });

  // ─── IV. EFISIENSI AIR ───
  sections.push({
    heading: "IV. EFISIENSI AIR DAN PENURUNAN BEBAN AIR LIMBAH",
    body: renderEvidenceSection("IV", "Efisiensi Air dan Penurunan Beban Air Limbah", rm.air,
      `Penggunaan air: <strong>${env.penggunaanAir || "-"}</strong>. Beban air limbah: <strong>${env.airLimbah || "-"}</strong>. Program: ${env.programKonservasiAir || "-"}`,
      `Hasil konservasi air: ${env.hasilKonservasiAir || "-"}`
    ),
  });

  // ─── V. 3R LIMBAH B3 ───
  sections.push({
    heading: "V. 3R LIMBAH B3",
    body: renderEvidenceSection("V", "3R Limbah B3", rm.limbahB3,
      `Timbulan limbah B3: <strong>${env.limbahB3 || "-"}</strong>. Program 3R: ${env.program3RB3 || "-"}`,
      `Hasil 3R limbah B3: ${env.hasil3RB3 || "-"}`
    ),
  });

  // ─── VI. 3R LIMBAH PADAT NON B3 ───
  sections.push({
    heading: "VI. 3R LIMBAH PADAT NON B3",
    body: renderEvidenceSection("VI", "3R Limbah Padat Non B3", rm.limbahNonB3,
      `Timbulan limbah Non B3: <strong>${env.limbahNonB3 || "-"}</strong>. Program 3R: ${env.program3RNonB3 || "-"}`,
      `Hasil 3R limbah Non B3: ${env.hasil3RNonB3 || "-"}`
    ),
  });

  // ─── VII. PENGELOLAAN SAMPAH ───
  sections.push({
    heading: "VII. PENGELOLAAN SAMPAH",
    body: renderEvidenceSection("VII", "Pengelolaan Sampah", rm.sampah,
      `Timbulan sampah: <strong>${env.jumlahSampah || "-"}</strong>. Program: ${env.programPengelolaanSampah || "-"}`,
      `Hasil pengelolaan sampah: ${env.hasilPengelolaanSampah || "-"}`
    ),
  });

  // ─── VIII. KEANEKARAGAMAN HAYATI ───
  sections.push({
    heading: "VIII. PERLINDUNGAN KEANEKARAGAMAN HAYATI",
    body: renderEvidenceSection("VIII", "Perlindungan Keanekaragaman Hayati", rm.kehati,
      `Luas area konservasi: <strong>${env.luasKonservasi || "-"}</strong>. Program: ${env.programKehati || "-"}`,
      `Hasil perlindungan kehati: ${env.hasilKehati || "-"}`
    ),
  });

  // ─── IX. PEMBERDAYAAN MASYARAKAT ───
  sections.push({
    heading: "IX. PROGRAM PEMBERDAYAAN MASYARAKAT",
    body: (() => {
      const parts: string[] = [];
      parts.push(`<h2>IX. PROGRAM PEMBERDAYAAN MASYARAKAT</h2>`);
      parts.push(`<h3>9.1 Status Program</h3>`);
      parts.push(`<p>${company.namaPerusahaan} melaksanakan program pemberdayaan masyarakat sebagai bagian dari CSR dan mendukung SDGs.</p>`);
      parts.push(renderHTMLTable(rm.pemberdayaan.statusTable, "Data program belum diisi."));
      parts.push(`<h3>9.2 Hasil / Outcome</h3>`);
      parts.push(renderHTMLTable(rm.pemberdayaan.absolutTable, "Data outcome belum diisi."));
      parts.push(`<h3>9.3 Sertifikat / Penghargaan</h3>`);
      parts.push(`<p>${rm.pemberdayaan.sertifikat || "Belum ada data."}</p>`);
      if (rm.pemberdayaan.fotoEvidence.length > 0) {
        parts.push(rm.pemberdayaan.fotoEvidence.map(img => renderImage(img, 350)).join("\n"));
      }
      parts.push(`<h3>9.4 Inovasi Sosial</h3>`);
      parts.push(`<p>${rm.pemberdayaan.inovasi || "Perusahaan mengembangkan inovasi sosial untuk pemberdayaan ekonomi masyarakat, pendidikan, dan kesehatan."}</p>`);
      parts.push(`<h3>9.5 SROI</h3>`);
      parts.push(`<p>${rm.pemberdayaan.paten || "Nilai SROI menunjukkan dampak positif dari investasi sosial perusahaan. [Data SROI dapat digenerate terpisah.]"}</p>`);
      if (rm.fotoProgram.length > 0) {
        parts.push(`<h3>9.6 Dokumentasi Program</h3>`);
        parts.push(rm.fotoProgram.map(img => renderImage(img, 400)).join("\n"));
      }
      return parts.join("\n");
    })(),
  });

  // ─── X. KESIMPULAN ───
  sections.push({
    heading: "X. KESIMPULAN",
    body: `<h2>X. KESIMPULAN</h2>
<p>${company.namaPerusahaan} telah menunjukkan kinerja pengelolaan lingkungan yang baik di seluruh aspek penilaian PROPER. Perusahaan berkomitmen untuk terus meningkatkan kinerja menuju peringkat yang lebih tinggi.</p>
<ul>
<li>✅ Sistem Manajemen Lingkungan terstruktur</li>
<li>✅ Efisiensi energi dan penurunan emisi</li>
<li>✅ Pengelolaan limbah B3 dan Non B3 sesuai ketentuan</li>
<li>✅ Konservasi air dan penurunan beban air limbah</li>
<li>✅ Perlindungan keanekaragaman hayati</li>
<li>✅ Program pemberdayaan masyarakat berkelanjutan</li>
</ul>`,
  });

  // Build content for page estimate
  const fullContent = sections.map(s => s.body).join("\n");
  const pageEstimate = getPageEstimate(fullContent.length);

  // Scoring
  const score = calculateProperScore(85, 80, pageEstimate);

  sections.push({
    heading: "XI. RINGKASAN PENILAIAN PROPER",
    body: generateScoringSummary(score),
  });

  return {
    title: `DRKPL ${company.tahunPenilaian} - ${company.namaPerusahaan}`,
    content: fullContent + "\n\n" + generateScoringSummary(score),
    sections,
    pageEstimate,
    scoringData: {
      drkplScore: score.drkplScore, smlScore: score.smlScore,
      totalScore: score.totalScore, pageCount: score.pageCount,
      pagePenalty: score.pagePenalty, category: score.category || "BELOW",
    },
    richMedia: rm,
  };
}

// ─── SROI Generator ───

export function generateSROITemplate(data: SROIData): GeneratedDocument {
  const sections = [
    { heading: "I. PENDAHULUAN", body: `<h2>I. PENDAHULUAN</h2><p>Analisis SROI untuk program <strong>${data.namaProgram}</strong>.</p><p>${data.deskripsiProgram || "-"}</p><p>Stakeholder: ${data.stakeholder || "-"}</p>` },
    { heading: "II. METODOLOGI", body: `<h2>II. METODOLOGI</h2><p>KPI: ${data.indikatorKPI || "-"}</p><p>Metode: ${data.metodePengukuran || "-"}</p>` },
    { heading: "III. INVESTASI & OUTPUT", body: `<h2>III. INVESTASI & OUTPUT</h2><p>Input: ${data.inputInvestasi || "-"}</p><p>Output: ${data.outputKuantitatif || "-"}</p>` },
    { heading: "IV. OUTCOME & DAMPAK", body: `<h2>IV. OUTCOME & DAMPAK</h2><p>Jangka Pendek: ${data.outcomeJangkaPendek || "-"}</p><p>Jangka Panjang: ${data.outcomeJangkaPanjang || "-"}</p><p>Sosial: ${data.dampakSosial || "-"}</p><p>Lingkungan: ${data.dampakLingkungan || "-"}</p>` },
    { heading: "V. HASIL SROI", body: `<h2>V. HASIL SROI</h2><p><strong>${data.hasilSROI || "[Hasil perhitungan]"}</strong></p>` },
  ];
  const fc = sections.map(s => s.body).join("\n");
  return { title: `SROI - ${data.namaProgram}`, content: fc, sections, pageEstimate: Math.ceil(fc.length / 1500) };
}

// ─── Empty RichMedia ───

function emptyEvidence(): SectionEvidence {
  return { statusTable: null, absolutTable: null, sertifikat: "", inovasi: "", paten: "", fotoEvidence: [] };
}

function emptyRichMedia(): RichMedia {
  return {
    logoPerusahaan: null, fotoSite: [], fotoProgram: [],
    energi: emptyEvidence(), emisi: emptyEvidence(), air: emptyEvidence(),
    limbahB3: emptyEvidence(), limbahNonB3: emptyEvidence(),
    sampah: emptyEvidence(), kehati: emptyEvidence(), pemberdayaan: emptyEvidence(),
  };
}
