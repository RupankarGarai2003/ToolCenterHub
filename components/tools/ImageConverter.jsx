"use client";

import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function ImageConverter() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [converted, setConverted] = useState(null);

  const [fileData, setFileData] = useState(null);

  const [fromFormat, setFromFormat] = useState("JPG");
  const [toFormat, setToFormat] = useState("PNG");

  const [quality, setQuality] = useState(0.9);

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const formats = ["JPG", "PNG", "WEBP", "GIF", "BMP", "AVIF"];

  const formatMap = {
    JPG: "image/jpeg",
    PNG: "image/png",
    WEBP: "image/webp",
    GIF: "image/gif",
    BMP: "image/bmp",
    AVIF: "image/avif",
  };

  // cleanup preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setOpenFrom(false);
      setOpenTo(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const processFile = (selected) => {
    if (!selected.type.startsWith("image/")) {
      alert("Please upload a valid image!");
      return;
    }

    setPreview(null);
    setFile(null);
    setConverted(null);

    const objectUrl = URL.createObjectURL(selected);
    const img = new Image();

    img.onload = () => {
      const detected = selected.type.split("/")[1].toUpperCase();
      const normalized = detected === "JPEG" ? "JPG" : detected;

      setPreview(objectUrl);
      setFile(selected);

      setFileData({
        name: selected.name,
        size: (selected.size / 1024).toFixed(1) + " KB",
        width: img.width,
        height: img.height,
        format: normalized,
      });

      setFromFormat(normalized);

      const defaultTarget =
        formats.find((f) => f !== normalized) || "PNG";
      setToFormat(defaultTarget);
    };

    img.src = objectUrl;
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setConverted(null);
    setFileData(null);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    processFile(selected);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    processFile(dropped);
  };

  const handleConvert = async () => {
    if (!file) return;

    if (fromFormat === toFormat) {
      alert("Choose a different format!");
      return;
    }

    const bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    const mime = formatMap[toFormat];

    const result =
      toFormat === "JPG" || toFormat === "WEBP"
        ? canvas.toDataURL(mime, quality)
        : canvas.toDataURL(mime);

    setConverted(result);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    const base = file.name.split(".")[0];

    link.href = converted;
    link.download = `${base}.${toFormat.toLowerCase()}`;
    link.click();
  };

  const handleReset = () => {
    setPreview(null);
    setFile(null);
    setConverted(null);
    setFileData(null);

    setFromFormat("JPG");
    setToFormat("PNG");
    setQuality(0.9);
  };

  return (
    <>
      <div className="container space-y-10">

        {/* ✅ CLEAN DROPDOWN SELECTOR */}
        <div className="flex items-center justify-center gap-4">

          {/* FROM */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenFrom(!openFrom)}
              className="px-5 py-2 rounded-full border bg-white shadow"
            >
              {fromFormat} ▼
            </button>

            {openFrom && (
              <div className="absolute mt-2 bg-white border rounded-xl shadow-lg p-3 flex flex-wrap gap-2 w-64 z-10">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFromFormat(f);
                      setOpenFrom(false);
                    }}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      fromFormat === f
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:border-blue-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xl">→</span>

          {/* TO */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenTo(!openTo)}
              className="px-5 py-2 rounded-full border bg-white shadow"
            >
              {toFormat} ▼
            </button>

            {openTo && (
              <div className="absolute mt-2 bg-white border rounded-xl shadow-lg p-3 flex flex-wrap gap-2 w-64 z-10">
                {formats
                  .filter((f) => f !== fromFormat)
                  .map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setToFormat(f);
                        setOpenTo(false);
                      }}
                      className={`px-3 py-1 rounded-full border text-sm ${
                        toFormat === f
                          ? "bg-green-600 text-white border-green-600"
                          : "hover:border-green-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* QUALITY */}
        {(toFormat === "JPG" || toFormat === "WEBP") && (
          <div className="text-center">
            <p className="mb-2">Quality: {Math.round(quality * 100)}%</p>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-64"
            />
          </div>
        )}

        {/* UPLOADER */}
        <ImageUploader
          preview={preview}
          fileData={fileData}
          onChange={handleChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
        />

        {/* CONVERT */}
        {preview && !converted && (
          <div className="flex justify-center">
            <CustomButton onClick={handleConvert}>
              Convert Now
            </CustomButton>
          </div>
        )}

        {/* RESULT */}
        {converted && (
          <div className="text-center space-y-6">
            <img src={converted} className="mx-auto max-h-60 rounded-2xl" />

            <div className="flex justify-center gap-3">
              <CustomButton onClick={handleReset}>
                Convert Another Image
              </CustomButton>

              <CustomButton
                variant="download"
                onClick={handleDownload}
              />
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