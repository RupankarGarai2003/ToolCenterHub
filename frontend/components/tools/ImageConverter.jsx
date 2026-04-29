"use client";

import { useState } from "react";
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

  const [fileInfo, setFileInfo] = useState({
    name: "",
    size: "",
    width: 0,
    height: 0,
    format: "",
  });

  const [fromFormat, setFromFormat] = useState("JPG");
  const [toFormat, setToFormat] = useState("PNG");

  const [quality, setQuality] = useState(0.9);

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const formats = ["JPG", "PNG", "WEBP"];

  const formatMap = {
    JPG: "image/jpeg",
    PNG: "image/png",
    WEBP: "image/webp",
  };

  // ✅ PROCESS FILE
  const processFile = (selected) => {
    if (!selected.type.startsWith("image/")) {
      alert("Please upload a valid image!");
      return;
    }

    setPreview(null);
    setFile(null);
    setConverted(null);

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const detected = selected.type.split("/")[1].toUpperCase();
        const normalized = detected === "JPEG" ? "JPG" : detected;

        setPreview(reader.result);
        setFile(selected);

        setFileInfo({
          name: selected.name,
          size: (selected.size / 1024).toFixed(1) + " KB",
          width: img.width,
          height: img.height,
          format: normalized,
        });

        setFromFormat(normalized);
      };
    };

    reader.readAsDataURL(selected);
  };

  const handleRemove = () => {
    setPreview(null);
    setImage(null);
    setResized(null);
    setCompressionRatio(0);
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

    setFileInfo({
      name: "",
      size: "",
      width: 0,
      height: 0,
      format: "",
    });

    setFromFormat("JPG");
    setToFormat("PNG");
    setQuality(0.9);
  };

  const filterFormats = (list, search) =>
    list.filter((f) => f.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="container space-y-10">

        {/* 🔽 DROPDOWNS */}
        <div className="flex justify-center items-center gap-4">

          {/* FROM */}
          <div className="relative">
            <button
              onClick={() => {
                setOpenFrom(!openFrom);
                setOpenTo(false);
              }}
              className="px-5 py-2 border rounded-full bg-white shadow"
            >
              {fromFormat} ▼
            </button>

            {openFrom && (
              <div className="absolute mt-2 w-60 bg-white border rounded-xl shadow-lg p-4 z-10">
                <input
                  placeholder="Search Format"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-3"
                />

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {filterFormats(formats, searchFrom).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFromFormat(f);
                        setOpenFrom(false);
                      }}
                      className={`border rounded-full px-2 py-1 text-sm ${fromFormat === f
                        ? "border-blue-600 text-blue-600"
                        : ""
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span>→</span>

          {/* TO */}
          <div className="relative">
            <button
              onClick={() => {
                setOpenTo(!openTo);
                setOpenFrom(false);
              }}
              className="px-5 py-2 border rounded-full bg-white shadow"
            >
              {toFormat} ▼
            </button>

            {openTo && (
              <div className="absolute mt-2 w-60 bg-white border rounded-xl shadow-lg p-4 z-10">
                <input
                  placeholder="Search Format"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-3"
                />

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {filterFormats(formats, searchTo).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setToFormat(f);
                        setOpenTo(false);
                      }}
                      className={`border rounded-full px-2 py-1 text-sm ${toFormat === f
                        ? "border-blue-600 text-blue-600"
                        : ""
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 🎛 QUALITY */}
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

        {/* ✅ REUSABLE UPLOADER */}

        <ImageUploader
          preview={preview}
          fileInfo={fileInfo}
          onChange={handleChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
        />

        {/* 🔄 CONVERT */}
        {preview && !converted && (
          <div className="font-bold text-sm flex justify-center">

            <CustomButton

              onClick={handleConvert}
              animation="ripple"
              btnSize="md"
              variant="success"
            >
              Convert Now
            </CustomButton>
          </div>
        )}

        {/* 📥 RESULT */}
        {converted && (
          <div className="text-center space-y-6">
            <img src={converted} className="mx-auto max-h-60 rounded-2xl" />
            <div className="flex justify-center items-center gap-3">

            <CustomButton

              onClick={handleReset}
              animation="ripple"
              btnSize="md"
            >
              Convert Another Image
            </CustomButton>

            <CustomButton variant="download" onClick={handleDownload} animation="bounce" />


            </div>
          </div>
        )}
      </div>
      {/* 🔹 CONTENT SECTION */}
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