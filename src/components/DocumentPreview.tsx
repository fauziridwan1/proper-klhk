"use client";

import { useRef } from "react";
import { Download, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { GeneratedDocument } from "@/lib/types";

interface DocumentPreviewProps {
  document: GeneratedDocument;
  onClose: () => void;
  color: "green" | "blue";
}

export default function DocumentPreview({ document, onClose, color }: DocumentPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    const canvas = await html2canvas(contentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${document.title.replace(/\s+/g, "_")}.pdf`);
  };

  const accentColor = color === "green" ? "text-green-700 border-green-600 bg-green-50" : "text-blue-700 border-blue-600 bg-blue-50";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${accentColor}`}>
          <div>
            <h2 className="text-xl font-bold">{document.title}</h2>
            <p className="text-sm opacity-75">Dokumen telah digenerate oleh AI</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center px-4 py-2 bg-white rounded-lg border font-medium hover:shadow transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-50 overflow-y-auto max-h-[70vh]">
          <div
            ref={contentRef}
            className="bg-white p-8 shadow-lg prose-document"
            style={{ minHeight: "800px" }}
          >
            <div className="text-center mb-8 border-b-2 border-green-800 pb-4">
              <h1 className="text-2xl font-bold text-green-900 uppercase">{document.title}</h1>
              <p className="text-sm text-gray-500 mt-2">Disusun sesuai Permen LH/BPH No. 07 Tahun 2025</p>
            </div>

            {document.sections.map((section, i) => (
              <div key={i} className="mb-8">
                <div dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            ))}

            <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
              <p>Dokumen ini digenerate otomatis oleh PROPER KLHK AI Generator</p>
              <p>Generated on {new Date().toLocaleDateString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
