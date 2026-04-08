"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Trash2, RotateCcw } from "lucide-react";
import ImageUploader from "./ImageUploader";

export default function PDFMerger() {
  const [files, setFiles] = useState([]);
  const [mergedUrl, setMergedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📥 ADD FILE
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
  const handleDragLeave = () => { };

  // ❌ REMOVE SINGLE FILE
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // 🔄 RESET ALL
  const reset = () => {
    setFiles([]);
    setMergedUrl(null);
  };

  // 🔥 MERGE PDFs
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

  // 📥 DOWNLOAD
  const download = () => {
    if (!mergedUrl) return;

    const a = document.createElement("a");
    a.href = mergedUrl;
    a.download = "merged.pdf";
    a.click();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">

      {/* ✅ IMAGE UPLOADER (DOCUMENT MODE) */}
{!mergedUrl && (
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
)}

      {/* 📂 FILE LIST */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-2xl"
            >
              <span className="text-sm truncate font-semibold">{file.name}</span>

              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 bg-gray-100 rounded-full w-[30px] h-[30px] shadow-[0_10px_10px_rgba(0,0,0,0.1)] flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 MERGE BUTTON */}
      {files.length > 1 && !mergedUrl && (
        <div className="flex justify-center">
          <button
            onClick={mergePDFs}
            disabled={loading}
            className="custom-btn font-semibold text-sm"
          >
            {loading ? "Merging..." : "Merge PDFs"}
          </button>
        </div>

      )}

      {/* ✅ RESULT */}
      {mergedUrl && (
        <div className="space-y-4 text-center">

          <p className="text-green-600 font-semibold text-md">
            PDF merged successfully
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={reset}
              className="custom-btn rounded-full flex gap-2 "
            >
              <RotateCcw className="w-4 h-4" />
               <p className="font-semibold text-sm">Start over</p>
            </button>
            <button
              onClick={download}
              className="download-btn"
            >
              <Download className="w-5 h-5" />

              {/* Tooltip */}
              <span className="download-tooltip">Download</span>
            </button>
          </div>




        </div>
      )}
    </div>
  );
}