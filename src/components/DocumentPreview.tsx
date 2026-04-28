"use client";

import { useRef } from "react";
import { Download, X, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
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
    const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true, allowTaint: true });
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
    // Use union type for mixed content
    const docChildren: (Paragraph | Table)[] = [];

    // Title
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: generatedDoc.title, font: "Times New Roman", size: 24, bold: true }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200, line: 240 },
      })
    );

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Disusun sesuai Permen LH/BPH No. 07 Tahun 2025", italics: true, font: "Times New Roman", size: 24 }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400, line: 240 },
      })
    );

    // Process each section
    for (const section of generatedDoc.sections) {
      // Section heading
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: section.heading, font: "Times New Roman", size: 24, bold: true })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 150, line: 240 },
        })
      );

      // Parse body into blocks (text, images, tables)
      const blocks = parseHtmlToBlocks(section.body);
      for (const block of blocks) {
        if (block.type === "image") {
          // Add image as paragraph with ImageRun
          try {
            if (!block.src) throw new Error("No image source");
            const base64Data = block.src.split(",")[1] || block.src;
            const buf = Buffer.from(base64Data, "base64");
            const imgRun = new ImageRun({
              data: buf,
              transformation: { width: block.maxWidth || 400, height: Math.round((block.maxWidth || 400) * 0.6) },
              type: "png",
            });
            docChildren.push(
              new Paragraph({
                children: [imgRun],
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
              })
            );
            if (block.caption) {
              docChildren.push(
                new Paragraph({
                  children: [new TextRun({ text: `Gambar: ${block.caption}`, font: "Times New Roman", size: 20, italics: true })],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 200, line: 240 },
                })
              );
            }
          } catch (e) {
            // Fallback: show image placeholder text
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: `[Gambar: ${block.caption || "terlampir"}]`, font: "Times New Roman", size: 24, italics: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
              })
            );
          }
        } else if (block.type === "table") {
          if (!block.headers || !block.rows) continue;
          // Add docx table
          const tableRows: TableRow[] = [];
          const colCount = block.headers.length + 1; // +1 for No column

          // Header row
          const headerCells: TableCell[] = [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No", font: "Times New Roman", size: 20, bold: true })], alignment: AlignmentType.CENTER })], width: { size: 500, type: WidthType.DXA } }),
          ];
          block.headers.forEach((h) => {
            headerCells.push(
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, font: "Times New Roman", size: 20, bold: true })], alignment: AlignmentType.CENTER })], width: { size: Math.floor(8500 / colCount), type: WidthType.DXA } })
            );
          });
          tableRows.push(new TableRow({ children: headerCells, tableHeader: true }));

          // Data rows
          block.rows.forEach((row, ri) => {
            const cells: TableCell[] = [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(ri + 1), font: "Times New Roman", size: 20 })], alignment: AlignmentType.CENTER })] }),
            ];
            row.forEach((cell) => {
              cells.push(
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cell || "-", font: "Times New Roman", size: 20 })], alignment: AlignmentType.LEFT })] })
              );
            });
            tableRows.push(new TableRow({ children: cells }));
          });

          // Caption before table
          if (block.caption) {
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: `Tabel: ${block.caption}`, font: "Times New Roman", size: 22, bold: true })],
                spacing: { before: 200, after: 100, line: 240 },
              })
            );
          }

          docChildren.push(
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            })
          );

          // Spacing after table
          docChildren.push(new Paragraph({ children: [new TextRun({ text: "", font: "Times New Roman", size: 12 })], spacing: { after: 50 } }));
        } else if (block.type === "heading") {
          if (!block.text) continue;
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: block.text, font: "Times New Roman", size: 24, bold: true })],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100, line: 240 },
            })
          );
        } else if (block.type === "list") {
          if (!block.text) continue;
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: "• " + block.text, font: "Times New Roman", size: 24 })],
              spacing: { after: 60, line: 240 },
              indent: { left: 400 },
            })
          );
        } else if (block.type === "paragraph") {
          if (!block.text) continue;
          docChildren.push(
            new Paragraph({
              children: parseInlineFormatting(block.text),
              spacing: { after: 100, line: 240 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
        // Skip empty/spacer blocks
      }
    }

    // Footer
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "", font: "Times New Roman", size: 24 })],
        spacing: { before: 400, line: 240 },
      })
    );
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "Dokumen ini digenerate otomatis oleh PROPER KLHK AI Generator", italics: true, font: "Times New Roman", size: 20 })],
        alignment: AlignmentType.CENTER,
        spacing: { line: 240 },
      })
    );
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: `Generated on ${new Date().toLocaleDateString("id-ID")}`, italics: true, font: "Times New Roman", size: 20 })],
        alignment: AlignmentType.CENTER,
        spacing: { line: 240 },
      })
    );

    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: docChildren,
      }],
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

  const pageEstimate = generatedDoc.pageEstimate || 0;
  const scoringData = generatedDoc.scoringData;
  const isOverLimit = pageEstimate > 30;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4">
        {/* Page Limit Warning Banner */}
        {isOverLimit && (
          <div className="bg-red-600 text-white px-6 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              <div>
                <p className="font-bold">DRKPL MELEBIHI BATAS 30 HALAMAN!</p>
                <p className="text-sm">Dokumen ini ~{pageEstimate} halaman. Akan dikurangi 50 poin sesuai Permen 07/2025.</p>
              </div>
            </div>
          </div>
        )}

        {/* Scoring Badge */}
        {scoringData && (
          <div className={`px-6 py-2 ${isOverLimit ? '' : 'rounded-t-2xl'} ${
            scoringData.category === 'EMAS' ? 'bg-amber-100 border-b border-amber-300' :
            scoringData.category === 'HIJAU' ? 'bg-green-100 border-b border-green-300' :
            'bg-gray-100 border-b border-gray-300'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className={`font-bold ${
                  scoringData.category === 'EMAS' ? 'text-amber-800' :
                  scoringData.category === 'HIJAU' ? 'text-green-800' :
                  'text-gray-700'
                }`}>
                  {scoringData.category === 'EMAS' && '🏆 KANDIDAT EMAS'}
                  {scoringData.category === 'HIJAU' && '🌿 KANDIDAT HIJAU'}
                  {scoringData.category === 'BELOW' && '⚪ BELOW COMPLIANCE'}
                </span>
                <span className="text-gray-600">
                  DRKPL: {scoringData.drkplScore} | SML: {scoringData.smlScore} | Total: {scoringData.totalScore}
                </span>
              </div>
              <span className="text-gray-500">~{pageEstimate} halaman</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${accentColor} ${!isOverLimit && !scoringData ? 'rounded-t-2xl' : ''}`}>
          <div>
            <h2 className="text-xl font-bold">{generatedDoc.title}</h2>
            <p className="text-sm opacity-75">Dokumen telah digenerate oleh AI</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportWord} className="flex items-center px-4 py-2 bg-white rounded-lg border font-medium hover:shadow transition-all">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              Export Word
            </button>
            <button onClick={handleExportPDF} className="flex items-center px-4 py-2 bg-white rounded-lg border font-medium hover:shadow transition-all">
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
          <div ref={contentRef} className="bg-white p-8 shadow-lg prose-document" style={{ minHeight: "800px" }}>
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

// --- HTML Parsing for Word Export (supports images, tables, text) ---

interface ParsedBlock {
  type: "paragraph" | "heading" | "list" | "image" | "table" | "spacer";
  text?: string;
  src?: string;       // base64 data URL for images
  caption?: string;
  maxWidth?: number;
  headers?: string[];
  rows?: string[][];
}

function parseHtmlToBlocks(html: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];

  // Split by block-level elements while keeping the tags
  const parts = html.split(/(<(?:figure|img|table|h[23]|li|p|div)[^>]*>[\s\S]*?<\/(?:figure|table|h[23]|li|p|div)>|<br\s*\/?>)/i);
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed === "<br/>" || trimmed === "<br>" || trimmed === "<br />") {
      blocks.push({ type: "spacer" });
      continue;
    }

    // Extract images from figure/img tags
    const figureMatch = trimmed.match(/<figure[^>]*>([\s\S]*?)<\/figure>/i);
    const imgTagMatch = trimmed.match(/<img[^>]+src="([^"]+)"[^>]*\/?>/i);
    
    if (figureMatch || imgTagMatch) {
      const src = imgTagMatch ? imgTagMatch[1] : (trimmed.match(/<img[^>]+src="([^"]+)"/i) || [])[1];
      const caption = (trimmed.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || [])[1] || "";
      let maxWidth = 500;
      const styleMatch = trimmed.match(/max-width:\s*(\d+)px/);
      if (styleMatch) maxWidth = parseInt(styleMatch[1]);
      if (src) {
        blocks.push({ type: "image", src, caption, maxWidth });
        continue;
      }
    }

    // Extract tables
    if (trimmed.includes("<table") && trimmed.includes("</table>")) {
      const tableBlock = parseHtmlTable(trimmed);
      if (tableBlock) {
        blocks.push(tableBlock);
        continue;
      }
    }

    // Headings
    if (trimmed.match(/<h[23][^>]*>/i)) {
      const text = stripHtml(trimmed);
      if (text) blocks.push({ type: "heading", text });
      continue;
    }

    // List items
    if (trimmed.match(/<li[^>]*>/i)) {
      const text = stripHtml(trimmed);
      if (text) blocks.push({ type: "list", text });
      continue;
    }

    // Regular text / paragraphs
    const cleanText = stripHtml(trimmed);
    if (cleanText && cleanText.length > 2) {
      blocks.push({ type: "paragraph", text: cleanText });
    }
  }

  return blocks;
}

function parseHtmlTable(html: string): ParsedBlock | null {
  // Extract caption
  const captionMatch = html.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
  const caption = captionMatch ? stripHtml(captionMatch[1]) : "";

  // Extract headers
  const headers: string[] = [];
  const theadMatch = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  if (theadMatch) {
    const thMatches = theadMatch[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi);
    for (const m of thMatches) {
      const text = stripHtml(m[1]);
      if (text && text.toLowerCase() !== "no") headers.push(text);
    }
  }

  // Extract rows
  const rows: string[][] = [];
  const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  const rowSource = tbodyMatch ? tbodyMatch[1] : html;
  const trMatches = rowSource.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  for (const tr of trMatches) {
    const tdMatches = tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    const row: string[] = [];
    for (const td of tdMatches) {
      row.push(stripHtml(td[1]));
    }
    if (row.length > 0) rows.push(row);
  }

  if (headers.length === 0 && rows.length === 0) return null;
  
  // Auto-detect headers from first row if no thead
  if (headers.length === 0 && rows.length > 0) {
    // First row might be headers (check if it looks like headers)
    // For simplicity, use the first row as data
  }

  return { type: "table", headers, rows, caption };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

// Parse inline formatting (bold)
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
      result.push(new TextRun({ text: part, bold: isBold, font: "Times New Roman", size: 24 }));
    }
  }

  if (result.length === 0) {
    return [new TextRun({ text, font: "Times New Roman", size: 24 })];
  }

  return result;
}
