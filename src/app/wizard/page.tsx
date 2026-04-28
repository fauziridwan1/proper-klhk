import Link from "next/link";
import { ArrowLeft, AlertTriangle, FileText, BarChart3, Award } from "lucide-react";
import WizardClient from "./WizardClient";

export default function WizardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-900 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Generate Dokumen PROPER</h1>
          <p className="text-gray-600">Isi data perusahaan Anda, AI akan menyusun dokumen DRKPL atau SROI</p>
        </div>

        {/* Rules & Scoring Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-800 text-sm">Batas Halaman DRKPL</h3>
            </div>
            <p className="text-xs text-gray-600">
              Maksimal <strong>30 halaman</strong>. Jika lebih, dikurangi <strong>50 poin</strong> dari total nilai sesuai Permen 07/2025.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-800 text-sm">Kandidat Hijau</h3>
            </div>
            <p className="text-xs text-gray-600">
              Nilai DRKPL ≥ 70 dan Nilai Sistem Manajemen Lingkungan ≥ 70.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800 text-sm">Kandidat Emas</h3>
            </div>
            <p className="text-xs text-gray-600">
              Passing grade ≥ 80, konsistensi peringkat, dan inovasi sosial.
            </p>
          </div>
        </div>

        <WizardClient />
      </div>
    </main>
  );
}
