"use client";

import { useState } from "react";
import WizardForm from "@/components/WizardForm";
import DocumentPreview from "@/components/DocumentPreview";
import { CompanyData, EnvironmentData, SROIData, GeneratedDocument } from "@/lib/types";
import { generateDRKPLTemplate, generateSROITemplate } from "@/lib/templates";

export default function WizardClient() {
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
    <>
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
    </>
  );
}
