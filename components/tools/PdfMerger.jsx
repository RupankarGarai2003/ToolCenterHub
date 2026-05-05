"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Trash2, RotateCcw } from "lucide-react";
import ImageUploader from "./ImageUploader";

export default function PDFMerger() {
  const [files, setFiles] = useState([]);
  const [mergedUrl, setMergedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setFiles((prev) => [...prev, file]);
      setMergedUrl(null);
    } else {
      alert("Only PDF files allowed");
    }
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
  const handleDragLeave = () => {};

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFiles([]);
    setMergedUrl(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;

    setLoading(true);

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const copiedPages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setMergedUrl(url);
    setLoading(false);
  };

  const download = () => {
    if (!mergedUrl) return;

    const a = document.createElement("a");
    a.href = mergedUrl;
    a.download = "merged.pdf";
    a.click();
  };

  return (
    <div className="container ">
    {/* <div className="max-w-md mx-auto py-10 px-4 space-y-6"> */}

      {/* Upload Area */}
      {!mergedUrl && (
        <div >
          <ImageUploader
            preview={null}
            type="document"
            fileData={null}
            onChange={handleChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={() => {}}
          />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <span className="text-sm font-medium truncate">
                {file.name}
              </span>

              <button
                onClick={() => removeFile(index)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Merge Button */}
      {files.length > 1 && !mergedUrl && (
        <button
          onClick={mergePDFs}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Merging..." : "Merge PDFs"}
        </button>
      )}

      {/* Result Section */}
      {mergedUrl && (
        <div className="text-center space-y-5 bg-white p-6 rounded-2xl shadow-md">

          <p className="text-green-600 font-semibold">
            PDF merged successfully
          </p>

          <div className="flex justify-center gap-4">

            {/* Reset */}
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 transition text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Start over
            </button>

            {/* Download */}
            <button
              onClick={download}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow-lg"
            >
              <Download className="w-5 h-5" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}