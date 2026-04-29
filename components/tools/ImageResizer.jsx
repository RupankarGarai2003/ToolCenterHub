"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Download } from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function ImageResizer() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [resized, setResized] = useState(null);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percent, setPercent] = useState(100);

  const [lockRatio, setLockRatio] = useState(true);

  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);

  const [original, setOriginal] = useState({ w: 0, h: 0 });

  const [fileInfo, setFileInfo] = useState({
    name: "",
    size: "",
    width: 0,
    height: 0,
  });

  // 📥 HANDLE FILE
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Upload a valid image");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        setPreview(reader.result);
        setFile(selected);
        setResized(null);

        setOriginal({ w: img.width, h: img.height });

        setWidth(img.width);
        setHeight(img.height);

        setFileInfo({
          name: selected.name,
          size: (selected.size / 1024).toFixed(1) + " KB",
          width: img.width,
          height: img.height,
        });
      };
    };

    reader.readAsDataURL(selected);
  };

  // ❌ REMOVE
  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setResized(null);
  };

  // 🔄 WIDTH CHANGE
  const handleWidthChange = (val) => {
    setWidth(val);
    if (lockRatio) {
      const ratio = original.h / original.w;
      setHeight(Math.round(val * ratio));
    }
  };

  // 🔄 HEIGHT CHANGE
  const handleHeightChange = (val) => {
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

  // 🔄 RESIZE
  const handleResize = () => {
    const img = new Image();
    img.src = preview;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
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
      <div className="max-w-md mx-auto space-y-10">

        {/* TITLE */}


        {/* UPLOADER */}
        <ImageUploader
          preview={preview}
          fileInfo={fileInfo}
          onChange={handleChange}
          onRemove={handleRemove}
        />

        {/* CONTROLS */}
        {preview && !resized && (
          <div className="bg-white rounded-xl p-6 shadow space-y-8">

            {/* SIZE SECTION */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">
                Set Image Dimensions
              </h3>
              <p className="text-sm text-gray-500">
                Enter width and height in pixels
              </p>

              <div className="flex justify-center items-end gap-4">

                <div>
                  <label className="text-sm text-gray-600">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="border px-3 py-2 rounded w-28 mt-1"
                  />
                </div>

                <button
                  onClick={() => setLockRatio(!lockRatio)}
                  title="Lock aspect ratio"
                  className="text-2xl mb-2"
                >
                  {lockRatio ? "🔒" : "🔓"}
                </button>

                <div>
                  <label className="text-sm text-gray-600">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="border px-3 py-2 rounded w-28 mt-1"
                  />
                </div>

              </div>

              <p className="text-xs text-gray-400">
                🔒 Keeps width & height proportional
              </p>
            </div>

            {/* PERCENT */}
            <div className="text-center space-y-2">
              <h3 className="font-medium">Resize by Percentage</h3>

              <input
                type="range"
                min="10"
                max="100"
                value={percent}
                onChange={(e) => handlePercent(Number(e.target.value))}
                className="w-64"
              />

              <p className="text-sm">{percent}%</p>
            </div>

            {/* FORMAT */}
            <div className="text-center space-y-2">
              <h3 className="font-medium">Output Format</h3>

              <div className="flex justify-center gap-4">
                <select
                  onChange={(e) => setFormat(e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WEBP</option>
                </select>

                {(format === "image/jpeg" || format === "image/webp") && (
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                )}
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center">

              <CustomButton

                onClick={handleResize}
                animation="ripple"
                btnSize="md"
                variant="success"
              >
                Resize Image
              </CustomButton>
            </div>

          </div>
        )}

        {/* RESULT */}
        {resized && (
          <div className="text-center space-y-6">
            <img src={resized} className="mx-auto max-h-60 rounded-2xl" />

            <div className="flex justify-center gap-6">
             
              <CustomButton

                onClick={handleRemove}
                animation="ripple"
                btnSize="md"
                variant="secondary"
              >
                Reset
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