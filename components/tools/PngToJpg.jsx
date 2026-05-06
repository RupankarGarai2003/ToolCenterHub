"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Download } from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function PngToJpg() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);

  const [quality, setQuality] = useState(0.9);

  // ✅ uploader data
  const [fileData, setFileData] = useState(null);

  // 📥 HANDLE FILE
  const handleChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!selected.type.includes("png")) {
      alert("Please upload a PNG image");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        setPreview(event.target.result);
        setFile(selected);
        setConverted(null);

        setFileData({
          name: selected.name,
          size: (selected.size / 1024).toFixed(1) + " KB",
          width: img.width,
          height: img.height,
        });
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(selected);
  };

  // ❌ REMOVE
  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setConverted(null);

    setFileData(null);
  };

  // 🔄 CONVERT
  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const bitmap = await createImageBitmap(file);

      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext("2d");

      // JPG background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(bitmap, 0, 0);

      const jpg = canvas.toDataURL("image/jpeg", quality);

      setConverted(jpg);
    } catch (e) {
      alert("Conversion failed");
    }

    setLoading(false);
  };

  // 📥 DOWNLOAD
  const handleDownload = () => {
    const link = document.createElement("a");

    const base = file.name.split(".")[0];

    link.href = converted;
    link.download = `${base}.jpg`;

    link.click();
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-8">

        {/* UPLOADER */}
        <ImageUploader
          preview={preview}
          fileData={fileData}
          onChange={handleChange}
          onRemove={handleRemove}
        />

        {/* 🎛 QUALITY */}
        {preview && !converted && (
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Quality: {Math.round(quality * 100)}%
            </p>

            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-64 accent-cyan-500 cursor-pointer"
            />
          </div>
        )}

        {/* 🔄 CONVERT BUTTON */}
        {preview && !converted && (
          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              disabled={loading}
              className="
                relative overflow-hidden
                px-8 py-3 rounded-2xl
                font-bold text-sm text-white
                bg-gradient-to-r from-blue-500 to-cyan-500
                shadow-lg shadow-cyan-500/30
                transition-all duration-300
                hover:scale-105 hover:shadow-cyan-500/50
                active:scale-95
                disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              <span className="relative z-10">
                {loading ? "Converting..." : "Convert to JPG"}
              </span>

              {/* Glow */}
              <div
                className="
                  absolute inset-0
                  bg-white/10
                  opacity-0 hover:opacity-100
                  transition-opacity duration-300
                "
              ></div>
            </button>
          </div>
        )}

        {/* ✅ RESULT */}
        {converted && (
          <div className="text-center space-y-6">
            <img
              src={converted}
              alt="Converted"
              className="mx-auto max-h-50 rounded-2xl shadow-lg"
            />

            <div className="flex justify-center gap-6">
              
              {/* DOWNLOAD */}
              <button
                onClick={handleDownload}
                className="
                  flex items-center justify-center gap-2
                  px-6 py-3 rounded-2xl
                  bg-gradient-to-r from-emerald-500 to-green-500
                  text-white font-bold text-sm
                  shadow-lg shadow-green-500/30
                  transition-all duration-300
                  hover:scale-105 hover:shadow-green-500/50
                  active:scale-95
                "
              >
                <Download className="w-5 h-5" />
                Download JPG
              </button>

              {/* RESET */}
              <button
                onClick={handleRemove}
                className="
                  px-6 py-3 rounded-2xl
                  bg-gray-200 dark:bg-zinc-800
                  text-gray-800 dark:text-white
                  font-bold text-sm
                  transition-all duration-300
                  hover:scale-105 hover:bg-gray-300
                  dark:hover:bg-zinc-700
                  active:scale-95
                "
              >
                Convert Another
              </button>
            </div>
          </div>
        )}
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