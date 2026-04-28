"use client";

import { useState } from "react";
import { CompanyData, EnvironmentData, SROIData, RichMedia, UploadedImage, DataTable } from "@/lib/types";
import { ChevronRight, ChevronLeft, Building2, Leaf, Users, FileText, CheckCircle, Upload, Sprout, Image, Table2 } from "lucide-react";
import DocumentUploader from "./DocumentUploader";
import ImageUploader from "./ImageUploader";
import TableEditor from "./TableEditor";

interface WizardFormProps {
  onGenerateDRKPL: (company: CompanyData, env: EnvironmentData) => void;
  onGenerateSROI: (data: SROIData) => void;
  richMedia: RichMedia;
  onRichMediaChange: (rm: RichMedia) => void;
}

export default function WizardForm({ onGenerateDRKPL, onGenerateSROI, richMedia, onRichMediaChange }: WizardFormProps) {
  const [step, setStep] = useState(0);
  const [docType, setDocType] = useState<"drkpl" | "sroi" | null>(null);

  const [company, setCompany] = useState<CompanyData>({
    namaPerusahaan: "",
    alamat: "",
    bidangUsaha: "",
    namaPenanggungJawab: "",
    jabatan: "",
    tahunPenilaian: new Date().getFullYear().toString(),
    nomorIzin: "",
    kapasitasProduksi: "",
    jumlahKaryawan: "",
    luasLahan: "",
    lokasi: "",
  });

  const [env, setEnv] = useState<EnvironmentData>({
    pemakaianEnergi: "",
    sumberEnergi: "",
    programEfisiensiEnergi: "",
    hasilEfisiensiEnergi: "",
    emisiGRK: "",
    emisiKonvensional: "",
    programPenguranganEmisi: "",
    hasilPenguranganEmisi: "",
    penggunaanAir: "",
    airLimbah: "",
    programKonservasiAir: "",
    hasilKonservasiAir: "",
    limbahB3: "",
    program3RB3: "",
    hasil3RB3: "",
    limbahNonB3: "",
    program3RNonB3: "",
    hasil3RNonB3: "",
    jumlahSampah: "",
    programPengelolaanSampah: "",
    hasilPengelolaanSampah: "",
    programKehati: "",
    luasKonservasi: "",
    hasilKehati: "",
    lingkupLCA: "",
    metodologiLCA: "",
    hasilLCA: "",
  });

  const [sroi, setSroi] = useState<SROIData>({
    namaProgram: "",
    deskripsiProgram: "",
    stakeholder: "",
    inputInvestasi: "",
    outputKuantitatif: "",
    outcomeJangkaPendek: "",
    outcomeJangkaPanjang: "",
    indikatorKPI: "",
    metodePengukuran: "",
    hasilSROI: "",
    dampakSosial: "",
    dampakLingkungan: "",
  });

  const stepsDRKPL = [
    { title: "Profil & Logo", icon: Building2 },
    { title: "Daur Hidup & SML", icon: Sprout },
    { title: "Energi & Emisi", icon: Leaf },
    { title: "Limbah & Kehati", icon: Leaf },
    { title: "Media & Tabel", icon: Image },
    { title: "Review & Generate", icon: FileText },
  ];

  const stepsSROI = [
    { title: "Data Program", icon: Users },
    { title: "Analisis Dampak", icon: Leaf },
    { title: "Review & Generate", icon: FileText },
  ];

  const currentSteps = docType === "drkpl" ? stepsDRKPL : stepsSROI;

  const handleNext = () => setStep((s) => Math.min(s + 1, currentSteps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = () => {
    if (docType === "drkpl") {
      onGenerateDRKPL(company, env);
    } else if (docType === "sroi") {
      onGenerateSROI(sroi);
    }
  };

  const handleDataExtracted = (extractedCompany: Partial<CompanyData>, extractedEnv: Partial<EnvironmentData>) => {
    setCompany((prev) => ({ ...prev, ...extractedCompany }));
    setEnv((prev) => ({ ...prev, ...extractedEnv }));
  };

  const updateRichMedia = (partial: Partial<RichMedia>) => {
    onRichMediaChange({ ...richMedia, ...partial });
  };

  if (!docType) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-green-800">Pilih Jenis Dokumen</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setDocType("drkpl")}
            className="p-8 rounded-2xl border-2 border-green-200 hover:border-green-600 hover:shadow-lg transition-all bg-white group"
          >
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-green-800 mb-2">DRKPL</h3>
            <p className="text-gray-600">Dokumen Ringkasan Kinerja Pengelolaan Lingkungan</p>
            <p className="text-sm text-gray-500 mt-2">Sesuai Permen LH/BPH No. 07/2025</p>
          </button>
          <button
            onClick={() => setDocType("sroi")}
            className="p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all bg-white group"
          >
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-blue-800 mb-2">SROI</h3>
            <p className="text-gray-600">Social Return on Investment Analysis</p>
            <p className="text-sm text-gray-500 mt-2">Analisis dampak sosial & lingkungan</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto">
        {currentSteps.map((s, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <div className={`flex flex-col items-center ${i <= step ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                i <= step ? "bg-green-600 text-white" : "bg-gray-200"
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{s.title}</span>
            </div>
            {i < currentSteps.length - 1 && (
              <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 ${i < step ? "bg-green-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {docType === "drkpl" && (
          <>
            {/* Step 0: Profil & Logo */}
            {step === 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Profil Perusahaan & Logo</h3>
                
                <DocumentUploader onDataExtracted={handleDataExtracted} />

                {/* Logo Upload */}
                <ImageUploader
                  label="Logo Perusahaan"
                  hint="Upload logo untuk kop dokumen (format PNG/JPG)"
                  images={richMedia.logoPerusahaan ? [richMedia.logoPerusahaan] : []}
                  onChange={(imgs) => updateRichMedia({ logoPerusahaan: imgs[0] || null })}
                  single
                  max={1}
                />
                
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Isi manual data perusahaan:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Nama Perusahaan *" value={company.namaPerusahaan} onChange={(v) => setCompany({ ...company, namaPerusahaan: v })} />
                    <Input label="Bidang Usaha *" value={company.bidangUsaha} onChange={(v) => setCompany({ ...company, bidangUsaha: v })} />
                    <Input label="Nama Penanggung Jawab *" value={company.namaPenanggungJawab} onChange={(v) => setCompany({ ...company, namaPenanggungJawab: v })} />
                    <Input label="Jabatan *" value={company.jabatan} onChange={(v) => setCompany({ ...company, jabatan: v })} />
                    <Input label="Tahun Penilaian" value={company.tahunPenilaian} onChange={(v) => setCompany({ ...company, tahunPenilaian: v })} />
                    <Input label="Nomor Izin Lingkungan" value={company.nomorIzin} onChange={(v) => setCompany({ ...company, nomorIzin: v })} />
                    <Input label="Kapasitas Produksi" value={company.kapasitasProduksi} onChange={(v) => setCompany({ ...company, kapasitasProduksi: v })} />
                    <Input label="Jumlah Karyawan" value={company.jumlahKaryawan} onChange={(v) => setCompany({ ...company, jumlahKaryawan: v })} />
                    <Input label="Luas Lahan" value={company.luasLahan} onChange={(v) => setCompany({ ...company, luasLahan: v })} />
                    <Input label="Lokasi (Kota/Kab)" value={company.lokasi} onChange={(v) => setCompany({ ...company, lokasi: v })} />
                  </div>
                  <TextArea label="Alamat Lengkap" value={company.alamat} onChange={(v) => setCompany({ ...company, alamat: v })} />
                </div>
              </div>
            )}

            {/* Step 1: Daur Hidup & SML */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Penilaian Daur Hidup (LCA)</h3>
                
                <div className="border rounded-xl p-4 bg-green-50/50">
                  <h4 className="font-semibold text-green-700 mb-2">Life Cycle Assessment</h4>
                  <p className="text-xs text-gray-500 mb-4">Sesuai SNI ISO 14040:2016 dan SNI ISO 14044:2017</p>
                  <TextArea label="Lingkup LCA" value={env.lingkupLCA} onChange={(v) => setEnv({ ...env, lingkupLCA: v })} placeholder="Cakupan gate-to-gate: input bahan baku, proses produksi, output produk & emisi" />
                  <TextArea label="Metodologi LCA" value={env.metodologiLCA} onChange={(v) => setEnv({ ...env, metodologiLCA: v })} placeholder="Mis: Metode CML-IA baseline, kategori dampak: GWP, acidification, dll" />
                  <TextArea label="Hasil LCA" value={env.hasilLCA} onChange={(v) => setEnv({ ...env, hasilLCA: v })} placeholder="Ringkasan hasil penilaian daur hidup dan hotspot lingkungan" />
                </div>
              </div>
            )}

            {/* Step 2: Energi, Emisi & Air + Tables */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Efisiensi Sumber Daya & Emisi</h3>
                
                <SectionBox title="Efisiensi Energi" color="amber">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Pemakaian Energi (GJ/th)" value={env.pemakaianEnergi} onChange={(v) => setEnv({ ...env, pemakaianEnergi: v })} />
                    <Input label="Sumber Energi" value={env.sumberEnergi} onChange={(v) => setEnv({ ...env, sumberEnergi: v })} />
                  </div>
                  <TextArea label="Program Efisiensi Energi" value={env.programEfisiensiEnergi} onChange={(v) => setEnv({ ...env, programEfisiensiEnergi: v })} />
                  <TextArea label="Hasil Efisiensi Energi" value={env.hasilEfisiensiEnergi} onChange={(v) => setEnv({ ...env, hasilEfisiensiEnergi: v })} />
                  {/* Tabel Data Energi Bulanan */}
                  <div className="mt-4">
                    <TableEditor
                      label="Data Pemakaian Energi Bulanan"
                      hint="Opsional: isi data bulanan untuk ditampilkan sebagai tabel"
                      table={richMedia.energiBulanan}
                      onChange={(t) => updateRichMedia({ energiBulanan: t })}
                      defaultHeaders={["Bulan", "Pemakaian (GJ)", "Produksi (ton)"]}
                      unit="GJ/bulan"
                    />
                  </div>
                </SectionBox>

                <SectionBox title="Penurunan Emisi" color="blue">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Emisi GRK (ton CO2e)" value={env.emisiGRK} onChange={(v) => setEnv({ ...env, emisiGRK: v })} />
                    <Input label="Emisi Konvensional" value={env.emisiKonvensional} onChange={(v) => setEnv({ ...env, emisiKonvensional: v })} />
                  </div>
                  <TextArea label="Program Pengurangan Emisi" value={env.programPenguranganEmisi} onChange={(v) => setEnv({ ...env, programPenguranganEmisi: v })} />
                  <TextArea label="Hasil Pengurangan Emisi" value={env.hasilPenguranganEmisi} onChange={(v) => setEnv({ ...env, hasilPenguranganEmisi: v })} />
                  <div className="mt-4">
                    <TableEditor
                      label="Data Emisi Bulanan"
                      hint="Opsional: isi data emisi GRK bulanan"
                      table={richMedia.emisiBulanan}
                      onChange={(t) => updateRichMedia({ emisiBulanan: t })}
                      defaultHeaders={["Bulan", "Emisi GRK (ton CO2e)", "Emisi Konvensional"]}
                      unit="ton CO2e/bulan"
                    />
                  </div>
                </SectionBox>

                <SectionBox title="Efisiensi Air & Air Limbah" color="cyan">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Penggunaan Air (m3/th)" value={env.penggunaanAir} onChange={(v) => setEnv({ ...env, penggunaanAir: v })} />
                    <Input label="Air Limbah (m3/th)" value={env.airLimbah} onChange={(v) => setEnv({ ...env, airLimbah: v })} />
                  </div>
                  <TextArea label="Program Konservasi Air" value={env.programKonservasiAir} onChange={(v) => setEnv({ ...env, programKonservasiAir: v })} />
                  <TextArea label="Hasil Konservasi Air" value={env.hasilKonservasiAir} onChange={(v) => setEnv({ ...env, hasilKonservasiAir: v })} />
                  <div className="mt-4">
                    <TableEditor
                      label="Data Penggunaan Air Bulanan"
                      hint="Opsional: isi data penggunaan air bulanan"
                      table={richMedia.airBulanan}
                      onChange={(t) => updateRichMedia({ airBulanan: t })}
                      defaultHeaders={["Bulan", "Penggunaan Air (m3)", "Air Limbah (m3)"]}
                      unit="m3/bulan"
                    />
                  </div>
                </SectionBox>
              </div>
            )}

            {/* Step 3: Limbah & Kehati */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Limbah, Sampah & Keanekaragaman Hayati</h3>

                <SectionBox title="Limbah B3" color="red">
                  <Input label="Limbah B3 (ton/th)" value={env.limbahB3} onChange={(v) => setEnv({ ...env, limbahB3: v })} />
                  <TextArea label="Program 3R Limbah B3" value={env.program3RB3} onChange={(v) => setEnv({ ...env, program3RB3: v })} />
                  <TextArea label="Hasil 3R Limbah B3" value={env.hasil3RB3} onChange={(v) => setEnv({ ...env, hasil3RB3: v })} />
                  <div className="mt-4">
                    <TableEditor
                      label="Data Limbah B3 Bulanan"
                      table={richMedia.limbahB3Data}
                      onChange={(t) => updateRichMedia({ limbahB3Data: t })}
                      defaultHeaders={["Bulan", "Timbulan (ton)", "Dimanfaatkan (ton)", "Diolah (ton)"]}
                      unit="ton/bulan"
                    />
                  </div>
                </SectionBox>

                <SectionBox title="Limbah Non B3" color="orange">
                  <Input label="Limbah Non B3 (ton/th)" value={env.limbahNonB3} onChange={(v) => setEnv({ ...env, limbahNonB3: v })} />
                  <TextArea label="Program 3R Limbah Non B3" value={env.program3RNonB3} onChange={(v) => setEnv({ ...env, program3RNonB3: v })} />
                  <TextArea label="Hasil 3R Limbah Non B3" value={env.hasil3RNonB3} onChange={(v) => setEnv({ ...env, hasil3RNonB3: v })} />
                  <div className="mt-4">
                    <TableEditor
                      label="Data Limbah Non B3 Bulanan"
                      table={richMedia.limbahNonB3Data}
                      onChange={(t) => updateRichMedia({ limbahNonB3Data: t })}
                      defaultHeaders={["Bulan", "Timbulan (ton)", "Didaur Ulang (ton)", "Dimanfaatkan (ton)"]}
                      unit="ton/bulan"
                    />
                  </div>
                </SectionBox>

                <SectionBox title="Pengelolaan Sampah" color="yellow">
                  <Input label="Jumlah Sampah (ton/th)" value={env.jumlahSampah} onChange={(v) => setEnv({ ...env, jumlahSampah: v })} />
                  <TextArea label="Program Pengelolaan Sampah" value={env.programPengelolaanSampah} onChange={(v) => setEnv({ ...env, programPengelolaanSampah: v })} />
                  <TextArea label="Hasil Pengelolaan Sampah" value={env.hasilPengelolaanSampah} onChange={(v) => setEnv({ ...env, hasilPengelolaanSampah: v })} />
                  <div className="mt-4">
                    <TableEditor
                      label="Data Pengelolaan Sampah Bulanan"
                      table={richMedia.sampahData}
                      onChange={(t) => updateRichMedia({ sampahData: t })}
                      defaultHeaders={["Bulan", "Organik (ton)", "Anorganik (ton)", "Didaur Ulang (%)"]}
                      unit="ton/bulan"
                    />
                  </div>
                </SectionBox>

                <SectionBox title="Perlindungan Keanekaragaman Hayati" color="green">
                  <Input label="Luas Area Konservasi (ha)" value={env.luasKonservasi} onChange={(v) => setEnv({ ...env, luasKonservasi: v })} />
                  <TextArea label="Program Keanekaragaman Hayati" value={env.programKehati} onChange={(v) => setEnv({ ...env, programKehati: v })} />
                  <TextArea label="Hasil Perlindungan Kehati" value={env.hasilKehati} onChange={(v) => setEnv({ ...env, hasilKehati: v })} />
                </SectionBox>
              </div>
            )}

            {/* Step 4: Media & Foto */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Foto & Media Pendukung</h3>
                <p className="text-sm text-gray-500 mb-4">Upload foto untuk dimasukkan ke dalam dokumen DRKPL</p>

                <ImageUploader
                  label="Foto Site / Lokasi"
                  hint="Foto area operasional, fasilitas pengelolaan lingkungan, dll"
                  images={richMedia.fotoSite}
                  onChange={(imgs) => updateRichMedia({ fotoSite: imgs })}
                  max={10}
                />

                <ImageUploader
                  label="Foto Program / Bukti Kegiatan"
                  hint="Foto kegiatan community development, konservasi, inovasi sosial, dll"
                  images={richMedia.fotoProgram}
                  onChange={(imgs) => updateRichMedia({ fotoProgram: imgs })}
                  max={10}
                />
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Siap Generate DRKPL</h3>
                <p className="text-gray-600 mb-2">
                  Dokumen akan digenerate sesuai Permen LH/BPH No. 07/2025
                </p>
                <div className="inline-block bg-gray-50 rounded-xl px-4 py-2 text-xs text-gray-500 mb-4">
                  Times New Roman 12pt | Spasi Tunggal | A4 | *.docx | Max 30 Halaman
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-md mx-auto">
                  <p><strong>Perusahaan:</strong> {company.namaPerusahaan || "-"}</p>
                  <p><strong>Tahun:</strong> {company.tahunPenilaian}</p>
                  <p><strong>Bidang:</strong> {company.bidangUsaha || "-"}</p>
                  <p><strong>Penanggung Jawab:</strong> {company.namaPenanggungJawab || "-"}</p>
                  <p><strong>Logo:</strong> {richMedia.logoPerusahaan ? "✅ Ada" : "❌ Tidak ada"}</p>
                  <p><strong>Foto Site:</strong> {richMedia.fotoSite.length} foto</p>
                  <p><strong>Foto Program:</strong> {richMedia.fotoProgram.length} foto</p>
                  <p><strong>Tabel Data:</strong> {
                    [richMedia.energiBulanan, richMedia.emisiBulanan, richMedia.airBulanan, 
                     richMedia.limbahB3Data, richMedia.limbahNonB3Data, richMedia.sampahData]
                    .filter(Boolean).length
                  } tabel</p>
                  <p className="text-xs text-amber-600 mt-2">⚠️ Pastikan semua data terisi. Surat pernyataan akan otomatis digenerate.</p>
                </div>
              </div>
            )}
          </>
        )}

        {docType === "sroi" && (
          <>
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Data Program SROI</h3>
                <Input label="Nama Program" value={sroi.namaProgram} onChange={(v) => setSroi({ ...sroi, namaProgram: v })} />
                <TextArea label="Deskripsi Program" value={sroi.deskripsiProgram} onChange={(v) => setSroi({ ...sroi, deskripsiProgram: v })} />
                <TextArea label="Stakeholder" value={sroi.stakeholder} onChange={(v) => setSroi({ ...sroi, stakeholder: v })} />
                <TextArea label="Input Investasi" value={sroi.inputInvestasi} onChange={(v) => setSroi({ ...sroi, inputInvestasi: v })} />
                <TextArea label="Output Kuantitatif" value={sroi.outputKuantitatif} onChange={(v) => setSroi({ ...sroi, outputKuantitatif: v })} />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Analisis Dampak</h3>
                <TextArea label="Indikator KPI" value={sroi.indikatorKPI} onChange={(v) => setSroi({ ...sroi, indikatorKPI: v })} />
                <TextArea label="Metode Pengukuran" value={sroi.metodePengukuran} onChange={(v) => setSroi({ ...sroi, metodePengukuran: v })} />
                <TextArea label="Outcome Jangka Pendek" value={sroi.outcomeJangkaPendek} onChange={(v) => setSroi({ ...sroi, outcomeJangkaPendek: v })} />
                <TextArea label="Outcome Jangka Panjang" value={sroi.outcomeJangkaPanjang} onChange={(v) => setSroi({ ...sroi, outcomeJangkaPanjang: v })} />
                <TextArea label="Dampak Sosial" value={sroi.dampakSosial} onChange={(v) => setSroi({ ...sroi, dampakSosial: v })} />
                <TextArea label="Dampak Lingkungan" value={sroi.dampakLingkungan} onChange={(v) => setSroi({ ...sroi, dampakLingkungan: v })} />
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Siap Generate SROI</h3>
                <p className="text-gray-600 mb-6">Data telah lengkap. Klik tombol di bawah untuk generate dokumen analisis SROI.</p>
                <TextArea label="Hasil SROI (Ringkasan perhitungan)" value={sroi.hasilSROI} onChange={(v) => setSroi({ ...sroi, hasilSROI: v })} />
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={step === 0 ? () => setDocType(null) : handleBack}
            className="flex items-center px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {step === 0 ? "Kembali" : "Sebelumnya"}
          </button>
          {step === currentSteps.length - 1 ? (
            <button
              onClick={handleGenerate}
              className={`flex items-center px-8 py-2 rounded-lg text-white font-semibold transition-colors ${
                docType === "drkpl" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Generate Dokumen
              <FileText className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`flex items-center px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
                docType === "drkpl" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Lanjut
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionBox({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const borderColor = {
    amber: "border-amber-200 bg-amber-50/30",
    blue: "border-blue-200 bg-blue-50/30",
    cyan: "border-cyan-200 bg-cyan-50/30",
    red: "border-red-200 bg-red-50/30",
    orange: "border-orange-200 bg-orange-50/30",
    yellow: "border-yellow-200 bg-yellow-50/30",
    green: "border-green-200 bg-green-50/30",
  }[color] || "border-gray-200 bg-gray-50/30";

  return (
    <div className={`border rounded-xl p-4 ${borderColor} space-y-3`}>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
