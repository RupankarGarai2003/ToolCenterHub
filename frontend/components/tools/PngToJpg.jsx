"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Download } from "lucide-react";

export default function PngToJpg() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);

  const [quality, setQuality] = useState(0.9);

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

    if (!selected.type.includes("png")) {
      alert("Please upload a PNG image");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        setPreview(reader.result);
        setFile(selected);
        setConverted(null);

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
    setConverted(null);

    setFileInfo({
      name: "",
      size: "",
      width: 0,
      height: 0,
    });
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

      // ⚠️ JPG does not support transparency → add white background
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
    <div className="max-w-md mx-auto space-y-8">

      {/* UPLOADER */}
      <ImageUploader
        preview={preview}
        fileInfo={fileInfo}
        onChange={handleChange}
        onRemove={handleRemove}
      />

      {/* PREVIEW */}
      {preview && !converted && (
        <div className="text-center">
          <img src={preview} className="mx-auto max-h-50 rounded-2xl" />
        </div>
      )}

      {/* 🎛 QUALITY */}
      {preview && !converted && (
        <div className="text-center">
          <p className="mb-2">
            Quality: {Math.round(quality * 100)}%
          </p>
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

      {/* CONVERT */}
      {preview && !converted && (
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            className="custom-btn font-bold text-sm"
          >
            {loading ? "Converting..." : "Convert to JPG"}
          </button>
        </div>
      )}

      {/* RESULT */}
      {converted && (
        <div className="text-center space-y-6">
          <img src={converted} className="mx-auto max-h-50 rounded-2xl" />

          <div className="flex justify-center gap-6">
            <button
              onClick={handleDownload}
              className="download-btn"
            >
              <Download className="w-5 h-5" />

              {/* Tooltip */}
              <span className="download-tooltip">Download</span>
            </button>

            <button
              onClick={handleRemove}
              className="custom-btn font-bold text-sm"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}

    </div>
  );
}