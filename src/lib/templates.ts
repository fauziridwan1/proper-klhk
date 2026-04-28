import { CompanyData, EnvironmentData, SROIData, GeneratedDocument } from "./types";
import { getPageEstimate, generateScoringSummary, calculateProperScore } from "./scoring";

export function generateDRKPLTemplate(
  company: CompanyData,
  env: EnvironmentData
): GeneratedDocument {
  const sections = [
    {
      heading: "I. PENDAHULUAN",
      body: `
<h2>I. PENDAHULUAN</h2>
<h3>1.1 Profil Perusahaan</h3>
<p><strong>${company.namaPerusahaan}</strong> merupakan perusahaan yang bergerak di bidang ${company.bidangUsaha}.
Perusahaan beralamat di ${company.alamat} dengan luas lahan ${company.luasLahan}.
Kapasitas produksi perusahaan sebesar ${company.kapasitasProduksi} dengan jumlah karyawan ${company.jumlahKaryawan} orang.</p>

<h3>1.2 Penanggung Jawab</h3>
<p>Penanggung jawab usaha dan/atau kegiatan:</p>
<ul>
  <li>Nama: ${company.namaPenanggungJawab}</li>
  <li>Jabatan: ${company.jabatan}</li>
  <li>Nomor Izin Lingkungan: ${company.nomorIzin}</li>
</ul>

<h3>1.3 Lokasi dan Wilayah Kerja</h3>
<p>Wilayah kerja perusahaan terletak di ${company.lokasi}, dengan kegiatan utama
produksi ${company.bidangUsaha} yang telah memenuhi ketentuan peraturan perundang-undangan
di bidang pengelolaan lingkungan hidup.</p>
`,
    },
    {
      heading: "II. SISTEM MANAJEMEN LINGKUNGAN",
      body: `
<h2>II. SISTEM MANAJEMEN LINGKUNGAN (SML)</h2>
<h3>2.1 Kebijakan Lingkungan</h3>
<p>${company.namaPerusahaan} telah menetapkan kebijakan lingkungan yang menjadi komitmen
manajemen dalam melaksanakan pengelolaan lingkungan hidup secara berkelanjutan.
Kebijakan tersebut mencakup komitmen untuk memenuhi peraturan perundang-undangan,
mencegah pencemaran, dan secara terus-menerus meningkatkan kinerja lingkungan.</p>

<h3>2.2 Struktur Organisasi dan Tanggung Jawab</h3>
<p>Perusahaan telah membentuk struktur organisasi yang jelas dalam pengelolaan lingkungan,
meliputi penunjukan penanggung jawab, pembentukan tim lingkungan, dan pembagian
tugas serta wewenang dalam pelaksanaan program lingkungan.</p>

<h3>2.3 Program Peningkatan Berkelanjutan</h3>
<p>Program peningkatan kinerja lingkungan secara berkelanjutan meliputi:</p>
<ul>
  <li>Penetapan target dan program kerja lingkungan tahunan</li>
  <li>Monitoring dan evaluasi berkala terhadap target yang ditetapkan</li>
  <li>Tindak lanjut temuan dan rekomendasi perbaikan</li>
  <li>Review manajemen secara periodik</li>
</ul>

<h3>2.4 Sertifikasi Sistem Manajemen Lingkungan</h3>
<p>Perusahaan telah menerapkan sistem manajemen lingkungan sesuai dengan standar
yang berlaku sebagai bentuk komitmen dalam pengelolaan lingkungan yang baik.</p>
`,
    },
    {
      heading: "III. PEMANFAATAN SUMBER DAYA",
      body: `
<h2>III. PEMANFAATAN SUMBER DAYA</h2>
<h3>3.1 Efisiensi Energi</h3>
<p>Total pemakaian energi perusahaan pada tahun ${company.tahunPenilaian} sebesar ${env.pemakaianEnergi}.
Sumber energi utama yang digunakan adalah ${env.sumberEnergi}.</p>
<p>Program efisiensi energi: ${env.programEfisiensiEnergi || "-"}</p>
<p>Hasil efisiensi: ${env.hasilEfisiensiEnergi || "-"}</p>

<h3>3.2 Penurunan Emisi</h3>
<p>Beban emisi Gas Rumah Kaca (GRK): ${env.emisiGRK}. Emisi konvensional: ${env.emisiKonvensional}.</p>
<p>Program pengurangan emisi: ${env.programPenguranganEmisi || "-"}</p>
<p>Hasil pengurangan: ${env.hasilPenguranganEmisi || "-"}</p>

<h3>3.3 Efisiensi Air</h3>
<p>Penggunaan air: ${env.penggunaanAir}. Air limbah: ${env.airLimbah}.</p>
<p>Program konservasi air: ${env.programKonservasiAir || "-"}</p>
<p>Hasil konservasi: ${env.hasilKonservasiAir || "-"}</p>

<h3>3.4 Pengelolaan Limbah</h3>
<p>Limbah B3: ${env.limbahB3}. Program 3R: ${env.program3RB3 || "-"}</p>
<p>Limbah Non B3: ${env.limbahNonB3}. Program 3R: ${env.program3RNonB3 || "-"}</p>
`,
    },
    {
      heading: "IV. PROGRAM PEMBERDAYAAN MASYARAKAT",
      body: `
<h2>IV. PROGRAM PEMBERDAYAAN MASYARAKAT</h2>
<h3>4.1 Program Community Development</h3>
<p>${company.namaPerusahaan} melaksanakan program pemberdayaan masyarakat
sekitar wilayah operasional sebagai bagian dari tanggung jawab sosial perusahaan.</p>

<h3>4.2 Inovasi Sosial</h3>
<p>Perusahaan mengembangkan inovasi sosial yang memberikan dampak positif
bagi masyarakat sekitar dan mendukung pencapaian Sustainable Development Goals (SDGs).</p>

<h3>4.3 Social Return on Investment (SROI)</h3>
<p>Program pemberdayaan masyarakat diukur menggunakan metode SROI untuk
mengetahui nilai tambah sosial dan lingkungan yang dihasilkan dari investasi
yang dilakukan perusahaan.</p>
`,
    },
    {
      heading: "V. KESIMPULAN DAN KOMITMEN",
      body: `
<h2>V. KESIMPULAN DAN KOMITMEN</h2>
<p>${company.namaPerusahaan} berkomitmen untuk terus meningkatkan kinerja
pengelolaan lingkungan hidup melalui program-program inovatif yang melebihi
ketaatan peraturan perundang-undangan.</p>

<p>Beberapa capaian utama:</p>
<ul>
  <li>Sistem Manajemen Lingkungan yang terstruktur</li>
  <li>Efisiensi energi dan air yang signifikan</li>
  <li>Penurunan emisi GRK dan emisi konvensional</li>
  <li>Pengelolaan limbah B3 dan non B3 sesuai standar</li>
  <li>Program pemberdayaan masyarakat berkelanjutan</li>
</ul>

<p>Perusahaan akan terus berupaya mencapai peringkat PROPER yang lebih tinggi
dan berkontribusi pada Sustainable Development Goals (SDGs).</p>
`,
    },
  ];

  // Build full content
  const fullContent = sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n");
  const pageEstimate = getPageEstimate(fullContent.length);

  // Calculate scoring (default demo scores - in real app would be input by user)
  const drkplRawScore = 85;
  const smlScore = 80;
  const score = calculateProperScore(drkplRawScore, smlScore, pageEstimate);

  // Add scoring section
  sections.push({
    heading: "VI. RINGKASAN PENILAIAN PROPER",
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
program ${data.namaProgram} menghasilkan nilai sosial dan lingkungan
yang signifikan.</p>

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
