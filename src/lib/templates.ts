import { CompanyData, EnvironmentData, SuratPernyataan, SROIData, GeneratedDocument } from "./types";
import { getPageEstimate, generateScoringSummary, calculateProperScore } from "./scoring";

export function generateDRKPLTemplate(
  company: CompanyData,
  env: EnvironmentData,
  surat?: SuratPernyataan
): GeneratedDocument {
  const ttd = surat || {
    namaPenandatangan: company.namaPenanggungJawab,
    jabatanPenandatangan: company.jabatan,
    tanggalTtd: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    tempatTtd: company.lokasi || "...",
  };

  const sections = [
    // --- SURAT PERNYATAAN (WAJIB - tanpa ini tidak dinilai) ---
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
  <li>Perusahaan bersedia menerima sanksi sesuai ketentuan peraturan perundang-undangan apabila di kemudian hari ditemukan ketidaksesuaian data.</li>
</ol>
<br/>
<p>Demikian surat pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya dalam rangka penilaian PROPER.</p>
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
<p><strong>Metode yang digunakan:</strong> ${env.metodologiLCA || "Metode CML-IA baseline untuk penilaian dampak lingkungan, mencakup kategori dampak global warming potential, acidification, eutrophication, dan ozone depletion."}</p>

<h3>2.3 Hasil Penilaian Daur Hidup</h3>
<p>${env.hasilLCA || "Berdasarkan hasil LCA, kontributor dampak lingkungan terbesar berasal dari tahap proses produksi (konsumsi energi) dan pengadaan bahan baku. Perusahaan telah mengidentifikasi hotspot lingkungan dan menerapkan program perbaikan berkelanjutan."}</p>

<h3>2.4 Program Perbaikan Berbasis LCA</h3>
<ul>
  <li>Substitusi bahan baku dengan alternatif yang lebih ramah lingkungan</li>
  <li>Optimalisasi proses produksi untuk mengurangi konsumsi energi dan material</li>
  <li>Pengembangan eco-design produk</li>
  <li>Peningkatan daur ulang dan recovery material pada akhir masa pakai</li>
</ul>
`,
    },

    // --- III. SISTEM MANAJEMEN LINGKUNGAN ---
    {
      heading: "III. SISTEM MANAJEMEN LINGKUNGAN",
      body: `
<h2>III. SISTEM MANAJEMEN LINGKUNGAN (SML)</h2>
<h3>3.1 Kebijakan Lingkungan</h3>
<p>${company.namaPerusahaan} telah menetapkan kebijakan lingkungan yang menjadi komitmen
manajemen puncak dalam melaksanakan pengelolaan lingkungan hidup secara berkelanjutan.
Kebijakan tersebut mencakup komitmen untuk:</p>
<ul>
  <li>Memenuhi seluruh peraturan perundang-undangan di bidang lingkungan hidup</li>
  <li>Mencegah pencemaran lingkungan melalui pendekatan pencegahan (prevention)</li>
  <li>Secara terus-menerus meningkatkan kinerja lingkungan (continuous improvement)</li>
  <li>Menerapkan prinsip produksi bersih (cleaner production)</li>
</ul>

<h3>3.2 Struktur Organisasi dan Tanggung Jawab</h3>
<p>Perusahaan telah membentuk struktur organisasi pengelolaan lingkungan yang jelas, meliputi:</p>
<ul>
  <li>Penanggung jawab pengelolaan lingkungan di tingkat manajemen puncak</li>
  <li>Tim lingkungan yang bertugas melaksanakan program-program lingkungan</li>
  <li>Pembagian tugas dan wewenang yang jelas dalam pelaksanaan dan pelaporan kinerja lingkungan</li>
  <li>Mekanisme komunikasi internal dan eksternal terkait pengelolaan lingkungan</li>
</ul>

<h3>3.3 Perencanaan Lingkungan</h3>
<p>Perusahaan telah menyusun perencanaan lingkungan yang meliputi identifikasi aspek dan dampak
lingkungan, penetapan tujuan dan target lingkungan, serta program kerja untuk mencapai target tersebut.</p>

<h3>3.4 Implementasi dan Operasional</h3>
<ul>
  <li>Pelatihan dan peningkatan kompetensi personel di bidang lingkungan</li>
  <li>Pengendalian operasional untuk memastikan prosedur lingkungan dipatuhi</li>
  <li>Kesiapsiagaan dan tanggap darurat lingkungan</li>
  <li>Dokumentasi dan pengendalian dokumen SML</li>
</ul>

<h3>3.5 Pemeriksaan dan Tindakan Perbaikan</h3>
<ul>
  <li>Pemantauan dan pengukuran kinerja lingkungan secara berkala</li>
  <li>Evaluasi ketaatan terhadap peraturan perundang-undangan</li>
  <li>Audit internal sistem manajemen lingkungan</li>
  <li>Ketidaksesuaian, tindakan perbaikan, dan pencegahan</li>
</ul>

<h3>3.6 Tinjauan Manajemen</h3>
<p>Manajemen puncak melaksanakan tinjauan manajemen secara periodik (minimal 1 tahun sekali)
untuk mengevaluasi kesesuaian, kecukupan, dan efektivitas SML, serta menetapkan arahan strategis
perbaikan berkelanjutan.</p>
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
<p><strong>Program efisiensi energi yang dilaksanakan:</strong></p>
<p>${env.programEfisiensiEnergi || "Penggantian peralatan hemat energi, optimalisasi operasi, dan penerapan sistem manajemen energi."}</p>
<p><strong>Hasil efisiensi energi:</strong> ${env.hasilEfisiensiEnergi || "Tercapai penghematan konsumsi energi yang signifikan."}</p>

<h3>4.2 Penurunan Emisi</h3>
<p>Beban emisi Gas Rumah Kaca (GRK) perusahaan: <strong>${env.emisiGRK || "-"}</strong>. Emisi konvensional: <strong>${env.emisiKonvensional || "-"}</strong>.</p>
<p><strong>Program pengurangan emisi yang dilaksanakan:</strong></p>
<p>${env.programPenguranganEmisi || "Penerapan teknologi rendah emisi, optimalisasi pembakaran, dan pemantauan emisi secara kontinu."}</p>
<p><strong>Hasil pengurangan emisi:</strong> ${env.hasilPenguranganEmisi || "Tercapai penurunan beban emisi yang signifikan."}</p>

<h3>4.3 Efisiensi Air dan Penurunan Beban Air Limbah</h3>
<p>Penggunaan air: <strong>${env.penggunaanAir || "-"}</strong>. Beban air limbah: <strong>${env.airLimbah || "-"}</strong>.</p>
<p><strong>Program konservasi air yang dilaksanakan:</strong></p>
<p>${env.programKonservasiAir || "Daur ulang air proses, optimalisasi pemakaian air, dan rainwater harvesting."}</p>
<p><strong>Hasil konservasi air:</strong> ${env.hasilKonservasiAir || "Tercapai penghematan penggunaan air yang signifikan."}</p>

<h3>4.4 Pengurangan dan Pemanfaatan Limbah B3</h3>
<p>Jumlah timbulan limbah B3: <strong>${env.limbahB3 || "-"}</strong>.</p>
<p><strong>Program 3R Limbah B3:</strong></p>
<p>${env.program3RB3 || "Pengurangan di sumber, pemanfaatan kembali, dan pengolahan limbah B3 sesuai ketentuan."}</p>
<p><strong>Hasil 3R Limbah B3:</strong> ${env.hasil3RB3 || "Tercapai pengurangan timbulan dan peningkatan pemanfaatan limbah B3."}</p>

<h3>4.5 Pengurangan dan Pemanfaatan Limbah Non B3</h3>
<p>Jumlah timbulan limbah Non B3: <strong>${env.limbahNonB3 || "-"}</strong>.</p>
<p><strong>Program 3R Limbah Non B3:</strong></p>
<p>${env.program3RNonB3 || "Pemilahan di sumber, bank sampah, daur ulang, dan kemitraan dengan pihak ketiga."}</p>
<p><strong>Hasil 3R Limbah Non B3:</strong> ${env.hasil3RNonB3 || "Tercapai pengurangan signifikan limbah ke TPA."}</p>

<h3>4.6 Pengelolaan Sampah</h3>
<p>Jumlah timbulan sampah: <strong>${env.jumlahSampah || "-"}</strong>.</p>
<p><strong>Program pengelolaan sampah yang dilaksanakan:</strong></p>
<p>${env.programPengelolaanSampah || "Penerapan sistem pengelolaan sampah terpadu meliputi pemilahan, bank sampah, komposting, dan daur ulang sampah organik dan anorganik."}</p>
<p><strong>Hasil pengelolaan sampah:</strong> ${env.hasilPengelolaanSampah || "Tercapai peningkatan persentase sampah terkelola dan pengurangan sampah ke TPA."}</p>

<h3>4.7 Perlindungan Keanekaragaman Hayati</h3>
<p><strong>Luas area konservasi/kehati:</strong> ${env.luasKonservasi || "-"}.</p>
<p><strong>Program perlindungan keanekaragaman hayati:</strong></p>
<p>${env.programKehati || "Penanaman pohon endemik, konservasi flora dan fauna lokal, pembibitan tanaman langka, dan pelibatan masyarakat dalam perlindungan ekosistem."}</p>
<p><strong>Hasil perlindungan kehati:</strong> ${env.hasilKehati || "Tervariasinya spesies flora dan fauna di area konservasi perusahaan serta meningkatnya tutupan vegetasi."}</p>
`,
    },

    // --- V. PROGRAM PEMBERDAYAAN MASYARAKAT ---
    {
      heading: "V. PROGRAM PEMBERDAYAAN MASYARAKAT",
      body: `
<h2>V. PROGRAM PEMBERDAYAAN MASYARAKAT</h2>
<h3>5.1 Strategi Pemberdayaan Masyarakat</h3>
<p>${company.namaPerusahaan} melaksanakan program pemberdayaan masyarakat di sekitar
wilayah operasional sebagai bagian dari tanggung jawab sosial perusahaan (Corporate Social Responsibility).
Program ini dirancang berdasarkan hasil pemetaan sosial dan kebutuhan masyarakat setempat.</p>

<h3>5.2 Inovasi Sosial</h3>
<p>Perusahaan mengembangkan inovasi sosial yang memberikan dampak positif berkelanjutan
bagi masyarakat sekitar, antara lain:</p>
<ul>
  <li>Pemberdayaan ekonomi masyarakat melalui pengembangan UMKM berbasis potensi lokal</li>
  <li>Peningkatan kapasitas SDM melalui pelatihan dan pendidikan vokasi</li>
  <li>Program kesehatan masyarakat dan sanitasi lingkungan</li>
  <li>Pelestarian budaya lokal dan kearifan tradisional</li>
  <li>Kemitraan dengan kelompok masyarakat dalam pengelolaan lingkungan</li>
</ul>

<h3>5.3 Social Return on Investment (SROI)</h3>
<p>Program pemberdayaan masyarakat diukur menggunakan metode SROI untuk
mengetahui nilai tambah sosial, ekonomi, dan lingkungan yang dihasilkan dari investasi
yang dilakukan perusahaan. Hasil analisis SROI menunjukkan bahwa setiap investasi yang
dikeluarkan memberikan dampak pengembalian (return) yang signifikan bagi stakeholder.</p>

<h3>5.4 Kontribusi terhadap SDGs</h3>
<p>Program pemberdayaan masyarakat perusahaan berkontribusi pada pencapaian
Sustainable Development Goals (SDGs), khususnya:</p>
<ul>
  <li>SDG 1: Tanpa Kemiskinan</li>
  <li>SDG 8: Pekerjaan Layak dan Pertumbuhan Ekonomi</li>
  <li>SDG 12: Konsumsi dan Produksi yang Bertanggung Jawab</li>
  <li>SDG 15: Menjaga Ekosistem Darat</li>
</ul>
`,
    },

    // --- VI. KESIMPULAN DAN KOMITMEN ---
    {
      heading: "VI. KESIMPULAN DAN KOMITMEN",
      body: `
<h2>VI. KESIMPULAN DAN KOMITMEN</h2>
<h3>6.1 Ringkasan Keunggulan Lingkungan</h3>
<p>Berdasarkan uraian di atas, ${company.namaPerusahaan} telah menunjukkan
keunggulan-keunggulan lingkungan sebagai berikut:</p>
<ul>
  <li><strong>Penilaian Daur Hidup:</strong> Telah mengidentifikasi hotspot lingkungan dan menerapkan program perbaikan berbasis LCA.</li>
  <li><strong>Sistem Manajemen Lingkungan:</strong> SML terstruktur dan diterapkan secara konsisten di seluruh area operasional.</li>
  <li><strong>Efisiensi Energi:</strong> Penerapan program efisiensi energi yang menghasilkan penghematan signifikan.</li>
  <li><strong>Penurunan Emisi:</strong> Upaya penurunan emisi GRK dan emisi konvensional melalui teknologi dan manajemen yang baik.</li>
  <li><strong>Efisiensi Air:</strong> Program konservasi air dan penurunan beban air limbah.</li>
  <li><strong>Limbah B3 dan Non B3:</strong> Pengelolaan limbah dengan prinsip 3R yang efektif.</li>
  <li><strong>Pengelolaan Sampah:</strong> Sistem pengelolaan sampah terpadu berbasis masyarakat.</li>
  <li><strong>Keanekaragaman Hayati:</strong> Program perlindungan flora, fauna, dan ekosistem.</li>
  <li><strong>Pemberdayaan Masyarakat:</strong> Program inovatif yang mendukung SDGs dan memberikan dampak positif berkelanjutan.</li>
</ul>

<h3>6.2 Komitmen ke Depan</h3>
<p>${company.namaPerusahaan} berkomitmen untuk terus meningkatkan kinerja
pengelolaan lingkungan hidup melalui:</p>
<ul>
  <li>Peningkatan program berbasis penilaian daur hidup (LCA)</li>
  <li>Penerapan SML yang lebih komprehensif</li>
  <li>Inovasi teknologi untuk efisiensi sumber daya dan pengurangan emisi</li>
  <li>Perluasan program keanekaragaman hayati</li>
  <li>Penguatan kemitraan dengan masyarakat dan pemangku kepentingan</li>
  <li>Peningkatan peringkat PROPER menuju EMAS</li>
</ul>
`,
    },
  ];

  // Build full content for page estimate
  const fullContent = sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n");
  const pageEstimate = getPageEstimate(fullContent.length);

  // Calculate scoring
  const drkplRawScore = 85;
  const smlScore = 80;
  const score = calculateProperScore(drkplRawScore, smlScore, pageEstimate);

  // Add scoring section
  sections.push({
    heading: "VII. RINGKASAN PENILAIAN PROPER",
    body: generateScoringSummary(score),
  });

  return {
    title: `DRKPL ${company.tahunPenilaian} - ${company.namaPerusahaan}`,
    content: fullContent + "\n\n" + generateScoringSummary(score),
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
<p>Stakeholder utama yang terlibat dalam program ini:</p>
<p>${data.stakeholder || "-"}</p>
`,
    },
    {
      heading: "II. METODOLOGI SROI",
      body: `
<h2>II. METODOLOGI SROI</h2>
<h3>2.1 Prinsip SROI</h3>
<p>Analisis SROI mengikuti prinsip-prinsip:</p>
<ul>
  <li>Melibatkan stakeholder</li>
  <li>Memahami perubahan (outcome)</li>
  <li>Mengukur dan memberikan nilai pada outcome</li>
  <li>Hanya memasukkan dampak yang material</li>
  <li>Tidak mengklaim lebih dari yang seharusnya</li>
  <li>Memverifikasi hasil</li>
  <li>Transparan dan dapat dipertanggungjawabkan</li>
</ul>

<h3>2.2 Indikator KPI</h3>
<p>Indikator kinerja utama yang digunakan:</p>
<p>${data.indikatorKPI || "-"}</p>

<h3>2.3 Metode Pengukuran</h3>
<p>Metode pengukuran dampak yang digunakan:</p>
<p>${data.metodePengukuran || "-"}</p>
`,
    },
    {
      heading: "III. ANALISIS INVESTASI DAN OUTPUT",
      body: `
<h2>III. ANALISIS INVESTASI DAN OUTPUT</h2>
<h3>3.1 Input Investasi</h3>
<p>Total investasi yang dikeluarkan untuk program:</p>
<p>${data.inputInvestasi || "-"}</p>

<h3>3.2 Output Kuantitatif</h3>
<p>Output langsung yang dihasilkan dari program:</p>
<p>${data.outputKuantitatif || "-"}</p>
`,
    },
    {
      heading: "IV. OUTCOME DAN DAMPAK",
      body: `
<h2>IV. OUTCOME DAN DAMPAK</h2>
<h3>4.1 Outcome Jangka Pendek</h3>
<p>Dampak yang dihasilkan dalam jangka pendek:</p>
<p>${data.outcomeJangkaPendek || "-"}</p>

<h3>4.2 Outcome Jangka Panjang</h3>
<p>Dampak yang diharapkan dalam jangka panjang:</p>
<p>${data.outcomeJangkaPanjang || "-"}</p>

<h3>4.3 Dampak Sosial</h3>
<p>Dampak sosial yang dihasilkan:</p>
<p>${data.dampakSosial || "-"}</p>

<h3>4.4 Dampak Lingkungan</h3>
<p>Dampak lingkungan yang dihasilkan:</p>
<p>${data.dampakLingkungan || "-"}</p>
`,
    },
    {
      heading: "V. PERHITUNGAN SROI",
      body: `
<h2>V. PERHITUNGAN SROI</h2>
<h3>5.1 Perhitungan Dampak Finansial</h3>
<p>Berdasarkan analisis dampak yang telah dilakukan, nilai ekonomi dari
outcome sosial dan lingkungan dihitung menggunakan financial proxy
berdasarkan data sekunder dan konsultasi dengan stakeholder.</p>

<h3>5.2 Hasil SROI</h3>
<p><strong>${data.hasilSROI || "[Hasil perhitungan SROI]"}</strong></p>

<p>Hasil SROI menunjukkan bahwa setiap rupiah yang diinvestasikan dalam
program ${data.namaProgram} menghasilkan nilai sosial dan lingkungan yang signifikan.</p>

<h3>5.3 Kesimpulan</h3>
<p>Program ${data.namaProgram} terbukti memberikan dampak positif
yang besar terhadap masyarakat dan lingkungan. Rekomendasi untuk
melanjutkan dan mengembangkan program ini di masa mendatang.</p>
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
