"use client";

import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import CustomButton from "../tools/CustomButton";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function ImageResizer() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [resized, setResized] = useState(null);

  const [fileData, setFileData] = useState(null);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percent, setPercent] = useState(100);

  const [unit, setUnit] = useState("px");
  const [lockRatio, setLockRatio] = useState(true);

  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.8);

  const [bgColor, setBgColor] = useState("#ffffff");

  const [original, setOriginal] = useState({ w: 0, h: 0 });

  const [estimatedSize, setEstimatedSize] = useState(null);

  // 📥 FILE UPLOAD
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || !selected.type.startsWith("image/")) return;

    const url = URL.createObjectURL(selected);
    const img = new Image();

    img.onload = () => {
      setPreview(url);
      setFile(selected);
      setResized(null);

      setOriginal({ w: img.width, h: img.height });

      setWidth(img.width);
      setHeight(img.height);

      setFileData({
        name: selected.name,
        size: (selected.size / 1024).toFixed(1) + " KB",
        width: img.width,
        height: img.height,
      });
    };

    img.src = url;
  };

  // ❌ RESET
  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setResized(null);
    setFileData(null);
    setEstimatedSize(null);
  };

  // 🔄 WIDTH CHANGE
  const handleWidth = (val) => {
    setWidth(val);
    if (lockRatio) {
      const ratio = original.h / original.w;
      setHeight(Math.round(val * ratio));
    }
  };

  // 🔄 HEIGHT CHANGE
  const handleHeight = (val) => {
    setHeight(val);
    if (lockRatio) {
      const ratio = original.w / original.h;
      setWidth(Math.round(val * ratio));
    }
  };

  // 🔄 PERCENT
  const handlePercent = (val) => {
    setPercent(val);
    const w = (original.w * val) / 100;
    const h = (original.h * val) / 100;

    setWidth(Math.round(w));
    setHeight(Math.round(h));
  };

  // ✅ LIVE ESTIMATE (FIXED)
  useEffect(() => {
    if (!preview || !width || !height) return;

    const timeout = setTimeout(() => {
      const img = new Image();
      img.src = preview;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        const data =
          format === "image/jpeg" || format === "image/webp"
            ? canvas.toDataURL(format, quality)
            : canvas.toDataURL(format);

        const size = Math.round((data.length * 3) / 4 / 1024);

        setEstimatedSize(size);
      };
    }, 200); // debounce

    return () => clearTimeout(timeout);
  }, [width, height, quality, format, bgColor, preview]);

  // 🔄 RESIZE
  const handleResize = () => {
    const img = new Image();
    img.src = preview;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);

      const result =
        format === "image/jpeg" || format === "image/webp"
          ? canvas.toDataURL(format, quality)
          : canvas.toDataURL(format);

      setResized(result);
    };
  };

  // 📥 DOWNLOAD
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resized;
    link.download = "resized-image";
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

        {/* ORIGINAL PREVIEW */}
        {preview && !resized && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Original Image</p>
            <img src={preview} className="mx-auto max-h-60 rounded-xl" />
          </div>
        )}

        {/* CONTROLS */}
        {preview && !resized && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-6">

            <h2 className="text-center font-semibold">
              Choose new size and format
            </h2>

            {/* DIMENSIONS */}
            <div>
              <p className="font-medium text-gray-700 mb-2">Dimensions</p>

              <div className="grid grid-cols-4 gap-3 items-end">
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidth(Number(e.target.value))}
                  className="border p-2 rounded"
                />

                <button onClick={() => setLockRatio(!lockRatio)}>
                  {lockRatio ? "🔒" : "🔓"}
                </button>

                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeight(Number(e.target.value))}
                  className="border p-2 rounded"
                />

                <select
                  onChange={(e) => setUnit(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="px">Pixel</option>
                  <option value="percent">Percent</option>
                </select>
              </div>
            </div>

            {/* SLIDER */}
            {unit === "percent" && (
              <div>
                <p className="text-sm text-gray-500">
                  Resize: {percent}%
                </p>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={percent}
                  onChange={(e) => handlePercent(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}

            {/* FORMAT */}
            <div>
              <p className="font-medium text-gray-700 mb-2">
                Format & Quality
              </p>

              <div className="grid grid-cols-3 gap-4">

                <select
                  onChange={(e) => setFormat(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </select>

                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="accent-blue-600"
                />

                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />

              </div>
            </div>

            {/* SIZE INFO */}
            {fileData && (
              <div className="text-center text-sm text-gray-500">
                Original: {fileData.size} → Estimated: {estimatedSize ?? "-"} KB
              </div>
            )}

            <div className="flex justify-center">
              <CustomButton onClick={handleResize}>
                Resize Image
              </CustomButton>
            </div>
          </div>
        )}

        {/* RESULT */}
        {resized && (
          <div className="space-y-6 text-center">

            <p className="text-sm text-gray-500">Before vs After</p>

            <div className="flex justify-center gap-4">
              <img src={preview} className="w-32 h-32 object-cover rounded" />
              <img src={resized} className="w-32 h-32 object-cover rounded border-2 border-blue-500" />
            </div>

            <img src={resized} className="mx-auto max-h-72 rounded-2xl" />

            <div className="flex justify-center gap-4">
              <CustomButton onClick={handleRemove}>
                Reset
              </CustomButton>

              <CustomButton variant="download" onClick={handleDownload} />
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