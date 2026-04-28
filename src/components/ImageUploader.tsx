"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Pencil } from "lucide-react";
import { UploadedImage } from "@/lib/types";

interface ImageUploaderProps {
  label: string;
  hint?: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max?: number;
  single?: boolean;
}

export default function ImageUploader({ label, hint, images, onChange, max = 10, single = false }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = single ? 1 : max - images.length;
    const selected = Array.from(files).slice(0, remaining);

    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: UploadedImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          dataUrl: reader.result as string,
          caption: "",
        };
        const img = new Image();
        img.onload = () => {
          newImage.width = img.width;
          newImage.height = img.height;
          if (single) {
            onChange([newImage]);
          } else {
            onChange([...images, newImage]);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, caption } : img)));
  };

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
        {(!single || images.length === 0) && images.length < max && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
            <ImagePlus className="w-4 h-4 mr-1" />
            {single ? "Upload" : "Tambah"}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={!single}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {images.map((img) => (
            <div key={img.id} className="relative group border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={img.dataUrl}
                alt={img.caption || img.name}
                className="w-full h-28 object-cover"
              />
              {/* Overlay actions */}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(img.id);
                    setEditCaption(img.caption);
                  }}
                  className="p-1 bg-white/90 rounded shadow hover:bg-white"
                >
                  <Pencil className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="p-1 bg-white/90 rounded shadow hover:bg-red-50"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
              </div>
              {/* Caption */}
              {editingId === img.id ? (
                <div className="p-2">
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    onBlur={() => {
                      updateCaption(img.id, editCaption);
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateCaption(img.id, editCaption);
                        setEditingId(null);
                      }
                    }}
                    placeholder="Keterangan gambar..."
                    className="w-full text-xs px-2 py-1 border rounded focus:ring-1 focus:ring-green-500 outline-none"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="p-1.5">
                  <p
                    className="text-xs text-gray-600 truncate cursor-pointer hover:text-green-600"
                    onClick={() => {
                      setEditingId(img.id);
                      setEditCaption(img.caption);
                    }}
                  >
                    {img.caption || "Klik untuk tambah keterangan"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">Belum ada gambar</p>
      )}
    </div>
  );
}
