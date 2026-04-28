"use client";

import { useState } from "react";
import WizardForm from "@/components/WizardForm";
import DocumentPreview from "@/components/DocumentPreview";
import { CompanyData, EnvironmentData, SROIData, GeneratedDocument, RichMedia, SectionEvidence } from "@/lib/types";
import { generateDRKPLTemplate, generateSROITemplate } from "@/lib/templates";

function emptyEvidence(): SectionEvidence {
  return { statusTable: null, absolutTable: null, sertifikat: "", inovasi: "", paten: "", fotoEvidence: [] };
}

const emptyRichMedia: RichMedia = {
  logoPerusahaan: null,
  fotoSite: [],
  fotoProgram: [],
  anggaranTable: null,
  energi: emptyEvidence(),
  emisi: emptyEvidence(),
  air: emptyEvidence(),
  limbahB3: emptyEvidence(),
  limbahNonB3: emptyEvidence(),
  sampah: emptyEvidence(),
  kehati: emptyEvidence(),
  pemberdayaan: emptyEvidence(),
};

export default function WizardClient() {
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [docColor, setDocColor] = useState<"green" | "blue">("green");
  const [richMedia, setRichMedia] = useState<RichMedia>({ ...emptyRichMedia });

  const handleGenerateDRKPL = (company: CompanyData, env: EnvironmentData) => {
    const doc = generateDRKPLTemplate(company, env, richMedia);
    setGeneratedDoc(doc);
    setDocColor("green");
  };

  const handleGenerateSROI = (data: SROIData) => {
    const doc = generateSROITemplate(data);
    setGeneratedDoc(doc);
    setDocColor("blue");
  };

  return (
    <>
      <WizardForm
        onGenerateDRKPL={handleGenerateDRKPL}
        onGenerateSROI={handleGenerateSROI}
        richMedia={richMedia}
        onRichMediaChange={setRichMedia}
      />
      {generatedDoc && (
        <DocumentPreview document={generatedDoc} onClose={() => setGeneratedDoc(null)} color={docColor} />
      )}
    </>
  );
}
