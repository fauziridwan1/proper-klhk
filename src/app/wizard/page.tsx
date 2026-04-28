"use client";

import { useState } from "react";
import WizardForm from "@/components/WizardForm";
import DocumentPreview from "@/components/DocumentPreview";
import { CompanyData, EnvironmentData, SROIData, GeneratedDocument } from "@/lib/types";
import { generateDRKPLTemplate, generateSROITemplate } from "@/lib/templates";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WizardPage() {
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [docColor, setDocColor] = useState<"green" | "blue">("green");

  const handleGenerateDRKPL = (company: CompanyData, env: EnvironmentData) => {
    const doc = generateDRKPLTemplate(company, env);
    setGeneratedDoc(doc);
    setDocColor("green");
  };

  const handleGenerateSROI = (data: SROIData) => {
    const doc = generateSROITemplate(data);
    setGeneratedDoc(doc);
    setDocColor("blue");
  };

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

        <WizardForm
          onGenerateDRKPL={handleGenerateDRKPL}
          onGenerateSROI={handleGenerateSROI}
        />

        {generatedDoc && (
          <DocumentPreview
            document={generatedDoc}
            onClose={() => setGeneratedDoc(null)}
            color={docColor}
          />
        )}
      </div>
    </main>
  );
}
