"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Download,
  Scissors,
  RotateCcw,
  FileText,
  Shield,
} from "lucide-react";
import ImageUploader from "./ImageUploader";

// Helpers
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
};

const parseRanges = (input, maxPages) => {
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  const pages = new Set();

  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) {
        if (i >= 1 && i <= maxPages) pages.add(i);
      }
    } else {
      const n = parseInt(part);
      if (n >= 1 && n <= maxPages) pages.add(n);
    }
  }

  return Array.from(pages);
};

export default function PDFSplitter() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState("each");
  const [ranges, setRanges] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  // 📥 FILE HANDLE
  const handleFile = async (f) => {
    if (!f || f.type !== "application/pdf") {
      alert("Upload PDF only");
      return;
    }

    setFile(f);
    setResults([]);

    const bytes = await f.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setPageCount(pdf.getPageCount());
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = () => { };

  const handleRemove = () => {
    setFile(null);
    setResults([]);
    setProgress(0);
  };

  // ✂️ SPLIT
  const handleSplit = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(10);

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    let outputs = [];

    if (mode === "each") {
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);

        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: "application/pdf" });

        outputs.push({
          url: URL.createObjectURL(blob),
          name: `${file.name}_page_${i + 1}.pdf`,
          size: blob.size,
        });

        setProgress((i / pdf.getPageCount()) * 100);
      }
    } else {
      const pages = parseRanges(ranges, pdf.getPageCount());
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(pdf, pages.map(p => p - 1));
      copied.forEach(p => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });

      outputs.push({
        url: URL.createObjectURL(blob),
        name: `${file.name}_range.pdf`,
        size: blob.size,
      });
    }

    setResults(outputs);
    setLoading(false);
    setProgress(100);
  };

  const downloadAll = async () => {
    for (const r of results) {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name;
      a.click();
      await new Promise((r) => setTimeout(r, 100));
    }
  };

  const reset = () => {
    setFile(null);
    setResults([]);
    setRanges("");
    setMode("each");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">

      {/* ✅ IMAGE UPLOADER */}
      {!file && (
        <ImageUploader
          preview={null}
          type="document"
          fileData={null}
          onChange={handleChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={() => { }}
        />
      )}

      {/* FILE INFO */}
      {file && !results.length && (
        <div className="space-y-5">

          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
            <FileText />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {formatBytes(file.size)} • {pageCount} pages
              </p>
            </div>
          </div>

          {/* MODE */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("each")}
              className={`flex-1 p-2 border rounded-3xl font-semibold text-sm ${mode === "each" ? "border-blue-500 border-dashed" : ""}`}
            >
              Each page
            </button>

            <button
              onClick={() => setMode("ranges")}
              className={`flex-1 p-2 border rounded-3xl font-semibold text-sm ${mode === "ranges" ? "border-blue-500 border-dashed" : ""}`}
            >
              Custom
            </button>
          </div>

          {mode === "ranges" && (
            <input
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="1-3,5"
              className="w-full border border-dashed p-2 rounded-3xl"
            />
          )}

          {loading && (
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="flex gap-6">
            <button onClick={handleSplit} className="custom-btn w-full justify-center font-semibold text-sm">
              Split PDF
            </button>

            <button onClick={handleRemove} className="custom-btn w-full justify-center font-semibold text-sm">
              <div className="flex gap-1 justify-center items-center">
                <RotateCcw className="w-3 h-3" />
                Change File
              </div>

            </button>
          </div>

        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="space-y-4">

          <p className="text-green-600 text-center font-semibold text-xl">Split complete</p>

          <div className="space-y-2 max-h-70 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex justify-between items-center p-2 border rounded-3xl font-semibold ">
                <span className="text-sm">{r.name}</span>
                <a href={r.url} download={r.name} className="download-btn">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
          <div className="flex gap-6 items-center">
            <button onClick={downloadAll} className="custom-btn w-full justify-center gap-1 font-bold text-sm">
              <Download className="w-4 h-4" />
              Download All
            </button>

            <button onClick={reset} className="custom-btn w-full justify-center gap-1 font-bold text-sm">
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </div>

        </div>
      )}

      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
        <Shield size={18} />
        Your files remain private
      </p>
    </div>
  );
}