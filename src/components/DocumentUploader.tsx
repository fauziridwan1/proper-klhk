"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, CheckCircle, X } from "lucide-react";
import { CompanyData, EnvironmentData } from "@/lib/types";
import { extractDataFromText } from "@/lib/extractor";

interface DocumentUploaderProps {
  onDataExtracted: (company: Partial<CompanyData>, env: Partial<EnvironmentData>, fileName: string) => void;
}

export default function DocumentUploader({ onDataExtracted }: DocumentUploaderProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedFile, setExtractedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const extractTextFromFile = async (file: File): Promise<{ text: string; error?: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return { text: data.text || "", error: data.error };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsExtracting(true);
    setError(null);
    setProgress("Membaca file...");

    try {
      const { text, error: apiError } = await extractTextFromFile(file);

      if (apiError) {
        setError(apiError);
        setIsExtracting(false);
        return;
      }

      if (!text || text.length < 50) {
        setError("Teks yang terekstrak terlalu sedikit. File mungkin hasil scan (gambar), terpassword, atau corrupt. Coba upload file .docx.");
        setIsExtracting(false);
        return;
      }

      setProgress("Menganalisis data...");
      const extracted = extractDataFromText(text);
      
      setProgress("Selesai!");
      setExtractedFile(file.name);
      onDataExtracted(extracted.company, extracted.environment, file.name);
    } catch (err) {
      setError("Gagal memproses file. Pastikan file tidak corrupt dan koneksi internet stabil.");
    } finally {
      setIsExtracting(false);
    }
  }, [onDataExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isExtracting,
  });

  const clearFile = () => {
    setExtractedFile(null);
    setError(null);
    setProgress("");
  };

  return (
    <div className="mb-6">
      <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
        <Upload className="w-4 h-4 mr-2 text-green-600" />
        Upload Dokumen Lama (Opsional)
      </h4>
      <p className="text-xs text-gray-500 mb-3">
        Upload DRKPL atau laporan lingkungan lama. AI akan otomatis mengisi form di bawah.
      </p>

      {extractedFile ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-800">{extractedFile}</p>
              <p className="text-sm text-green-600">Data berhasil di-extract!</p>
            </div>
          </div>
          <button onClick={clearFile} className="p-2 hover:bg-green-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-green-700" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
          } ${isExtracting ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input {...getInputProps()} />
          
          {isExtracting ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
              <p className="text-green-700 font-medium text-sm">{progress}</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-700 text-sm mb-1">
                {isDragActive ? "Drop file di sini..." : "Drag & drop file di sini"}
              </p>
              <p className="text-xs text-gray-500 mb-2">atau klik untuk memilih file</p>
              <div className="flex justify-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  <FileText className="w-3 h-3 mr-1" /> PDF
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  <FileText className="w-3 h-3 mr-1" /> DOCX
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  <FileText className="w-3 h-3 mr-1" /> TXT
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
