import { CompanyData, EnvironmentData, SROIData } from "./types";

export function generateDRKPLTemplate(
  company: CompanyData,
  env: EnvironmentData
) {
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
      heading: "II. EFISIENSI ENERGI",
      body: `
<h2>II. EFISIENSI ENERGI</h2>
<h3>2.1 Status Energi</h3>
<p>Total pemakaian energi perusahaan pada tahun ${company.tahunPenilaian} sebesar ${env.pemakaianEnergi}. 
Sumber energi utama yang digunakan adalah ${env.sumberEnergi}.</p>

<h3>2.2 Program Efisiensi Energi</h3>
<p>Perusahaan telah melaksanakan program efisiensi energi sebagai berikut:</p>
<p>${env.programEfisiensiEnergi || "-"}</p>

<h3>2.3 Hasil Absolut Efisiensi Energi</h3>
<p>Hasil yang dicapai dari program efisiensi energi:</p>
<p>${env.hasilEfisiensiEnergi || "-"}</p>

<h3>2.4 Inovasi</h3>
<p>Perusahaan terus melakukan inovasi dalam bidang efisiensi energi untuk 
mengurangi konsumsi energi fosil dan beralih ke sumber energi yang lebih ramah lingkungan.</p>
`,
    },
    {
      heading: "III. PENURUNAN EMISI",
      body: `
<h2>III. PENURUNAN EMISI</h2>
<h3>3.1 Status Emisi</h3>
<p>Beban emisi Gas Rumah Kaca (GRK) yang dihasilkan tahun ${company.tahunPenilaian} 
sebesar ${env.emisiGRK}. Emisi konvensional (NOx, SOx, Partikulat, VOC) 
yang dihasilkan sebesar ${env.emisiKonvensional}.</p>

<h3>3.2 Program Pengurangan Emisi</h3>
<p>Program yang dilaksanakan untuk mengurangi emisi:</p>
<p>${env.programPenguranganEmisi || "-"}</p>

<h3>3.3 Hasil Absolut Pengurangan Emisi</h3>
<p>Hasil pengurangan emisi yang telah dicapai:</p>
<p>${env.hasilPenguranganEmisi || "-"}</p>

<h3>3.4 Intensitas Emisi</h3>
<p>Perusahaan terus berupaya menurunkan intensitas emisi per satuan produksi 
untuk mencapai target Net Zero Emission sesuai komitmen nasional.</p>
`,
    },
    {
      heading: "IV. PENGELOLAAN LIMBAH B3",
      body: `
<h2>IV. PENGELOLAAN LIMBAH BAHAN BERBAHAYA DAN BERACUN (B3)</h2>
<h3>4.1 Status Limbah B3</h3>
<p>Total limbah B3 yang dihasilkan tahun ${company.tahunPenilaian} sebesar ${env.limbahB3}. 
Limbah B3 tersebut meliputi limbah dari proses produksi, fasilitas penunjang, dan kegiatan lainnya.</p>

<h3>4.2 Program 3R Limbah B3</h3>
<p>Program pengurangan, pemanfaatan, dan daur ulang (3R) limbah B3:</p>
<p>${env.program3RB3 || "-"}</p>

<h3>4.3 Hasil Absolut 3R Limbah B3</h3>
<p>Hasil yang dicapai dari program pengelolaan limbah B3:</p>
<p>${env.hasil3RB3 || "-"}</p>

<h3>4.4 Inovasi</h3>
<p>Perusahaan mengembangkan inovasi dalam pengelolaan limbah B3 untuk 
mengurangi volume limbah yang dibuang ke lingkungan.</p>
`,
    },
    {
      heading: "V. PENGELOLAAN LIMBAH NON B3",
      body: `
<h2>V. PENGELOLAAN LIMBAH NON B3</h2>
<h3>5.1 Status Limbah Non B3</h3>
<p>Total limbah non B3 yang dihasilkan tahun ${company.tahunPenilaian} sebesar ${env.limbahNonB3}.</p>

<h3>5.2 Program 3R Limbah Non B3</h3>
<p>Program pengurangan, pemanfaatan, dan daur ulang (3R) limbah non B3:</p>
<p>${env.program3RNonB3 || "-"}</p>

<h3>5.3 Hasil Absolut 3R Limbah Non B3</h3>
<p>Hasil yang dicapai dari program pengelolaan limbah non B3:</p>
<p>${env.hasil3RNonB3 || "-"}</p>

<h3>5.4 Sertifikat / Penghargaan</h3>
<p>Program pengelolaan limbah non B3 telah mendapatkan pengakuan dan 
penghargaan dari berbagai lembaga.</p>
`,
    },
    {
      heading: "VI. EFISIENSI AIR",
      body: `
<h2>VI. EFISIENSI AIR</h2>
<h3>6.1 Status Konsumsi Air</h3>
<p>Total penggunaan air tahun ${company.tahunPenilaian} sebesar ${env.penggunaanAir}. 
Penggunaan air meliputi proses produksi, fasilitas penunjang, dan kegiatan lain-lain.</p>

<h3>6.2 Status Air Limbah</h3>
<p>Total air limbah yang dihasilkan sebesar ${env.airLimbah}. 
Air limbah diolah sesuai dengan baku mutu yang ditetapkan sebelum dibuang ke badan air penerima.</p>

<h3>6.3 Program Konservasi Air</h3>
<p>Program konservasi dan efisiensi air yang dilaksanakan:</p>
<p>${env.programKonservasiAir || "-"}</p>

<h3>6.4 Hasil Absolut Konservasi Air</h3>
<p>Hasil yang dicapai dari program konservasi air:</p>
<p>${env.hasilKonservasiAir || "-"}</p>

<h3>6.5 Penurunan Beban Pencemar</h3>
<p>Perusahaan terus melakukan upaya penurunan beban pencemar air (COD, BOD, TSS, 
Minyak & Lemak, Amonia) melalui pengolahan air limbah yang optimal.</p>
`,
    },
    {
      heading: "VII. KESIMPULAN DAN KOMITMEN",
      body: `
<h2>VII. KESIMPULAN DAN KOMITMEN</h2>
<p>${company.namaPerusahaan} berkomitmen untuk terus meningkatkan kinerja 
pengelolaan lingkungan hidup melalui program-program inovatif yang melebihi 
ketaatan peraturan perundang-undangan.</p>

<p>Beberapa capaian utama:</p>
<ul>
  <li>Efisiensi energi yang signifikan</li>
  <li>Penurunan emisi GRK dan emisi konvensional</li>
  <li>Pengelolaan limbah B3 dan non B3 sesuai standar</li>
  <li>Konservasi air dan penurunan beban pencemar</li>
</ul>

<p>Perusahaan akan terus berupaya mencapai peringkat PROPER yang lebih tinggi 
dan berkontribusi pada Sustainable Development Goals (SDGs).</p>
`,
    },
  ];

  return {
    title: `DOKUMEN RINGKASAN KINERJA PENGELOLAAN LINGKUNGAN (DRKPL) ${company.tahunPenilaian}`,
    content: sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n"),
    sections,
  };
}

export function generateSROITemplate(data: SROIData) {
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

  return {
    title: `SOCIAL RETURN ON INVESTMENT (SROI) ANALYSIS - ${data.namaProgram}`,
    content: sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n"),
    sections,
  };
}
