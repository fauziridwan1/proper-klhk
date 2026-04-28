import { CompanyData, EnvironmentData, SuratPernyataan, SROIData, GeneratedDocument, RichMedia, DataTable, UploadedImage } from "./types";
import { getPageEstimate, generateScoringSummary, calculateProperScore } from "./scoring";

function renderImage(img: UploadedImage, maxWidth = 500): string {
  return `<figure style="text-align:center; margin:16px 0;">
  <img src="${img.dataUrl}" alt="${img.caption || img.name}" style="max-width:${maxWidth}px; width:100%; border-radius:4px;" />
  ${img.caption ? `<figcaption style="font-size:11px; color:#666; margin-top:6px;">Gambar: ${img.caption}</figcaption>` : ""}
</figure>`;
}

function renderHTMLTable(table: DataTable): string {
  const html = [`<table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:12px;">`];

  // Caption
  if (table.title) {
    html.push(`<caption style="font-weight:bold; margin-bottom:6px; text-align:left;">Tabel: ${table.title}${table.unit ? ` (${table.unit})` : ""}</caption>`);
  }

  // Header
  html.push(`<thead><tr style="background:#f0fdf4;">`);
  html.push(`<th style="border:1px solid #bbb; padding:6px 8px; text-align:center; font-weight:bold;">No</th>`);
  table.headers.forEach((h) => {
    html.push(`<th style="border:1px solid #bbb; padding:6px 8px; text-align:center; font-weight:bold;">${h}</th>`);
  });
  html.push(`</tr></thead>`);

  // Body
  html.push(`<tbody>`);
  table.rows.forEach((row, i) => {
    html.push(`<tr>`);
    html.push(`<td style="border:1px solid #ddd; padding:4px 8px; text-align:center;">${i + 1}</td>`);
    row.forEach((cell) => {
      html.push(`<td style="border:1px solid #ddd; padding:4px 8px;">${cell || "-"}</td>`);
    });
    html.push(`</tr>`);
  });
  html.push(`</tbody>`);

  html.push(`</table>`);
  return html.join("\n");
}

function renderTableViewer(table: DataTable): string {
  // Simple text-based table for content estimate
  const lines = [];
  if (table.title) lines.push(`Tabel: ${table.title}`);
  lines.push("| No | " + table.headers.join(" | ") + " |");
  lines.push("|-----|" + table.headers.map(() => "------").join("|") + "|");
  table.rows.forEach((row, i) => {
    lines.push(`| ${i + 1} | ${row.join(" | ")} |`);
  });
  return lines.join("\n");
}

export function generateDRKPLTemplate(
  company: CompanyData,
  env: EnvironmentData,
  richMedia?: RichMedia,
  surat?: SuratPernyataan
): GeneratedDocument {
  const ttd = surat || {
    namaPenandatangan: company.namaPenanggungJawab,
    jabatanPenandatangan: company.jabatan,
    tanggalTtd: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    tempatTtd: company.lokasi || "...",
  };

  const rm = richMedia;

  // Build logo HTML
  const logoHTML = rm?.logoPerusahaan
    ? `<div style="text-align:center; margin-bottom:12px;"><img src="${rm.logoPerusahaan.dataUrl}" alt="Logo ${company.namaPerusahaan}" style="max-width:120px; height:auto;" /></div>`
    : "";

  const sections = [
    // --- SURAT PERNYATAAN ---
    {
      heading: "SURAT PERNYATAAN",
      body: `
<h2 style="text-align:center; text-transform:uppercase;">SURAT PERNYATAAN</h2>
<br/>
<p>Yang bertanda tangan di bawah ini:</p>
<br/>
<table style="width:100%; border-collapse:collapse;">
  <tr><td style="width:200px; padding:4px 0;">Nama</td><td style="padding:4px 0;">: <strong>${ttd.namaPenandatangan}</strong></td></tr>
  <tr><td style="padding:4px 0;">Jabatan</td><td style="padding:4px 0;">: ${ttd.jabatanPenandatangan}</td></tr>
  <tr><td style="padding:4px 0;">Perusahaan</td><td style="padding:4px 0;">: ${company.namaPerusahaan}</td></tr>
  <tr><td style="padding:4px 0;">Alamat</td><td style="padding:4px 0;">: ${company.alamat}</td></tr>
</table>
<br/>
<p>Menyatakan dengan sebenar-benarnya bahwa:</p>
<ol style="margin-left:24px;">
  <li>Dokumen Ringkasan Kinerja Pengelolaan Lingkungan (DRKPL) ini disusun berdasarkan data dan informasi yang benar dan dapat dipertanggungjawabkan.</li>
  <li>Seluruh data dan bukti yang disampaikan dalam dokumen ini adalah akurat dan sesuai dengan kondisi aktual perusahaan.</li>
  <li>Perusahaan bersedia menerima sanksi sesuai ketentuan apabila di kemudian hari ditemukan ketidaksesuaian data.</li>
</ol>
<br/>
<p>Demikian surat pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.</p>
<br/>
<br/>
<table style="width:100%;">
  <tr>
    <td style="width:50%;"></td>
    <td style="width:50%; text-align:center;">
      <p>${ttd.tempatTtd}, ${ttd.tanggalTtd}</p>
      <p><strong>${ttd.namaPenandatangan}</strong></p>
      <p>${ttd.jabatanPenandatangan}</p>
      <br/>
      <p>___________________________</p>
      <p><em>Materai Rp10.000</em></p>
    </td>
  </tr>
</table>
`,
    },

    // --- I. PENDAHULUAN ---
    {
      heading: "I. PENDAHULUAN",
      body: `
<h2>I. PENDAHULUAN</h2>
<h3>1.1 Profil Perusahaan</h3>
${logoHTML}
<p><strong>${company.namaPerusahaan}</strong> merupakan perusahaan yang bergerak di bidang <strong>${company.bidangUsaha || "-"}</strong>.
Perusahaan beralamat di ${company.alamat || "-"} dengan luas lahan ${company.luasLahan || "-"}.
Kapasitas produksi perusahaan sebesar ${company.kapasitasProduksi || "-"} dengan jumlah karyawan ${company.jumlahKaryawan || "-"} orang.</p>

<h3>1.2 Penanggung Jawab Usaha</h3>
<p>Penanggung jawab usaha dan/atau kegiatan adalah sebagai berikut:</p>
<ul>
  <li><strong>Nama:</strong> ${company.namaPenanggungJawab || "-"}</li>
  <li><strong>Jabatan:</strong> ${company.jabatan || "-"}</li>
  <li><strong>Nomor Izin Lingkungan:</strong> ${company.nomorIzin || "-"}</li>
</ul>

<h3>1.3 Lokasi dan Wilayah Kerja</h3>
<p>Wilayah kerja perusahaan terletak di ${company.lokasi || "-"}, dengan kegiatan utama
produksi ${company.bidangUsaha || "-"} yang telah memenuhi ketentuan peraturan perundang-undangan
di bidang pengelolaan lingkungan hidup.</p>

<h3>1.4 Maksud dan Tujuan</h3>
<p>Dokumen Ringkasan Kinerja Pengelolaan Lingkungan (DRKPL) ini disusun sebagai bagian dari
partisipasi perusahaan dalam Program Penilaian Peringkat Kinerja Perusahaan (PROPER) Tahun ${company.tahunPenilaian}.
Dokumen ini bertujuan untuk menggambarkan keunggulan-keunggulan lingkungan yang telah dicapai perusahaan
sebagai dasar penilaian peringkat Hijau dan Emas.</p>
`,
    },

    // --- II. PENILAIAN DAUR HIDUP (LCA) ---
    {
      heading: "II. PENILAIAN DAUR HIDUP",
      body: `
<h2>II. PENILAIAN DAUR HIDUP (LIFE CYCLE ASSESSMENT)</h2>
<h3>2.1 Lingkup Penilaian Daur Hidup</h3>
<p>Penilaian daur hidup (Life Cycle Assessment/LCA) diterapkan pada proses produksi utama perusahaan,
mencakup tahapan pengadaan bahan baku, proses produksi, distribusi, penggunaan, dan akhir masa pakai produk.</p>
<p><strong>Lingkup LCA:</strong> ${env.lingkupLCA || "Proses produksi utama dari gate-to-gate, mencakup input bahan baku, energi, air, serta output produk, emisi, dan limbah."}</p>

<h3>2.2 Metodologi</h3>
<p>Metodologi penilaian daur hidup mengacu pada SNI ISO 14040:2016 dan SNI ISO 14044:2017 tentang
Manajemen Lingkungan — Penilaian Daur Hidup — Prinsip dan Kerangka Kerja serta Persyaratan dan Panduan.</p>
<p><strong>Metode yang digunakan:</strong> ${env.metodologiLCA || "Metode CML-IA baseline untuk penilaian dampak lingkungan."}</p>

<h3>2.3 Hasil Penilaian Daur Hidup</h3>
<p>${env.hasilLCA || "Berdasarkan hasil LCA, kontributor dampak lingkungan terbesar berasal dari tahap proses produksi (konsumsi energi) dan pengadaan bahan baku. Perusahaan telah mengidentifikasi hotspot lingkungan dan menerapkan program perbaikan berkelanjutan."}</p>
`,
    },

    // --- III. SISTEM MANAJEMEN LINGKUNGAN ---
    {
      heading: "III. SISTEM MANAJEMEN LINGKUNGAN",
      body: `
<h2>III. SISTEM MANAJEMEN LINGKUNGAN (SML)</h2>
<h3>3.1 Kebijakan Lingkungan</h3>
<p>${company.namaPerusahaan} telah menetapkan kebijakan lingkungan yang menjadi komitmen
manajemen puncak dalam melaksanakan pengelolaan lingkungan hidup secara berkelanjutan,
mencakup komitmen untuk memenuhi peraturan, mencegah pencemaran, dan perbaikan berkelanjutan.</p>

<h3>3.2 Struktur Organisasi dan Tanggung Jawab</h3>
<p>Perusahaan telah membentuk struktur organisasi pengelolaan lingkungan yang jelas, meliputi
penanggung jawab di tingkat manajemen puncak, tim lingkungan, serta pembagian tugas dan wewenang.</p>

<h3>3.3 Implementasi dan Pemantauan</h3>
<p>SML diimplementasikan melalui pelatihan personel, pengendalian operasional, pemantauan kinerja,
audit internal, dan tinjauan manajemen secara periodik.</p>
`,
    },

    // --- IV. PEMANFAATAN SUMBER DAYA ---
    {
      heading: "IV. PEMANFAATAN SUMBER DAYA",
      body: `
<h2>IV. PEMANFAATAN SUMBER DAYA</h2>

<h3>4.1 Efisiensi Energi</h3>
<p>Total pemakaian energi perusahaan pada tahun ${company.tahunPenilaian} sebesar <strong>${env.pemakaianEnergi || "-"}</strong>.
Sumber energi utama yang digunakan adalah ${env.sumberEnergi || "-"}.</p>
<p><strong>Program efisiensi energi:</strong> ${env.programEfisiensiEnergi || "Penggantian peralatan hemat energi, optimalisasi operasi."}</p>
<p><strong>Hasil efisiensi:</strong> ${env.hasilEfisiensiEnergi || "Tercapai penghematan konsumsi energi yang signifikan."}</p>
${rm?.energiBulanan ? renderHTMLTable(rm.energiBulanan) : ""}

<h3>4.2 Penurunan Emisi</h3>
<p>Beban emisi GRK: <strong>${env.emisiGRK || "-"}</strong>. Emisi konvensional: <strong>${env.emisiKonvensional || "-"}</strong>.</p>
<p><strong>Program pengurangan emisi:</strong> ${env.programPenguranganEmisi || "Penerapan teknologi rendah emisi."}</p>
<p><strong>Hasil pengurangan:</strong> ${env.hasilPenguranganEmisi || "Tercapai penurunan beban emisi."}</p>
${rm?.emisiBulanan ? renderHTMLTable(rm.emisiBulanan) : ""}

<h3>4.3 Efisiensi Air dan Penurunan Beban Air Limbah</h3>
<p>Penggunaan air: <strong>${env.penggunaanAir || "-"}</strong>. Air limbah: <strong>${env.airLimbah || "-"}</strong>.</p>
<p><strong>Program konservasi air:</strong> ${env.programKonservasiAir || "Daur ulang air proses, rainwater harvesting."}</p>
<p><strong>Hasil konservasi:</strong> ${env.hasilKonservasiAir || "Tercapai penghematan penggunaan air."}</p>
${rm?.airBulanan ? renderHTMLTable(rm.airBulanan) : ""}

<h3>4.4 Pengurangan dan Pemanfaatan Limbah B3</h3>
<p>Jumlah timbulan limbah B3: <strong>${env.limbahB3 || "-"}</strong>.</p>
<p><strong>Program 3R Limbah B3:</strong> ${env.program3RB3 || "Pengurangan di sumber dan pemanfaatan kembali."}</p>
<p><strong>Hasil 3R:</strong> ${env.hasil3RB3 || "Tercapai pengurangan timbulan limbah B3."}</p>
${rm?.limbahB3Data ? renderHTMLTable(rm.limbahB3Data) : ""}

<h3>4.5 Pengurangan dan Pemanfaatan Limbah Non B3</h3>
<p>Jumlah timbulan limbah Non B3: <strong>${env.limbahNonB3 || "-"}</strong>.</p>
<p><strong>Program 3R Limbah Non B3:</strong> ${env.program3RNonB3 || "Pemilahan, daur ulang, kemitraan."}</p>
<p><strong>Hasil 3R:</strong> ${env.hasil3RNonB3 || "Tercapai pengurangan signifikan limbah ke TPA."}</p>
${rm?.limbahNonB3Data ? renderHTMLTable(rm.limbahNonB3Data) : ""}

<h3>4.6 Pengelolaan Sampah</h3>
<p>Jumlah timbulan sampah: <strong>${env.jumlahSampah || "-"}</strong>.</p>
<p><strong>Program:</strong> ${env.programPengelolaanSampah || "Sistem pengelolaan sampah terpadu."}</p>
<p><strong>Hasil:</strong> ${env.hasilPengelolaanSampah || "Peningkatan persentase sampah terkelola."}</p>
${rm?.sampahData ? renderHTMLTable(rm.sampahData) : ""}

<h3>4.7 Perlindungan Keanekaragaman Hayati</h3>
<p><strong>Luas area konservasi:</strong> ${env.luasKonservasi || "-"}.</p>
<p><strong>Program:</strong> ${env.programKehati || "Konservasi flora dan fauna lokal."}</p>
<p><strong>Hasil:</strong> ${env.hasilKehati || "Tervariasinya spesies di area konservasi."}</p>
`,
    },

    // --- V. PROGRAM PEMBERDAYAAN MASYARAKAT ---
    {
      heading: "V. PROGRAM PEMBERDAYAAN MASYARAKAT",
      body: `
<h2>V. PROGRAM PEMBERDAYAAN MASYARAKAT</h2>
<h3>5.1 Strategi Pemberdayaan Masyarakat</h3>
<p>${company.namaPerusahaan} melaksanakan program pemberdayaan masyarakat di sekitar
wilayah operasional sebagai bagian dari tanggung jawab sosial perusahaan (CSR).</p>

<h3>5.2 Inovasi Sosial</h3>
<p>Perusahaan mengembangkan inovasi sosial yang memberikan dampak positif berkelanjutan,
antara lain pemberdayaan ekonomi melalui UMKM, peningkatan kapasitas SDM, dan kemitraan
dengan kelompok masyarakat dalam pengelolaan lingkungan.</p>
${rm?.fotoProgram && rm.fotoProgram.length > 0 ? rm.fotoProgram.map((img) => renderImage(img, 400)).join("\n") : ""}

<h3>5.3 Kontribusi terhadap SDGs</h3>
<p>Program pemberdayaan masyarakat berkontribusi pada SDG 1 (Tanpa Kemiskinan),
SDG 8 (Pekerjaan Layak), SDG 12 (Konsumsi Bertanggung Jawab), dan SDG 15 (Ekosistem Darat).</p>
`,
    },

    // --- VI. FOTO SITE ---
    ...(rm?.fotoSite && rm.fotoSite.length > 0 ? [{
      heading: "VI. DOKUMENTASI LINGKUNGAN",
      body: `<h2>VI. DOKUMENTASI LINGKUNGAN</h2>
<p>Berikut dokumentasi fasilitas dan kegiatan pengelolaan lingkungan perusahaan:</p>
${rm.fotoSite.map((img) => renderImage(img, 500)).join("\n")}
`,
    }] : []),

    // --- VII. KESIMPULAN ---
    {
      heading: rm?.fotoSite?.length ? "VII. KESIMPULAN DAN KOMITMEN" : "VI. KESIMPULAN DAN KOMITMEN",
      body: `
<h2>${rm?.fotoSite?.length ? "VII" : "VI"}. KESIMPULAN DAN KOMITMEN</h2>
<p>${company.namaPerusahaan} telah menunjukkan keunggulan lingkungan di berbagai aspek:
Penilaian Daur Hidup, SML terstruktur, Efisiensi Energi, Penurunan Emisi, Konservasi Air,
Pengelolaan Limbah B3 dan Non B3, Pengelolaan Sampah, Perlindungan Keanekaragaman Hayati,
dan Pemberdayaan Masyarakat. Perusahaan berkomitmen untuk terus meningkatkan kinerja
lingkungan menuju peringkat PROPER yang lebih tinggi.</p>
`,
    },
  ];

  // Build full content for page estimate (include table text)
  const allContent = sections.map((s) => s.body).join("\n");
  const tableText = [
    rm?.energiBulanan, rm?.emisiBulanan, rm?.airBulanan,
    rm?.limbahB3Data, rm?.limbahNonB3Data, rm?.sampahData,
  ].filter(Boolean).map((t) => renderTableViewer(t!)).join("\n\n");
  const fullContent = allContent + "\n" + tableText;
  const pageEstimate = getPageEstimate(fullContent.length);

  // Calculate scoring
  const drkplRawScore = 85;
  const smlScore = 80;
  const score = calculateProperScore(drkplRawScore, smlScore, pageEstimate);

  // Add scoring section
  const scoringHeading = `RINGKASAN PENILAIAN PROPER`;
  sections.push({
    heading: scoringHeading,
    body: generateScoringSummary(score),
  });

  return {
    title: `DRKPL ${company.tahunPenilaian} - ${company.namaPerusahaan}`,
    content: allContent + "\n\n" + generateScoringSummary(score),
    sections,
    pageEstimate,
    scoringData: {
      drkplScore: score.drkplScore,
      smlScore: score.smlScore,
      totalScore: score.totalScore,
      pageCount: score.pageCount,
      pagePenalty: score.pagePenalty,
      category: score.category || "BELOW",
    },
    richMedia: rm,
  };
}

export function generateSROITemplate(data: SROIData): GeneratedDocument {
  const sections = [
    {
      heading: "I. PENDAHULUAN",
      body: `
<h2>I. PENDAHULUAN</h2>
<h3>1.1 Latar Belakang</h3>
<p>Social Return on Investment (SROI) adalah kerangka kerja untuk mengukur dan
membahas nilai sosial, ekonomi, dan lingkungan yang diciptakan oleh suatu kegiatan
atau organisasi. Dokumen ini menyajikan analisis SROI untuk program <strong>${data.namaProgram}</strong>.</p>

<h3>1.2 Deskripsi Program</h3>
<p>${data.deskripsiProgram || "-"}</p>

<h3>1.3 Stakeholder</h3>
<p>Stakeholder utama: ${data.stakeholder || "-"}</p>
`,
    },
    {
      heading: "II. METODOLOGI SROI",
      body: `
<h2>II. METODOLOGI SROI</h2>
<p>Analisis SROI mengikuti prinsip melibatkan stakeholder, memahami perubahan,
mengukur outcome, hanya memasukkan dampak material, transparan dan dapat dipertanggungjawabkan.</p>
<p><strong>Indikator KPI:</strong> ${data.indikatorKPI || "-"}</p>
<p><strong>Metode Pengukuran:</strong> ${data.metodePengukuran || "-"}</p>
`,
    },
    {
      heading: "III. ANALISIS INVESTASI DAN OUTPUT",
      body: `
<h2>III. ANALISIS INVESTASI DAN OUTPUT</h2>
<h3>3.1 Input Investasi</h3>
<p>${data.inputInvestasi || "-"}</p>
<h3>3.2 Output Kuantitatif</h3>
<p>${data.outputKuantitatif || "-"}</p>
`,
    },
    {
      heading: "IV. OUTCOME DAN DAMPAK",
      body: `
<h2>IV. OUTCOME DAN DAMPAK</h2>
<h3>4.1 Outcome Jangka Pendek</h3>
<p>${data.outcomeJangkaPendek || "-"}</p>
<h3>4.2 Outcome Jangka Panjang</h3>
<p>${data.outcomeJangkaPanjang || "-"}</p>
<h3>4.3 Dampak Sosial</h3>
<p>${data.dampakSosial || "-"}</p>
<h3>4.4 Dampak Lingkungan</h3>
<p>${data.dampakLingkungan || "-"}</p>
`,
    },
    {
      heading: "V. PERHITUNGAN SROI",
      body: `
<h2>V. PERHITUNGAN SROI</h2>
<h3>5.1 Perhitungan Dampak Finansial</h3>
<p>Nilai ekonomi dari outcome sosial dan lingkungan dihitung menggunakan financial proxy.</p>
<h3>5.2 Hasil SROI</h3>
<p><strong>${data.hasilSROI || "[Hasil perhitungan SROI]"}</strong></p>
<p>Hasil SROI menunjukkan bahwa setiap rupiah yang diinvestasikan menghasilkan nilai
sosial dan lingkungan yang signifikan.</p>
`,
    },
  ];

  const fullContent = sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n");
  const pageEstimate = Math.ceil(fullContent.length / 1500);

  return {
    title: `SROI - ${data.namaProgram}`,
    content: fullContent,
    sections,
    pageEstimate,
  };
}
