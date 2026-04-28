"use client";

import { useState } from "react";
import { Plus, Trash2, Table2, ChevronDown, ChevronUp, X } from "lucide-react";
import { DataTable } from "@/lib/types";

interface TableEditorProps {
  label: string;
  hint?: string;
  table: DataTable | null;
  onChange: (table: DataTable | null) => void;
  defaultHeaders?: string[];
  unit?: string;
}

export default function TableEditor({ label, hint, table, onChange, defaultHeaders = ["Bulan", "Nilai"], unit }: TableEditorProps) {
  const [expanded, setExpanded] = useState(!!table);
  const [title, setTitle] = useState(table?.title || label);
  const [headers, setHeaders] = useState<string[]>(table?.headers || defaultHeaders);
  const [rows, setRows] = useState<string[][]>(table?.rows || []);

  const hasData = !!table && table.rows.length > 0;

  const initializeTable = () => {
    const defaultRows = [
      ["Januari", ""],
      ["Februari", ""],
      ["Maret", ""],
      ["April", ""],
      ["Mei", ""],
      ["Juni", ""],
      ["Juli", ""],
      ["Agustus", ""],
      ["September", ""],
      ["Oktober", ""],
      ["November", ""],
      ["Desember", ""],
    ];
    const newRows = defaultRows.map(r => r.length === headers.length ? r : [...r, ...Array(headers.length - r.length).fill("")]);
    setRows(newRows);
    setExpanded(true);
    onChange({
      title: title || label,
      headers,
      rows: newRows,
      unit,
    });
  };

  const updateHeader = (idx: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[idx] = value;
    setHeaders(newHeaders);
    if (hasData) {
      onChange({ title: title || label, headers: newHeaders, rows, unit });
    }
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIdx] = [...newRows[rowIdx]];
    newRows[rowIdx][colIdx] = value;
    setRows(newRows);
    onChange({ title: title || label, headers, rows: newRows, unit });
  };

  const addRow = () => {
    const newRow = headers.map(() => "");
    const newRows = [...rows, newRow];
    setRows(newRows);
    onChange({ title: title || label, headers, rows: newRows, unit });
  };

  const removeRow = (idx: number) => {
    const newRows = rows.filter((_, i) => i !== idx);
    setRows(newRows);
    if (newRows.length === 0) {
      onChange(null);
      setExpanded(false);
    } else {
      onChange({ title: title || label, headers, rows: newRows, unit });
    }
  };

  const removeTable = () => {
    setRows([]);
    setExpanded(false);
    onChange(null);
  };

  const updateTitle = (val: string) => {
    setTitle(val);
    if (hasData) {
      onChange({ title: val, headers, rows, unit });
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (hasData) {
                  setExpanded(!expanded);
                } else {
                  initializeTable();
                }
              }}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-700"
            >
              <Table2 className="w-4 h-4 text-green-600" />
              {hasData ? title || label : label}
              {hasData && (expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </button>
            {hasData && !expanded && (
              <span className="text-xs text-gray-400">({rows.length} baris)</span>
            )}
          </div>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
        {!hasData && (
          <button
            type="button"
            onClick={initializeTable}
            className="flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Tabel
          </button>
        )}
        {hasData && (
          <button
            type="button"
            onClick={removeTable}
            className="flex items-center px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Hapus
          </button>
        )}
      </div>

      {expanded && hasData && (
        <div className="overflow-x-auto">
          {/* Title editor */}
          <input
            type="text"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full text-xs font-medium text-gray-800 mb-2 px-1 py-0.5 border-b border-dashed border-gray-200 focus:border-green-400 outline-none"
            placeholder="Judul tabel..."
          />
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-green-50">
                <th className="border border-green-200 px-2 py-1 text-left font-medium text-green-800 w-8">#</th>
                {headers.map((h, i) => (
                  <th key={i} className="border border-green-200 px-2 py-1">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      className="w-full bg-transparent text-center font-medium text-green-800 outline-none min-w-[60px]"
                    />
                  </th>
                ))}
                <th className="border border-green-200 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1 text-gray-400 text-center">{ri + 1}</td>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-1 py-0.5">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="w-full bg-transparent text-gray-700 outline-none px-1 min-w-[60px]"
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-200 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(ri)}
                      className="text-red-400 hover:text-red-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addRow}
            className="mt-2 flex items-center text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Tambah Baris
          </button>
          {unit && (
            <p className="text-xs text-gray-400 mt-1">Satuan: {unit}</p>
          )}
        </div>
      )}
    </div>
  );
}
