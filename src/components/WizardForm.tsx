"use client";

import { useState } from "react";
import { CompanyData, EnvironmentData, SROIData, RichMedia, UploadedImage, DataTable, SectionEvidence } from "@/lib/types";
import { ChevronRight, ChevronLeft, Building2, Upload, Image, FileText, CheckCircle, Edit3 } from "lucide-react";
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
  deskripsiProsesProduksi: "", strukturManajemen: "", anggaranLingkungan: "",
  keunggulanPerusahaan: "", sertifikasiProduk: "", sertifikasiGreenBuilding: "",
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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [sroi, setSroi] = useState<SROIData>({
    namaProgram: "", deskripsiProgram: "", stakeholder: "", inputInvestasi: "",
    outputKuantitatif: "", outcomeJangkaPendek: "", outcomeJangkaPanjang: "",
    indikatorKPI: "", metodePengukuran: "", hasilSROI: "", dampakSosial: "", dampakLingkungan: "",
  });

  const stepsDRKPL = [
    { title: "Identitas", icon: Building2 },
    { title: "Upload", icon: Upload },
    { title: "Data", icon: Image },
    { title: "Review", icon: CheckCircle },
  ];

  const maxSteps = 3;

  const handleNext = () => setStep((s) => Math.min(s + 1, maxSteps));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));
  const handleGenerate = () => { if (docType === "drkpl") onGenerateDRKPL(company, env); else onGenerateSROI(sroi); };

  const handleDataExtracted = (extractedCompany: Partial<CompanyData>, extractedEnv: Partial<EnvironmentData>, fileName: string) => {
    setCompany(prev => ({ ...prev, ...Object.fromEntries(Object.entries(extractedCompany).filter(([, v]) => v)) }));
    setEnv(prev => ({ ...prev, ...Object.fromEntries(Object.entries(extractedEnv).filter(([, v]) => v)) }));
    setUploadedFiles(prev => [...prev, fileName]);
  };

  const updateRichMedia = (partial: Partial<RichMedia>) => onRichMediaChange({ ...richMedia, ...partial });

  const updateEvidence = (key: keyof RichMedia, partial: Partial<SectionEvidence>) => {
    if (key === "logoPerusahaan" || key === "fotoSite" || key === "fotoProgram") return;
    const current = richMedia[key] as SectionEvidence;
    updateRichMedia({ [key]: { ...current, ...partial } } as Partial<RichMedia>);
  };

  const extractedCount = Object.entries(env).filter(([, v]) => v && v.length > 2).length;
  const hasExtractedData = extractedCount >= 3;

  // ──── DOC TYPE ────
  if (!docType) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2 text-green-800">Pilih Jenis Dokumen</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Upload dokumen lama — AI akan merangkum & menyusun DRKPL otomatis</p>
        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => setDocType("drkpl")} className="p-8 rounded-2xl border-2 border-green-200 hover:border-green-600 hover:shadow-lg transition-all bg-white group">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110" />
            <h3 className="text-xl font-bold text-green-800 mb-2">DRKPL</h3>
            <p className="text-gray-600 text-sm">Dokumen Ringkasan Kinerja Pengelolaan Lingkungan</p>
          </button>
          <button onClick={() => setDocType("sroi")} className="p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all bg-white group">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110" />
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
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepsDRKPL.map((s, i) => (
            <div key={i} className="flex items-center">
              <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                i === step ? "bg-green-600 text-white shadow" : i < step ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                <s.icon className="w-4 h-4" /><span className="hidden md:inline">{s.title}</span>
              </button>
              {i < stepsDRKPL.length - 1 && <div className="w-6 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* STEP 0: IDENTITAS */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center"><Building2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Identitas Perusahaan</h3>
                <p className="text-sm text-gray-500">Isi nama perusahaan. Sisanya akan diisi otomatis dari upload dokumen.</p>
              </div>
              <Input large label="Nama Perusahaan *" value={company.namaPerusahaan} onChange={v => setCompany({ ...company, namaPerusahaan: v })} placeholder="PT. Nama Perusahaan" />
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Tahun Penilaian" value={company.tahunPenilaian} onChange={v => setCompany({ ...company, tahunPenilaian: v })} />
                <Input label="Bidang Usaha" value={company.bidangUsaha} onChange={v => setCompany({ ...company, bidangUsaha: v })} />
              </div>
              <ImageUploader label="Logo Perusahaan" images={richMedia.logoPerusahaan ? [richMedia.logoPerusahaan] : []} onChange={imgs => updateRichMedia({ logoPerusahaan: imgs[0] || null })} single max={1} />
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center"><Upload className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Upload Dokumen Sumber</h3>
                <p className="text-sm text-gray-500">Upload DRKPL / laporan lingkungan lama. AI akan auto-extract semua data.</p>
              </div>
              <DocumentUploader onDataExtracted={handleDataExtracted} />
              {uploadedFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-green-800">✅ {uploadedFiles.length} file diproses</p>
                  {uploadedFiles.map((f, i) => <p key={i} className="text-xs text-green-700">• {f}</p>)}
                  {hasExtractedData && <p className="text-xs text-green-600 mt-2">✓ {extractedCount} data berhasil di-extract</p>}
                </div>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>💡 Tips:</strong> Upload dokumen Word (.docx) atau PDF. Semakin lengkap dokumen sumber, semakin banyak data yang terisi otomatis.
              </div>
            </div>
          )}

          {/* STEP 2: DATA — Tables + Foto */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center"><Image className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Tabel Data & Foto Bukti</h3>
                <p className="text-sm text-gray-500">Isi tabel Status & Absolut, upload sertifikat/penghargaan</p>
              </div>

              {/* Section: Energi */}
              <SectionBlock title="⚡ Efisiensi Energi" color="amber">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Energi" table={richMedia.energi.statusTable} onChange={t => updateEvidence("energi", { statusTable: t })} defaultHeaders={["Tahun", "Pemakaian (GJ)", "Produksi (ton)", "Intensitas (GJ/ton)"]} />
                  <TableEditor label="Hasil Absolut" table={richMedia.energi.absolutTable} onChange={t => updateEvidence("energi", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat/Penghargaan" value={richMedia.energi.sertifikat} onChange={v => updateEvidence("energi", { sertifikat: v })} placeholder="ISO 50001, dll" />
                  <Input label="Inovasi" value={richMedia.energi.inovasi} onChange={v => updateEvidence("energi", { inovasi: v })} placeholder="Deskripsi inovasi" />
                  <Input label="Paten" value={richMedia.energi.paten} onChange={v => updateEvidence("energi", { paten: v })} placeholder="Nomor paten" />
                </div>
                <ImageUploader label="Foto Bukti (sertifikat, piagam)" images={richMedia.energi.fotoEvidence} onChange={imgs => updateEvidence("energi", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Section: Emisi */}
              <SectionBlock title="🏭 Pengurangan Emisi" color="blue">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Emisi" table={richMedia.emisi.statusTable} onChange={t => updateEvidence("emisi", { statusTable: t })} defaultHeaders={["Tahun", "GRK (ton CO2e)", "Konvensional", "Intensitas"]} />
                  <TableEditor label="Hasil Absolut" table={richMedia.emisi.absolutTable} onChange={t => updateEvidence("emisi", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat" value={richMedia.emisi.sertifikat} onChange={v => updateEvidence("emisi", { sertifikat: v })} placeholder="PROPER, dll" />
                  <Input label="Inovasi" value={richMedia.emisi.inovasi} onChange={v => updateEvidence("emisi", { inovasi: v })} />
                  <Input label="Paten" value={richMedia.emisi.paten} onChange={v => updateEvidence("emisi", { paten: v })} />
                </div>
                <ImageUploader label="Foto Bukti" images={richMedia.emisi.fotoEvidence} onChange={imgs => updateEvidence("emisi", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Section: Air */}
              <SectionBlock title="💧 Efisiensi Air" color="cyan">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Air" table={richMedia.air.statusTable} onChange={t => updateEvidence("air", { statusTable: t })} defaultHeaders={["Tahun", "Pemakaian (m3)", "Air Limbah (m3)", "BOD/COD"]} />
                  <TableEditor label="Hasil Absolut" table={richMedia.air.absolutTable} onChange={t => updateEvidence("air", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat" value={richMedia.air.sertifikat} onChange={v => updateEvidence("air", { sertifikat: v })} />
                  <Input label="Inovasi" value={richMedia.air.inovasi} onChange={v => updateEvidence("air", { inovasi: v })} />
                  <Input label="Paten" value={richMedia.air.paten} onChange={v => updateEvidence("air", { paten: v })} />
                </div>
                <ImageUploader label="Foto Bukti" images={richMedia.air.fotoEvidence} onChange={imgs => updateEvidence("air", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Section: Limbah B3 */}
              <SectionBlock title="☣️ Limbah B3" color="red">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Limbah B3" table={richMedia.limbahB3.statusTable} onChange={t => updateEvidence("limbahB3", { statusTable: t })} defaultHeaders={["Tahun", "Timbulan (ton)", "Dimanfaatkan", "Diolah", "Ditimbun"]} />
                  <TableEditor label="Nilai Absolut" table={richMedia.limbahB3.absolutTable} onChange={t => updateEvidence("limbahB3", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat" value={richMedia.limbahB3.sertifikat} onChange={v => updateEvidence("limbahB3", { sertifikat: v })} />
                  <Input label="Inovasi" value={richMedia.limbahB3.inovasi} onChange={v => updateEvidence("limbahB3", { inovasi: v })} />
                  <Input label="Paten" value={richMedia.limbahB3.paten} onChange={v => updateEvidence("limbahB3", { paten: v })} />
                </div>
                <ImageUploader label="Foto Bukti" images={richMedia.limbahB3.fotoEvidence} onChange={imgs => updateEvidence("limbahB3", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Section: Limbah Non B3 */}
              <SectionBlock title="♻️ Limbah Non B3" color="orange">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Limbah Non B3" table={richMedia.limbahNonB3.statusTable} onChange={t => updateEvidence("limbahNonB3", { statusTable: t })} defaultHeaders={["Tahun", "Timbulan (ton)", "Didaur Ulang", "Dimanfaatkan"]} />
                  <TableEditor label="Nilai Absolut" table={richMedia.limbahNonB3.absolutTable} onChange={t => updateEvidence("limbahNonB3", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat" value={richMedia.limbahNonB3.sertifikat} onChange={v => updateEvidence("limbahNonB3", { sertifikat: v })} />
                  <Input label="Inovasi" value={richMedia.limbahNonB3.inovasi} onChange={v => updateEvidence("limbahNonB3", { inovasi: v })} />
                  <Input label="Paten" value={richMedia.limbahNonB3.paten} onChange={v => updateEvidence("limbahNonB3", { paten: v })} />
                </div>
                <ImageUploader label="Foto Bukti" images={richMedia.limbahNonB3.fotoEvidence} onChange={imgs => updateEvidence("limbahNonB3", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Section: Sampah */}
              <SectionBlock title="🗑️ Pengelolaan Sampah" color="yellow">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Sampah" table={richMedia.sampah.statusTable} onChange={t => updateEvidence("sampah", { statusTable: t })} defaultHeaders={["Tahun", "Organik (ton)", "Anorganik (ton)", "Terolah (%)"]} />
                  <TableEditor label="Hasil Absolut" table={richMedia.sampah.absolutTable} onChange={t => updateEvidence("sampah", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat" value={richMedia.sampah.sertifikat} onChange={v => updateEvidence("sampah", { sertifikat: v })} />
                  <Input label="Inovasi" value={richMedia.sampah.inovasi} onChange={v => updateEvidence("sampah", { inovasi: v })} />
                  <Input label="Paten" value={richMedia.sampah.paten} onChange={v => updateEvidence("sampah", { paten: v })} />
                </div>
              </SectionBlock>

              {/* Section: Kehati */}
              <SectionBlock title="🌿 Keanekaragaman Hayati" color="green">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Kehati" table={richMedia.kehati.statusTable} onChange={t => updateEvidence("kehati", { statusTable: t })} defaultHeaders={["Tahun", "Luas (ha)", "Spesies Flora", "Spesies Fauna"]} />
                  <TableEditor label="Hasil Absolut" table={richMedia.kehati.absolutTable} onChange={t => updateEvidence("kehati", { absolutTable: t })} defaultHeaders={["Parameter", "Baseline", "Tahun Ini", "Perubahan (%)"]} />
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <Input label="Sertifikat" value={richMedia.kehati.sertifikat} onChange={v => updateEvidence("kehati", { sertifikat: v })} />
                  <Input label="Inovasi" value={richMedia.kehati.inovasi} onChange={v => updateEvidence("kehati", { inovasi: v })} />
                  <Input label="Paten" value={richMedia.kehati.paten} onChange={v => updateEvidence("kehati", { paten: v })} />
                </div>
                <ImageUploader label="Foto Bukti" images={richMedia.kehati.fotoEvidence} onChange={imgs => updateEvidence("kehati", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Section: Pemberdayaan */}
              <SectionBlock title="👥 Pemberdayaan Masyarakat" color="purple">
                <div className="grid md:grid-cols-2 gap-3">
                  <TableEditor label="Status Program" table={richMedia.pemberdayaan.statusTable} onChange={t => updateEvidence("pemberdayaan", { statusTable: t })} defaultHeaders={["Program", "Penerima", "Investasi (Rp)", "Lokasi"]} />
                  <TableEditor label="Outcome" table={richMedia.pemberdayaan.absolutTable} onChange={t => updateEvidence("pemberdayaan", { absolutTable: t })} defaultHeaders={["Indikator", "Baseline", "Tahun Ini", "Target"]} />
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  <Input label="Sertifikat/Penghargaan" value={richMedia.pemberdayaan.sertifikat} onChange={v => updateEvidence("pemberdayaan", { sertifikat: v })} placeholder="ISDA, CSR Award, dll" />
                  <Input label="Inovasi Sosial" value={richMedia.pemberdayaan.inovasi} onChange={v => updateEvidence("pemberdayaan", { inovasi: v })} placeholder="Deskripsi inovasi sosial" />
                </div>
                <ImageUploader label="Foto Bukti" images={richMedia.pemberdayaan.fotoEvidence} onChange={imgs => updateEvidence("pemberdayaan", { fotoEvidence: imgs })} max={5} />
              </SectionBlock>

              {/* Site Photos */}
              <ImageUploader label="Foto Site / Lokasi (umum)" images={richMedia.fotoSite} onChange={imgs => updateRichMedia({ fotoSite: imgs })} max={10} />
              <ImageUploader label="Foto Program / Kegiatan" images={richMedia.fotoProgram} onChange={imgs => updateRichMedia({ fotoProgram: imgs })} max={10} />
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center"><CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-800">Review & Generate</h3>
                <p className="text-sm text-gray-500">Cek data di bawah. Klik "Edit Data" bila perlu.</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <SummaryRow label="Perusahaan" value={company.namaPerusahaan || "⚠️ Belum diisi"} />
                <SummaryRow label="Tahun" value={company.tahunPenilaian} />
                <SummaryRow label="Bidang" value={company.bidangUsaha} />
                <SummaryRow label="Penanggung Jawab" value={company.namaPenanggungJawab} />
                <hr />
                <SummaryRow label="Logo" value={richMedia.logoPerusahaan ? "✅" : "❌"} />
                <SummaryRow label="Foto Site" value={`${richMedia.fotoSite.length} foto`} />
                <SummaryRow label="Foto Program" value={`${richMedia.fotoProgram.length} foto`} />
                <SummaryRow label="Data Lingkungan" value={hasExtractedData ? `✅ ${extractedCount} field` : "⚠️ Minim"} />
                {(["energi","emisi","air","limbahB3","limbahNonB3","sampah","kehati","pemberdayaan"] as const).map(k => {
                  const ev = richMedia[k] as SectionEvidence;
                  const hasData = ev.statusTable || ev.absolutTable || ev.sertifikat || ev.inovasi || ev.paten;
                  return <SummaryRow key={k} label={`  ↳ ${k}`} value={hasData ? "✅" : "⚠️"} />;
                })}
              </div>

              <button onClick={() => setShowEditPanel(!showEditPanel)} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-green-400 transition-colors">
                <Edit3 className="w-4 h-4" /> {showEditPanel ? "Sembunyikan" : "Edit Data Manual"}
              </button>

              {showEditPanel && (
                <div className="border rounded-xl p-4 space-y-3 bg-white max-h-96 overflow-y-auto">
                  <h4 className="font-semibold">Data Perusahaan</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input label="Alamat" value={company.alamat} onChange={v => setCompany({ ...company, alamat: v })} />
                    <Input label="Lokasi" value={company.lokasi} onChange={v => setCompany({ ...company, lokasi: v })} />
                    <Input label="Penanggung Jawab" value={company.namaPenanggungJawab} onChange={v => setCompany({ ...company, namaPenanggungJawab: v })} />
                    <Input label="Jabatan" value={company.jabatan} onChange={v => setCompany({ ...company, jabatan: v })} />
                    <Input label="No Izin" value={company.nomorIzin} onChange={v => setCompany({ ...company, nomorIzin: v })} />
                    <Input label="Luas Lahan" value={company.luasLahan} onChange={v => setCompany({ ...company, luasLahan: v })} />
                    <Input label="Kapasitas" value={company.kapasitasProduksi} onChange={v => setCompany({ ...company, kapasitasProduksi: v })} />
                    <Input label="Karyawan" value={company.jumlahKaryawan} onChange={v => setCompany({ ...company, jumlahKaryawan: v })} />
                  </div>
                  <TextArea label="Proses Produksi" value={company.deskripsiProsesProduksi} onChange={v => setCompany({ ...company, deskripsiProsesProduksi: v })} />
                  <TextArea label="Struktur Manajemen" value={company.strukturManajemen} onChange={v => setCompany({ ...company, strukturManajemen: v })} />
                  <TextArea label="Anggaran Lingkungan" value={company.anggaranLingkungan} onChange={v => setCompany({ ...company, anggaranLingkungan: v })} />
                  <TextArea label="Keunggulan" value={company.keunggulanPerusahaan} onChange={v => setCompany({ ...company, keunggulanPerusahaan: v })} />
                  <TextArea label="Sertifikasi Produk" value={company.sertifikasiProduk} onChange={v => setCompany({ ...company, sertifikasiProduk: v })} />
                  <TextArea label="Green Building" value={company.sertifikasiGreenBuilding} onChange={v => setCompany({ ...company, sertifikasiGreenBuilding: v })} />

                  <h4 className="font-semibold mt-4">Data Lingkungan</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input label="Energi" value={env.pemakaianEnergi} onChange={v => setEnv({ ...env, pemakaianEnergi: v })} />
                    <Input label="Sumber Energi" value={env.sumberEnergi} onChange={v => setEnv({ ...env, sumberEnergi: v })} />
                    <Input label="Emisi GRK" value={env.emisiGRK} onChange={v => setEnv({ ...env, emisiGRK: v })} />
                    <Input label="Emisi Konvensional" value={env.emisiKonvensional} onChange={v => setEnv({ ...env, emisiKonvensional: v })} />
                    <Input label="Air" value={env.penggunaanAir} onChange={v => setEnv({ ...env, penggunaanAir: v })} />
                    <Input label="Air Limbah" value={env.airLimbah} onChange={v => setEnv({ ...env, airLimbah: v })} />
                    <Input label="Limbah B3" value={env.limbahB3} onChange={v => setEnv({ ...env, limbahB3: v })} />
                    <Input label="Limbah Non B3" value={env.limbahNonB3} onChange={v => setEnv({ ...env, limbahNonB3: v })} />
                    <Input label="Luas Konservasi" value={env.luasKonservasi} onChange={v => setEnv({ ...env, luasKonservasi: v })} />
                  </div>
                  <TextArea label="Program Energi" value={env.programEfisiensiEnergi} onChange={v => setEnv({ ...env, programEfisiensiEnergi: v })} />
                  <TextArea label="Program Emisi" value={env.programPenguranganEmisi} onChange={v => setEnv({ ...env, programPenguranganEmisi: v })} />
                  <TextArea label="Program Air" value={env.programKonservasiAir} onChange={v => setEnv({ ...env, programKonservasiAir: v })} />
                  <TextArea label="Program Kehati" value={env.programKehati} onChange={v => setEnv({ ...env, programKehati: v })} />
                  <TextArea label="Lingkup LCA" value={env.lingkupLCA} onChange={v => setEnv({ ...env, lingkupLCA: v })} />
                </div>
              )}
              <div className="bg-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500 text-center">Times New Roman 12pt | Spasi Tunggal | A4 | Max 30 Halaman</div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button onClick={step === 0 ? () => setDocType(null) : handleBack} className="flex items-center px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4 mr-2" />{step === 0 ? "Kembali" : "Sebelumnya"}
            </button>
            {step === maxSteps ? (
              <button onClick={handleGenerate} className="flex items-center px-8 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700">
                Generate Dokumen <FileText className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button onClick={handleNext} className="flex items-center px-6 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700">
                Lanjut <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ──── SROI WIZARD (simplified) ────
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-8">
        {["Data", "Dampak", "Review"].map((t, i) => (
          <button key={i} onClick={() => setStep(i)} className={`px-3 py-1.5 rounded-lg text-sm ${i === step ? "bg-blue-600 text-white" : i < step ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{t}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {step === 0 && <div className="space-y-4"><h3 className="text-xl font-bold text-blue-800">Data Program</h3><Input label="Nama Program *" value={sroi.namaProgram} onChange={v => setSroi({ ...sroi, namaProgram: v })} /><TextArea label="Deskripsi" value={sroi.deskripsiProgram} onChange={v => setSroi({ ...sroi, deskripsiProgram: v })} /><TextArea label="Stakeholder" value={sroi.stakeholder} onChange={v => setSroi({ ...sroi, stakeholder: v })} /><TextArea label="Input Investasi" value={sroi.inputInvestasi} onChange={v => setSroi({ ...sroi, inputInvestasi: v })} /></div>}
        {step === 1 && <div className="space-y-4"><h3 className="text-xl font-bold text-blue-800">Analisis Dampak</h3><TextArea label="KPI" value={sroi.indikatorKPI} onChange={v => setSroi({ ...sroi, indikatorKPI: v })} /><TextArea label="Metode" value={sroi.metodePengukuran} onChange={v => setSroi({ ...sroi, metodePengukuran: v })} /><TextArea label="Dampak Sosial" value={sroi.dampakSosial} onChange={v => setSroi({ ...sroi, dampakSosial: v })} /><TextArea label="Dampak Lingkungan" value={sroi.dampakLingkungan} onChange={v => setSroi({ ...sroi, dampakLingkungan: v })} /></div>}
        {step === 2 && <div className="text-center space-y-4"><CheckCircle className="w-16 h-16 text-blue-600 mx-auto" /><h3 className="text-xl font-bold text-blue-800">Generate SROI</h3><TextArea label="Hasil SROI" value={sroi.hasilSROI} onChange={v => setSroi({ ...sroi, hasilSROI: v })} /></div>}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button onClick={step === 0 ? () => setDocType(null) : handleBack} className="flex items-center px-6 py-2 rounded-lg border border-gray-300"><ChevronLeft className="w-4 h-4 mr-2" />{step === 0 ? "Kembali" : "Sebelumnya"}</button>
          {step === 2 ? <button onClick={handleGenerate} className="flex items-center px-8 py-2 rounded-lg text-white font-semibold bg-blue-600">Generate <FileText className="w-4 h-4 ml-2" /></button> : <button onClick={handleNext} className="flex items-center px-6 py-2 rounded-lg text-white font-semibold bg-blue-600">Lanjut <ChevronRight className="w-4 h-4 ml-2" /></button>}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-gray-500">{label}</span><span className={`font-medium ${value.includes("⚠️") ? "text-amber-600" : value.includes("✅") ? "text-green-600" : "text-gray-800"}`}>{value}</span></div>;
}

function SectionBlock({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = { amber: "border-amber-200", blue: "border-blue-200", cyan: "border-cyan-200", red: "border-red-200", orange: "border-orange-200", yellow: "border-yellow-200", green: "border-green-200", purple: "border-purple-200" };
  return <div className={`border rounded-xl p-4 space-y-3 ${colors[color] || "border-gray-200"}`}><h4 className="font-semibold">{title}</h4>{children}</div>;
}

function Input({ label, value, onChange, placeholder, large }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; large?: boolean }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${large ? "text-lg font-semibold" : ""}`} /></div>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" /></div>;
}
