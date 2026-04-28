import Link from "next/link";
import { FileText, BarChart3, Shield, Zap, Leaf, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Sesuai Permen LH/BPH No. 07/2025</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            PROPER <span className="text-emerald-300">KLHK</span>
            <br />
            <span className="text-3xl md:text-4xl font-light">AI Document Generator</span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
            Platform AI untuk menyusun dokumen DRKPL dan SROI bagi perusahaan peserta 
            Program Penilaian Peringkat Kinerja Perusahaan (PROPER) KLHK.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wizard"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-400 text-green-900 rounded-xl font-bold hover:bg-emerald-300 transition-all hover:scale-105"
            >
              Mulai Generate Dokumen
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-green-700">7</div>
            <div className="text-gray-600 mt-1">Section Dokumen</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-700">2</div>
            <div className="text-gray-600 mt-1">Jenis Dokumen</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-700">AI</div>
            <div className="text-gray-600 mt-1">Powered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-700">100%</div>
            <div className="text-gray-600 mt-1">Sesuai Regulasi</div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
          <p><strong>Format Dokumen:</strong> Times New Roman 12pt | Spasi Tunggal | A4 | *.docx | Max 30 Halaman</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Fitur Utama</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk menyusun dokumen PROPER dengan cepat dan akurat.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-green-600" />}
              title="Generate DRKPL"
              desc="7-section dokumen lengkap: Surat Pernyataan, LCA, SML, Efisiensi Sumber Daya, Limbah, Kehati, & Pemberdayaan Masyarakat."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
              title="Generate SROI"
              desc="Analisis Social Return on Investment untuk program community development."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-600" />}
              title="AI Powered"
              desc="Cukup masukkan data, AI akan merangkum dan menyusun dokumen profesional."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-emerald-600" />}
              title="Sesuai Regulasi"
              desc="Struktur dokumen mengikuti ketentuan resmi KLHK terbaru."
            />
            <FeatureCard
              icon={<Leaf className="w-8 h-8 text-teal-600" />}
              title="Sustainability Focus"
              desc="Mendukung target ESG dan SDGs perusahaan Anda."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-purple-600" />}
              title="Export PDF"
              desc="Hasil dokumen bisa langsung di-export ke format PDF siap kirim."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Menyusun Dokumen PROPER?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Jadilah perusahaan yang unggul dalam pengelolaan lingkungan. 
            Mulai dari DRKPL dan SROI yang terstruktur.
          </p>
          <Link
            href="/wizard"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-400 text-green-900 rounded-xl font-bold hover:bg-emerald-300 transition-all hover:scale-105"
          >
            Generate Dokumen Sekarang
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="text-sm text-emerald-200 mt-4">Gratis untuk MVP — Tanpa registrasi</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>PROPER KLHK AI Generator — MVP Version</p>
        <p className="mt-1">Dibangun untuk sustainability & ESG end-to-end solution</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
