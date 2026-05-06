"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Download } from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function JpgToPng() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ IMPORTANT
  // your ImageUploader expects fileData
  // and should be null initially
  const [fileData, setFileData] = useState(null);

  // 📥 HANDLE FILE
  const handleChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // ✅ Support jpg + jpeg
    if (
      !selected.type.includes("jpeg") &&
      !selected.type.includes("jpg")
    ) {
      alert("Please upload a JPG image");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        setPreview(event.target.result);
        setFile(selected);
        setConverted(null);

        // ✅ uploader data
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

  // ❌ REMOVE IMAGE
  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setConverted(null);

    // ✅ reset
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

      ctx.drawImage(bitmap, 0, 0);

      const png = canvas.toDataURL("image/png");

      setConverted(png);
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
    link.download = `${base}.png`;

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

        {/* PREVIEW */}
        {preview && !converted && (
          <div className="text-center">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-50 rounded-2xl"
            />
          </div>
        )}

        {/* CONVERT BUTTON */}
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
                {loading ? "Converting..." : "Convert to PNG"}
              </span>

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

        {/* RESULT */}
        {converted && (
          <div className="text-center space-y-6">
            <img
              src={converted}
              alt="Converted"
              className="mx-auto max-h-40 rounded-2xl shadow-lg"
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
                Download PNG
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