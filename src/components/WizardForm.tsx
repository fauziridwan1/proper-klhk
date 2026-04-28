"use client";

import { useState } from "react";
import { CompanyData, EnvironmentData, SROIData, RichMedia, UploadedImage, DataTable } from "@/lib/types";
import { ChevronRight, ChevronLeft, Building2, Upload, Image, FileText, CheckCircle, Edit3, X } from "lucide-react";
import DocumentUploader from "./DocumentUploader";
import ImageUploader from "./ImageUploader";
import TableEditor from "./TableEditor";

interface WizardFormProps {
  onGenerateDRKPL: (company: CompanyData, env: EnvironmentData) => void;
  onGenerateSROI: (data: SROIData) => void;
  richMedia: RichMedia;
  onRichMediaChange: (rm: RichMedia) => void;
}

const emptyCompany: CompanyData = {
  namaPerusahaan: "", alamat: "", bidangUsaha: "", namaPenanggungJawab: "",
  jabatan: "", tahunPenilaian: new Date().getFullYear().toString(), nomorIzin: "",
  kapasitasProduksi: "", jumlahKaryawan: "", luasLahan: "", lokasi: "",
};

const emptyEnv: EnvironmentData = {
  pemakaianEnergi: "", sumberEnergi: "", programEfisiensiEnergi: "", hasilEfisiensiEnergi: "",
  emisiGRK: "", emisiKonvensional: "", programPenguranganEmisi: "", hasilPenguranganEmisi: "",
  penggunaanAir: "", airLimbah: "", programKonservasiAir: "", hasilKonservasiAir: "",
  limbahB3: "", program3RB3: "", hasil3RB3: "",
  limbahNonB3: "", program3RNonB3: "", hasil3RNonB3: "",
  jumlahSampah: "", programPengelolaanSampah: "", hasilPengelolaanSampah: "",
  programKehati: "", luasKonservasi: "", hasilKehati: "",
  lingkupLCA: "", metodologiLCA: "", hasilLCA: "",
};

export default function WizardForm({ onGenerateDRKPL, onGenerateSROI, richMedia, onRichMediaChange }: WizardFormProps) {
  const [step, setStep] = useState(0);
  const [docType, setDocType] = useState<"drkpl" | "sroi" | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

  const [company, setCompany] = useState<CompanyData>({ ...emptyCompany });
  const [env, setEnv] = useState<EnvironmentData>({ ...emptyEnv });

  const [sroi, setSroi] = useState<SROIData>({
    namaProgram: "", deskripsiProgram: "", stakeholder: "", inputInvestasi: "",
    outputKuantitatif: "", outcomeJangkaPendek: "", outcomeJangkaPanjang: "",
    indikatorKPI: "", metodePengukuran: "", hasilSROI: "", dampakSosial: "", dampakLingkungan: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const stepsDRKPL = [
    { title: "Identitas", icon: Building2, hint: "Nama & logo" },
    { title: "Upload Dokumen", icon: Upload, hint: "Auto-extract" },
    { title: "Foto & Data", icon: Image, hint: "Tabel & gambar" },
    { title: "Review", icon: CheckCircle, hint: "Cek & generate" },
  ];

  const stepsSROI = [
    { title: "Data Program", icon: FileText },
    { title: "Dampak", icon: Image },
    { title: "Review", icon: CheckCircle },
  ];

  const currentSteps = docType === "drkpl" ? stepsDRKPL : stepsSROI;
  const maxSteps = currentSteps.length - 1;

  const handleNext = () => setStep((s) => Math.min(s + 1, maxSteps));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = () => {
    if (docType === "drkpl") onGenerateDRKPL(company, env);
    else onGenerateSROI(sroi);
  };

  const handleDataExtracted = (extractedCompany: Partial<CompanyData>, extractedEnv: Partial<EnvironmentData>, fileName: string) => {
    setCompany((prev) => {
      const merged = { ...prev };
      for (const [k, v] of Object.entries(extractedCompany)) {
        if (v) (merged as Record<string, string>)[k] = v;
      }
      return merged;
    });
    setEnv((prev) => {
      const merged = { ...prev };
      for (const [k, v] of Object.entries(extractedEnv)) {
        if (v) (merged as Record<string, string>)[k] = v;
      }
      return merged;
    });
    setUploadedFiles((prev) => [...prev, fileName]);
  };

  const updateRichMedia = (partial: Partial<RichMedia>) => {
    onRichMediaChange({ ...richMedia, ...partial });
  };

  const extractedCount = Object.entries(env).filter(([, v]) => v && v.length > 2).length;
  const hasExtractedData = extractedCount >= 3;

  // ──── DOC TYPE SELECTION ────
  if (!docType) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2 text-green-800">Pilih Jenis Dokumen</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Upload dokumen lama atau isi data minimal — AI akan menyusun sisanya</p>
        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => setDocType("drkpl")}
            className="p-8 rounded-2xl border-2 border-green-200 hover:border-green-600 hover:shadow-lg transition-all bg-white group">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-green-800 mb-2">DRKPL</h3>
            <p className="text-gray-600 text-sm">Dokumen Ringkasan Kinerja Pengelolaan Lingkungan</p>
          </button>
          <button onClick={() => setDocType("sroi")}
            className="p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all bg-white group">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-blue-800 mb-2">SROI</h3>
            <p className="text-gray-600 text-sm">Social Return on Investment Analysis</p>
          </button>
        </div>
      </div>
    );
  }

  // ──── DRKPL WIZARD ────
  if (docType === "drkpl") {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepsDRKPL.map((s, i) => (
            <div key={i} className="flex items-center">
              <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                i === step ? "bg-green-600 text-white shadow" : i < step ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                <s.icon className="w-4 h-4" />
                <span className="hidden md:inline">{s.title}</span>
              </button>
              {i < stepsDRKPL.length - 1 && <div className="w-6 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* ── STEP 1: IDENTITAS ── */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <Building2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Identitas Perusahaan</h3>
                <p className="text-sm text-gray-500">Cukup isi nama & upload logo. Sisanya bisa dari upload dokumen di step berikutnya.</p>
              </div>

              <Input large label="Nama Perusahaan *" value={company.namaPerusahaan}
                onChange={(v) => setCompany({ ...company, namaPerusahaan: v })}
                placeholder="PT. Nama Perusahaan" />

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Tahun Penilaian" value={company.tahunPenilaian}
                  onChange={(v) => setCompany({ ...company, tahunPenilaian: v })} />
                <Input label="Bidang Usaha" value={company.bidangUsaha}
                  onChange={(v) => setCompany({ ...company, bidangUsaha: v })} />
              </div>

              <ImageUploader label="Logo Perusahaan (opsional)" hint="Muncul di kop dokumen"
                images={richMedia.logoPerusahaan ? [richMedia.logoPerusahaan] : []}
                onChange={(imgs) => updateRichMedia({ logoPerusahaan: imgs[0] || null })} single max={1} />
            </div>
          )}

          {/* ── STEP 2: UPLOAD DOKUMEN ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <Upload className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Upload Dokumen Sumber</h3>
                <p className="text-sm text-gray-500">
                  Upload DRKPL / laporan lingkungan yang sudah ada. AI akan otomatis mengekstrak semua data.
                </p>
              </div>

              <DocumentUploader onDataExtracted={handleDataExtracted} />

              {uploadedFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-green-800 mb-2">✅ {uploadedFiles.length} file diproses:</p>
                  {uploadedFiles.map((f, i) => (
                    <p key={i} className="text-xs text-green-700">• {f}</p>
                  ))}
                  {hasExtractedData && (
                    <p className="text-xs text-green-600 mt-2">✓ {extractedCount} data berhasil di-extract</p>
                  )}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p><strong>💡 Tips:</strong> Upload dokumen Word (.docx) atau PDF DRKPL tahun sebelumnya. Semakin lengkap dokumen sumber, semakin banyak data yang terisi otomatis. Upload beberapa file jika perlu.</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: FOTO & DATA ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <Image className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Foto & Data Pendukung</h3>
                <p className="text-sm text-gray-500">Foto dan tabel akan muncul di dalam dokumen DRKPL</p>
              </div>

              <ImageUploader label="Foto Site / Lokasi" hint="Area operasional, fasilitas lingkungan, dll (max 10)"
                images={richMedia.fotoSite} onChange={(imgs) => updateRichMedia({ fotoSite: imgs })} max={10} />

              <ImageUploader label="Foto Program / Kegiatan" hint="Community development, konservasi, inovasi sosial (max 10)"
                images={richMedia.fotoProgram} onChange={(imgs) => updateRichMedia({ fotoProgram: imgs })} max={10} />

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">📊 Tabel Data (Opsional)</h4>
                <p className="text-xs text-gray-500 mb-4">Tambah tabel data kuantitatif untuk dimasukkan ke dokumen</p>
                <div className="space-y-4">
                  <TableEditor label="Pemakaian Energi Bulanan" table={richMedia.energiBulanan}
                    onChange={(t) => updateRichMedia({ energiBulanan: t })}
                    defaultHeaders={["Bulan", "Pemakaian (GJ)", "Produksi (ton)"]} unit="GJ/bulan" />
                  <TableEditor label="Emisi Bulanan" table={richMedia.emisiBulanan}
                    onChange={(t) => updateRichMedia({ emisiBulanan: t })}
                    defaultHeaders={["Bulan", "Emisi GRK (ton CO2e)", "Emisi Konvensional"]} unit="ton CO2e/bulan" />
                  <TableEditor label="Limbah B3 Bulanan" table={richMedia.limbahB3Data}
                    onChange={(t) => updateRichMedia({ limbahB3Data: t })}
                    defaultHeaders={["Bulan", "Timbulan (ton)", "Dimanfaatkan (ton)"]} unit="ton/bulan" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: REVIEW ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Review & Generate</h3>
                <p className="text-sm text-gray-500">Cek data di bawah. Klik "Edit Data" bila perlu diperbaiki.</p>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <SummaryRow label="Perusahaan" value={company.namaPerusahaan || "⚠️ Belum diisi"} />
                <SummaryRow label="Tahun" value={company.tahunPenilaian} />
                <SummaryRow label="Bidang" value={company.bidangUsaha} />
                <SummaryRow label="Penanggung Jawab" value={company.namaPenanggungJawab} />
                <SummaryRow label="Lokasi" value={company.lokasi} />
                <hr className="my-2" />
                <SummaryRow label="Logo" value={richMedia.logoPerusahaan ? "✅ Ada" : "❌ Tidak ada"} />
                <SummaryRow label="Foto Site" value={`${richMedia.fotoSite.length} foto`} />
                <SummaryRow label="Foto Program" value={`${richMedia.fotoProgram.length} foto`} />
                <SummaryRow label="Tabel Data" value={`${[richMedia.energiBulanan, richMedia.emisiBulanan, richMedia.airBulanan, richMedia.limbahB3Data, richMedia.limbahNonB3Data, richMedia.sampahData].filter(Boolean).length} tabel`} />
                <SummaryRow label="Data Lingkungan" value={hasExtractedData ? `✅ ${extractedCount} field terisi` : "⚠️ Minim — disarankan upload dokumen"} />
              </div>

              {/* Quick Edit Toggle */}
              <button onClick={() => setShowEditPanel(!showEditPanel)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors">
                <Edit3 className="w-4 h-4" />
                {showEditPanel ? "Sembunyikan Edit Data" : "Edit Data Manual"}
              </button>

              {/* Edit Panel */}
              {showEditPanel && (
                <div className="border rounded-xl p-4 space-y-3 bg-white max-h-96 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800">Data Perusahaan</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input label="Alamat" value={company.alamat} onChange={(v) => setCompany({ ...company, alamat: v })} />
                    <Input label="Lokasi (Kota)" value={company.lokasi} onChange={(v) => setCompany({ ...company, lokasi: v })} />
                    <Input label="Penanggung Jawab" value={company.namaPenanggungJawab} onChange={(v) => setCompany({ ...company, namaPenanggungJawab: v })} />
                    <Input label="Jabatan" value={company.jabatan} onChange={(v) => setCompany({ ...company, jabatan: v })} />
                    <Input label="Nomor Izin" value={company.nomorIzin} onChange={(v) => setCompany({ ...company, nomorIzin: v })} />
                    <Input label="Luas Lahan" value={company.luasLahan} onChange={(v) => setCompany({ ...company, luasLahan: v })} />
                    <Input label="Kapasitas Produksi" value={company.kapasitasProduksi} onChange={(v) => setCompany({ ...company, kapasitasProduksi: v })} />
                    <Input label="Karyawan" value={company.jumlahKaryawan} onChange={(v) => setCompany({ ...company, jumlahKaryawan: v })} />
                  </div>

                  <h4 className="font-semibold text-gray-800 mt-4">Data Lingkungan</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input label="Pemakaian Energi" value={env.pemakaianEnergi} onChange={(v) => setEnv({ ...env, pemakaianEnergi: v })} />
                    <Input label="Sumber Energi" value={env.sumberEnergi} onChange={(v) => setEnv({ ...env, sumberEnergi: v })} />
                    <Input label="Emisi GRK" value={env.emisiGRK} onChange={(v) => setEnv({ ...env, emisiGRK: v })} />
                    <Input label="Emisi Konvensional" value={env.emisiKonvensional} onChange={(v) => setEnv({ ...env, emisiKonvensional: v })} />
                    <Input label="Penggunaan Air" value={env.penggunaanAir} onChange={(v) => setEnv({ ...env, penggunaanAir: v })} />
                    <Input label="Air Limbah" value={env.airLimbah} onChange={(v) => setEnv({ ...env, airLimbah: v })} />
                    <Input label="Limbah B3" value={env.limbahB3} onChange={(v) => setEnv({ ...env, limbahB3: v })} />
                    <Input label="Limbah Non B3" value={env.limbahNonB3} onChange={(v) => setEnv({ ...env, limbahNonB3: v })} />
                    <Input label="Jumlah Sampah" value={env.jumlahSampah} onChange={(v) => setEnv({ ...env, jumlahSampah: v })} />
                    <Input label="Luas Konservasi" value={env.luasKonservasi} onChange={(v) => setEnv({ ...env, luasKonservasi: v })} />
                  </div>
                  <TextArea label="Program Efisiensi Energi" value={env.programEfisiensiEnergi} onChange={(v) => setEnv({ ...env, programEfisiensiEnergi: v })} />
                  <TextArea label="Program Pengurangan Emisi" value={env.programPenguranganEmisi} onChange={(v) => setEnv({ ...env, programPenguranganEmisi: v })} />
                  <TextArea label="Program Konservasi Air" value={env.programKonservasiAir} onChange={(v) => setEnv({ ...env, programKonservasiAir: v })} />
                  <TextArea label="Program Kehati" value={env.programKehati} onChange={(v) => setEnv({ ...env, programKehati: v })} />
                  <TextArea label="Lingkup LCA" value={env.lingkupLCA} onChange={(v) => setEnv({ ...env, lingkupLCA: v })} />
                </div>
              )}

              <div className="bg-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500 text-center">
                Format: Times New Roman 12pt | Spasi Tunggal | A4 | *.docx | Max 30 Halaman
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button onClick={step === 0 ? () => setDocType(null) : handleBack}
              className="flex items-center px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-2" />
              {step === 0 ? "Kembali" : "Sebelumnya"}
            </button>
            {step === maxSteps ? (
              <button onClick={handleGenerate}
                className="flex items-center px-8 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                Generate Dokumen
                <FileText className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button onClick={handleNext}
                className="flex items-center px-6 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                Lanjut
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ──── SROI WIZARD ────
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-8">
        {stepsSROI.map((s, i) => (
          <div key={i} className="flex items-center">
            <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              i === step ? "bg-blue-600 text-white shadow" : i < step ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
            }`}>
              <s.icon className="w-4 h-4" />
              <span className="hidden md:inline">{s.title}</span>
            </button>
            {i < stepsSROI.length - 1 && <div className="w-6 h-0.5 bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Data Program SROI</h3>
            <Input label="Nama Program *" value={sroi.namaProgram} onChange={(v) => setSroi({ ...sroi, namaProgram: v })} />
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
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto" />
            <h3 className="text-xl font-bold text-blue-800">Siap Generate SROI</h3>
            <TextArea label="Hasil SROI (Ringkasan)" value={sroi.hasilSROI} onChange={(v) => setSroi({ ...sroi, hasilSROI: v })} />
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button onClick={step === 0 ? () => setDocType(null) : handleBack}
            className="flex items-center px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-2" />
            {step === 0 ? "Kembali" : "Sebelumnya"}
          </button>
          {step === maxSteps ? (
            <button onClick={handleGenerate}
              className="flex items-center px-8 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">
              Generate Dokumen
              <FileText className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button onClick={handleNext}
              className="flex items-center px-6 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">
              Lanjut
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${value.includes("⚠️") ? "text-amber-600" : value.includes("✅") ? "text-green-600" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, large }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; large?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${large ? "text-lg font-semibold" : ""}`} />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" />
    </div>
  );
}
