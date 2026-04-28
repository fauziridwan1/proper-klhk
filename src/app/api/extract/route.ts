import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

// Dynamic import for pdf-parse
async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse v1.x exports a function directly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    console.error("PDF extraction error:", err);
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();
    let text = "";

    // PDF extraction
    if (fileName.endsWith(".pdf")) {
      text = await extractPDF(buffer);
      if (!text || text.trim().length < 20) {
        return NextResponse.json({
          text: "",
          error: "Tidak dapat membaca teks dari PDF. PDF mungkin berupa hasil scan (gambar) yang tidak memiliki teks terekstrak. Coba upload file .docx.",
        });
      }
    }
    // DOCX extraction
    else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
      if (result.messages.length > 0) {
        console.warn("Mammoth warnings:", result.messages);
      }
    }
    // Plain text
    else if (fileName.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    }
    else {
      return NextResponse.json({
        text: "",
        error: `Format file tidak didukung: ${file.name}. Upload file .pdf, .docx, atau .txt.`,
      });
    }

    // Clean up text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\t/g, " ")
      .replace(/\n{4,}/g, "\n\n\n") // collapse excessive newlines
      .trim();

    if (!text || text.length < 30) {
      return NextResponse.json({
        text: "",
        error: "Teks yang terekstrak terlalu sedikit. File mungkin berupa hasil scan (gambar), terpassword, atau corrupt. Coba upload file .docx dengan teks yang bisa diseleksi.",
      });
    }

    return NextResponse.json({
      text,
      length: text.length,
      pages: Math.ceil(text.length / 3000),
    });
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json(
      {
        text: "",
        error: "Gagal memproses file. Pastikan file tidak corrupt dan format didukung (.pdf, .docx, .txt).",
      },
      { status: 500 }
    );
  }
}
