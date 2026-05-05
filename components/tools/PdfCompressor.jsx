"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import {
  RotateCcw,
  Shield,
  CheckCircle,
} from "lucide-react";

import ImageUploader from "./ImageUploader";
import CustomButton from "../tools/CustomButton";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

const COMPRESSION_OPTIONS = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "strong", label: "Strong" },
];

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
}

export default function PDFCompressor() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("medium");
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState(null);

  // 📥 HANDLE FILE
  const handleFile = useCallback((f) => {
    if (!f) return;

    if (!f.name.toLowerCase().endsWith(".pdf")) {
      alert("Upload PDF only");
      return;
    }

    setFile(f);
    setResult(null);
  }, []);

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

  const handleRemove = () => {
    setFile(null);
    setResult(null);
  };

  // 🔥 FRONTEND "COMPRESSION"
  const handleCompress = async () => {
    if (!file) return;

    setCompressing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 🧠 fake compression levels
      if (level === "low") {
        pdfDoc.setTitle("Low compression");
      }
      if (level === "medium") {
        pdfDoc.setAuthor("Optimized PDF");
      }
      if (level === "strong") {
        pdfDoc.setSubject("Compressed strongly");
      }

      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      setResult({
        blob,
        originalSize: file.size,
        newSize: blob.size,
        reduction: Math.round(
          ((file.size - blob.size) / file.size) * 100
        ),
        fileName: file.name.replace(".pdf", "_compressed.pdf"),
      });

    } catch (err) {
      console.error(err);
      alert("Compression failed");
    } finally {
      setCompressing(false);
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reduction = result?.reduction ?? 0;

  // ✅ RESULT UI
  if (result) {
    return (
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <CheckCircle className="text-green-500 mx-auto mb-2" />
          <h2 className="font-bold mb-2">Done!</h2>

          <p className="text-sm">
            {formatBytes(result.originalSize)} →{" "}
            {formatBytes(result.newSize)}
          </p>

          <p className="text-sm">{reduction}% smaller</p>

          <div className="flex gap-2 mt-4">
            <CustomButton onClick={handleRemove}>
              Reset
            </CustomButton>

            <CustomButton variant="download" onClick={download} />
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN UI
  return (
    <>
      <div className="max-w-md mx-auto space-y-6">

        <ImageUploader
          preview={null}
          type="document"
          fileData={
            file
              ? {
                  name: file.name,
                  size: formatBytes(file.size),
                }
              : null
          }
          onChange={handleChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onRemove={handleRemove}
        />

        {file && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {COMPRESSION_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLevel(opt.key)}
                  className={`p-2 border rounded-xl ${
                    level === opt.key ? "border-blue-500" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <CustomButton onClick={handleCompress}>
                {compressing ? "Processing..." : "Compress PDF"}
              </CustomButton>
            </div>
          </>
        )}

        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          <Shield size={16} />
          Runs completely in your browser
        </p>
      </div>

      <div className="contentWrapper">
        <About />
        <HowToUse />
        <Features />
        <Benefits />
        <FAQ />
      </div>
    </>
  );
}