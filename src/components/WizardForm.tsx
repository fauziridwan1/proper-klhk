"use client";

import { useState } from "react";
import { CompanyData, EnvironmentData, SROIData } from "@/lib/types";
import { ChevronRight, ChevronLeft, Building2, Leaf, Users, FileText, CheckCircle, Upload } from "lucide-react";
import DocumentUploader from "./DocumentUploader";

interface WizardFormProps {
  onGenerateDRKPL: (company: CompanyData, env: EnvironmentData) => void;
  onGenerateSROI: (data: SROIData) => void;
}

export default function WizardForm({ onGenerateDRKPL, onGenerateSROI }: WizardFormProps) {
  const [step, setStep] = useState(0);
  const [docType, setDocType] = useState<"drkpl" | "sroi" | null>(null);
  const [showUploader, setShowUploader] = useState(false);

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
    { title: "Upload / Profil", icon: Upload },
    { title: "Data Lingkungan", icon: Leaf },
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
    setShowUploader(false);
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
      <div className="flex items-center justify-between mb-8">
        {currentSteps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex flex-col items-center ${i <= step ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                i <= step ? "bg-green-600 text-white" : "bg-gray-200"
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{s.title}</span>
            </div>
            {i < currentSteps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${i < step ? "bg-green-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {docType === "drkpl" && (
          <>
            {step === 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Profil Perusahaan</h3>
                
                {/* Document Uploader */}
                <DocumentUploader onDataExtracted={handleDataExtracted} />
                
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Atau isi manual jika tidak ada dokumen:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Nama Perusahaan" value={company.namaPerusahaan} onChange={(v) => setCompany({ ...company, namaPerusahaan: v })} />
                    <Input label="Bidang Usaha" value={company.bidangUsaha} onChange={(v) => setCompany({ ...company, bidangUsaha: v })} />
                    <Input label="Nama Penanggung Jawab" value={company.namaPenanggungJawab} onChange={(v) => setCompany({ ...company, namaPenanggungJawab: v })} />
                    <Input label="Jabatan" value={company.jabatan} onChange={(v) => setCompany({ ...company, jabatan: v })} />
                    <Input label="Tahun Penilaian" value={company.tahunPenilaian} onChange={(v) => setCompany({ ...company, tahunPenilaian: v })} />
                    <Input label="Nomor Izin Lingkungan" value={company.nomorIzin} onChange={(v) => setCompany({ ...company, nomorIzin: v })} />
                    <Input label="Kapasitas Produksi" value={company.kapasitasProduksi} onChange={(v) => setCompany({ ...company, kapasitasProduksi: v })} />
                    <Input label="Jumlah Karyawan" value={company.jumlahKaryawan} onChange={(v) => setCompany({ ...company, jumlahKaryawan: v })} />
                    <Input label="Luas Lahan" value={company.luasLahan} onChange={(v) => setCompany({ ...company, luasLahan: v })} />
                    <Input label="Lokasi" value={company.lokasi} onChange={(v) => setCompany({ ...company, lokasi: v })} />
                  </div>
                  <TextArea label="Alamat Lengkap" value={company.alamat} onChange={(v) => setCompany({ ...company, alamat: v })} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Data Lingkungan</h3>
                
                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Efisiensi Energi</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Pemakaian Energi (GJ/th)" value={env.pemakaianEnergi} onChange={(v) => setEnv({ ...env, pemakaianEnergi: v })} />
                    <Input label="Sumber Energi" value={env.sumberEnergi} onChange={(v) => setEnv({ ...env, sumberEnergi: v })} />
                  </div>
                  <TextArea label="Program Efisiensi Energi" value={env.programEfisiensiEnergi} onChange={(v) => setEnv({ ...env, programEfisiensiEnergi: v })} />
                  <TextArea label="Hasil Efisiensi Energi" value={env.hasilEfisiensiEnergi} onChange={(v) => setEnv({ ...env, hasilEfisiensiEnergi: v })} />
                </div>

                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Penurunan Emisi</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Emisi GRK (ton CO2e)" value={env.emisiGRK} onChange={(v) => setEnv({ ...env, emisiGRK: v })} />
                    <Input label="Emisi Konvensional" value={env.emisiKonvensional} onChange={(v) => setEnv({ ...env, emisiKonvensional: v })} />
                  </div>
                  <TextArea label="Program Pengurangan Emisi" value={env.programPenguranganEmisi} onChange={(v) => setEnv({ ...env, programPenguranganEmisi: v })} />
                  <TextArea label="Hasil Pengurangan Emisi" value={env.hasilPenguranganEmisi} onChange={(v) => setEnv({ ...env, hasilPenguranganEmisi: v })} />
                </div>

                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Efisiensi Air</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Penggunaan Air (m3/th)" value={env.penggunaanAir} onChange={(v) => setEnv({ ...env, penggunaanAir: v })} />
                    <Input label="Air Limbah (m3/th)" value={env.airLimbah} onChange={(v) => setEnv({ ...env, airLimbah: v })} />
                  </div>
                  <TextArea label="Program Konservasi Air" value={env.programKonservasiAir} onChange={(v) => setEnv({ ...env, programKonservasiAir: v })} />
                  <TextArea label="Hasil Konservasi Air" value={env.hasilKonservasiAir} onChange={(v) => setEnv({ ...env, hasilKonservasiAir: v })} />
                </div>

                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Limbah B3</h4>
                  <Input label="Limbah B3 (ton/th)" value={env.limbahB3} onChange={(v) => setEnv({ ...env, limbahB3: v })} />
                  <TextArea label="Program 3R Limbah B3" value={env.program3RB3} onChange={(v) => setEnv({ ...env, program3RB3: v })} />
                  <TextArea label="Hasil 3R Limbah B3" value={env.hasil3RB3} onChange={(v) => setEnv({ ...env, hasil3RB3: v })} />
                </div>

                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Limbah Non B3</h4>
                  <Input label="Limbah Non B3 (ton/th)" value={env.limbahNonB3} onChange={(v) => setEnv({ ...env, limbahNonB3: v })} />
                  <TextArea label="Program 3R Limbah Non B3" value={env.program3RNonB3} onChange={(v) => setEnv({ ...env, program3RNonB3: v })} />
                  <TextArea label="Hasil 3R Limbah Non B3" value={env.hasil3RNonB3} onChange={(v) => setEnv({ ...env, hasil3RNonB3: v })} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Siap Generate DRKPL</h3>
                <p className="text-gray-600 mb-6">Data telah lengkap. Klik tombol di bawah untuk generate dokumen DRKPL sesuai Permen LH/BPH No. 07/2025.</p>
                <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2">
                  <p><strong>Perusahaan:</strong> {company.namaPerusahaan || "-"}</p>
                  <p><strong>Tahun:</strong> {company.tahunPenilaian}</p>
                  <p><strong>Bidang:</strong> {company.bidangUsaha || "-"}</p>
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

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
