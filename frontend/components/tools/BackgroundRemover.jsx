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


export default function BackgroundRemover() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [slider, setSlider] = useState(50);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [shadow, setShadow] = useState(false);
  const [blur, setBlur] = useState(0);
  const [format, setFormat] = useState("png");

  const [fileInfo, setFileInfo] = useState({
    name: "",
    size: "",
    width: 0,
    height: 0,
  });

  // 📥 Upload
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        setPreview(reader.result);
        setFile(selected);
        setResult(null);

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

  // ❌ Reset
  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
  };

  // 🤖 AI REMOVE BG
  const handleRemoveBg = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setResult(url);
    } catch {
      alert("Failed");
    }

    setLoading(false);
  };

  // 📥 Download with format
  const handleDownload = async () => {
    const img = new Image();
    img.src = result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (format !== "png") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);

      const mime =
        format === "jpg"
          ? "image/jpeg"
          : format === "webp"
            ? "image/webp"
            : "image/png";

      const data = canvas.toDataURL(mime);

      const link = document.createElement("a");
      link.href = data;
      link.download = `output.${format}`;
      link.click();
    };
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-10">

        {/* TITLE */}
        {/* <div className="text-center">
        <h1 className="text-4xl font-bold">
          Remove Background (AI)
        </h1>
        <p className="text-gray-500">
          Advanced editor with preview and effects
        </p>
      </div> */}

        {/* UPLOADER */}
        <ImageUploader
          preview={preview}
          fileInfo={fileInfo}
          onChange={handleChange}
          onRemove={handleRemove}
        />

        {/* PREVIEW + SLIDER */}
        {preview && (
          <div className="flex justify-center">

            <div className="relative w-80 h-[250px] overflow-hidden rounded-2xl shadow">

              {/* BEFORE */}
              <img
                src={preview}
                className="absolute w-full h-full object-cover"
              />

              {/* AFTER */}
              {result && (
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden"
                  style={{ width: `${slider}%` }}
                >
                  <img
                    src={result}
                    className={`w-full h-full object-cover ${shadow ? "drop-shadow-lg" : ""
                      }`}
                    style={{ filter: `blur(${blur}px)` }}
                  />
                </div>
              )}

              {/* SLIDER LINE */}
              {result && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white"
                  style={{ left: `${slider}%` }}
                />
              )}

              {/* LOADER */}
              {loading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* SLIDER CONTROL */}
        {result && (
          <div className="text-center">
            <input
              type="range"
              min="0"
              max="100"
              value={slider}
              onChange={(e) => setSlider(e.target.value)}
              className="w-64"
            />
          </div>
        )}

        {/* ACTION BUTTON */}
        {preview && !result && (
          <div className="flex justify-center">


            <CustomButton
              onClick={handleRemoveBg}
              animation="ripple"
              btnSize="md"
              loading={loading}
            >
              Remove Background
            </CustomButton>
          </div>
        )}

        {/* EDIT OPTIONS */}
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

            {/* BG COLOR */}
            <div>
              <p className="text-sm">Background</p>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>

            {/* SHADOW */}
            <div>
              <p className="text-sm">Shadow</p>
              <input
                type="checkbox"
                checked={shadow}
                onChange={() => setShadow(!shadow)}
              />
            </div>

            {/* BLUR */}
            <div>
              <p className="text-sm">Blur</p>
              <input
                type="range"
                min="0"
                max="10"
                value={blur}
                onChange={(e) => setBlur(e.target.value)}
              />
            </div>

            {/* FORMAT */}
            <div>
              <p className="text-sm">Format</p>
              <select
                onChange={(e) => setFormat(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>

          </div>
        )}

        {/* DOWNLOAD */}
        {result && (
          <div className="text-center space-y-4">

            <div className="flex justify-center gap-6">

              <CustomButton
                onClick={handleRemove}
                animation="ripple"
                btnSize="md"
                variant="secondary"
              >
                Convert Another
              </CustomButton>

              <CustomButton variant="download" onClick={handleDownload} animation="bounce" />
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