"use client";

import { useState, useCallback } from "react";
import {
  Download,
  RotateCcw,
  Shield,
  CheckCircle,
} from "lucide-react";

import ImageUploader from "./ImageUploader";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

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
  const [progress, setProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState(null);

  // 📥 HANDLE FILE
  const handleFile = useCallback((f) => {
    if (!f) return;

    // ✅ Validate type
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      alert("Upload PDF only");
      return;
    }

    // ✅ File size limit (20MB)
    if (f.size > 20 * 1024 * 1024) {
      alert("Max file size is 20MB");
      return;
    }

    setFile(f);
    setResult(null);
    setProgress(0);
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

  // ❌ REMOVE FILE
  const handleRemove = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  // 🔥 BACKEND COMPRESSION
  const handleCompress = async () => {
    if (!file) return;

    setCompressing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", level);

      const res = await fetch("http://localhost:8000/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Compression failed");

      setProgress(60);

      // ✅ Get headers from backend
      const originalSize = res.headers.get("X-Original-Size");
      const compressedSize = res.headers.get("X-Compressed-Size");
      const reduction = res.headers.get("X-Reduction");

      const blob = await res.blob();

      setProgress(100);

      setResult({
        blob,
        originalSize: Number(originalSize) || file.size,
        newSize: Number(compressedSize) || blob.size,
        reduction: Number(reduction) || 0,
        fileName: file.name.replace(".pdf", "_compressed.pdf"),
      });

    } catch (err) {
      console.error(err);
      alert("Compression failed");
    } finally {
      setCompressing(false);
    }
  };

  // 📥 DOWNLOAD
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
      <div className="flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <CheckCircle className="text-green-500 mx-auto mb-2" />
          <h2 className="font-bold mb-2">Done!</h2>

          <p className="font-semibold text-sm">
            {formatBytes(result.originalSize)} →{" "}
            {formatBytes(result.newSize)}
          </p>

          <p className="font-semibold text-sm">
            {reduction}% smaller
          </p>

          <div className="flex gap-2 mt-4 font-bold text-sm">
            <CustomButton
              onClick={handleRemove}
              animation="ripple"
              btnSize="md"
              variant="secondary"
              leftIcon={<RotateCcw size={18} strokeWidth={2.5} />}
            >
              Reset
            </CustomButton>

            <CustomButton
              variant="download"
              onClick={download}
              animation="bounce"
            />
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
                  className={`p-2 border border-dashed rounded-2xl ${
                    level === opt.key ? "border-blue-500" : ""
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                </button>
              ))}
            </div>

            {compressing && (
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="flex justify-center">
              <CustomButton
                onClick={handleCompress}
                animation="ripple"
                btnSize="md"
                variant="success"
              >
                {compressing ? "Processing..." : "Compress PDF"}
              </CustomButton>
            </div>
          </>
        )}

        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          <Shield size={18} />
          Your files remain private
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