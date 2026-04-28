"use client";

import { useRef } from "react";
import { Download, X, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from "docx";
import { GeneratedDocument } from "@/lib/types";

interface DocumentPreviewProps {
  document: GeneratedDocument;
  onClose: () => void;
  color: "green" | "blue";
}

export default function DocumentPreview({ document: generatedDoc, onClose, color }: DocumentPreviewProps) {
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

    pdf.save(`${generatedDoc.title.replace(/\s+/g, "_")}.pdf`);
  };

  const handleExportWord = async () => {
    const children: Paragraph[] = [];

    // Title
    children.push(
      new Paragraph({
        text: generatedDoc.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Disusun sesuai Permen LH/BPH No. 07 Tahun 2025",
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      })
    );

    // Sections
    for (const section of generatedDoc.sections) {
      // Section heading
      children.push(
        new Paragraph({
          text: section.heading,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      // Parse HTML body to paragraphs
      const textBlocks = parseHtmlToTextBlocks(section.body);
      for (const block of textBlocks) {
        if (block.type === "heading") {
          children.push(
            new Paragraph({
              text: block.text,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            })
          );
        } else if (block.type === "list") {
          children.push(
            new Paragraph({
              text: "• " + block.text,
              spacing: { after: 80 },
              indent: { left: 400 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: parseInlineFormatting(block.text),
              spacing: { after: 120 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
      }
    }

    // Footer
    children.push(
      new Paragraph({
        text: "",
        spacing: { before: 600 },
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Dokumen ini digenerate otomatis oleh PROPER KLHK AI Generator",
            italics: true,
            size: 18,
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated on ${new Date().toLocaleDateString("id-ID")}`,
            italics: true,
            size: 18,
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedDoc.title.replace(/\s+/g, "_")}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const accentColor = color === "green" ? "text-green-700 border-green-600 bg-green-50" : "text-blue-700 border-blue-600 bg-blue-50";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${accentColor}`}>
          <div>
            <h2 className="text-xl font-bold">{generatedDoc.title}</h2>
            <p className="text-sm opacity-75">Dokumen telah digenerate oleh AI</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportWord}
              className="flex items-center px-4 py-2 bg-white rounded-lg border font-medium hover:shadow transition-all"
            >
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              Export Word
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center px-4 py-2 bg-white rounded-lg border font-medium hover:shadow transition-all"
            >
              <Download className="w-4 h-4 mr-2 text-red-600" />
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
              <h1 className="text-2xl font-bold text-green-900 uppercase">{generatedDoc.title}</h1>
              <p className="text-sm text-gray-500 mt-2">Disusun sesuai Permen LH/BPH No. 07 Tahun 2025</p>
            </div>

            {generatedDoc.sections.map((section, i) => (
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

// Helper to parse HTML content into structured text blocks
function parseHtmlToTextBlocks(html: string): Array<{ type: string; text: string }> {
  const blocks: Array<{ type: string; text: string }> = [];

  // Simple HTML tag removal and structure detection
  const lines = html.split(/\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect headings
    if (trimmed.match(/<h[23][^>]*>/i)) {
      const text = trimmed.replace(/<\/?[^>]+>/g, "").trim();
      if (text) blocks.push({ type: "heading", text });
    }
    // Detect list items
    else if (trimmed.match(/<li[^>]*>/i)) {
      const text = trimmed.replace(/<\/?[^>]+>/g, "").trim();
      if (text) blocks.push({ type: "list", text });
    }
    // Regular paragraphs
    else {
      const text = trimmed.replace(/<\/?[^>]+>/g, "").trim();
      if (text && text.length > 3) {
        blocks.push({ type: "paragraph", text });
      }
    }
  }

  return blocks;
}

// Parse inline formatting (bold, etc)
function parseInlineFormatting(text: string): TextRun[] {
  const parts = text.split(/(<strong>|<\/strong>|<b>|<\/b>)/);
  const result: TextRun[] = [];
  let isBold = false;

  for (const part of parts) {
    if (part === "<strong>" || part === "<b>") {
      isBold = true;
    } else if (part === "</strong>" || part === "</b>") {
      isBold = false;
    } else if (part) {
      result.push(new TextRun({ text: part, bold: isBold }));
    }
  }

  if (result.length === 0) {
    return [new TextRun({ text })];
  }

  return result;
}
