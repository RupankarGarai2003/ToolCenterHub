"use client";

import { useState, useRef } from "react";
import ImageUploader from "./ImageUploader";
import { Download } from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function ImageCropper() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [cropped, setCropped] = useState(null);

  const [fileInfo, setFileInfo] = useState({
    name: "",
    size: "",
    width: 0,
    height: 0,
  });

  const [ratio, setRatio] = useState("1:1");
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");

  const canvasRef = useRef(null);

  // 📥 HANDLE FILE
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please upload an image");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        setPreview(reader.result);
        setFile(selected);
        setCropped(null);

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
    setCropped(null);
  };

  // 🔄 CROP LOGIC
  const handleCrop = () => {
    if (!preview) return;

    const img = new Image();
    img.src = preview;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      let cropW, cropH;

      if (ratio === "custom" && customW && customH) {
        cropW = Number(customW);
        cropH = Number(customH);
      } else {
        const [wRatio, hRatio] = ratio.split(":").map(Number);

        const scale = Math.min(
          img.width / wRatio,
          img.height / hRatio
        );

        cropW = wRatio * scale;
        cropH = hRatio * scale;
      }

      const sx = (img.width - cropW) / 2;
      const sy = (img.height - cropH) / 2;

      canvas.width = cropW;
      canvas.height = cropH;

      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

      const result = canvas.toDataURL("image/png");
      setCropped(result);
    };
  };

  // 📥 DOWNLOAD
  const handleDownload = () => {
    const link = document.createElement("a");
    const base = file.name.split(".")[0];

    link.href = cropped;
    link.download = `${base}-cropped.png`;
    link.click();
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-8">

        {/* UPLOADER */}
        <ImageUploader
          preview={preview}
          fileInfo={fileInfo}
          onChange={handleChange}
          onRemove={handleRemove}
        />

        {/* PREVIEW */}
        {preview && !cropped && (
          <div className="text-center">
            <img src={preview} className="mx-auto max-h-60 rounded-2xl" />
          </div>
        )}

        {/* 🎯 RATIO OPTIONS */}
        {preview && !cropped && (
          <div className="text-center space-y-4">

            <div className="flex justify-center gap-3">
              {["1:1", "16:9", "4:3", "custom"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={`px-4 py-2 rounded border ${ratio === r ? "bg-blue-600 text-white" : ""
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* CUSTOM SIZE */}
            {ratio === "custom" && (
              <div className="flex justify-center gap-2">
                <input
                  type="number"
                  placeholder="Width"
                  value={customW}
                  onChange={(e) => setCustomW(e.target.value)}
                  className="border px-3 py-1 rounded w-24"
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={customH}
                  onChange={(e) => setCustomH(e.target.value)}
                  className="border px-3 py-1 rounded w-24"
                />
              </div>
            )}
          </div>
        )}

        {/* CROP BUTTON */}
        {preview && !cropped && (
          <div className="flex justify-center">
            {/* <button
            onClick={handleCrop}
            className="custom-btn font-bold text-sm"
          >
            Crop Image
          </button> */}

            <CustomButton

              onClick={handleCrop}
              animation="ripple"
              btnSize="md"
              variant="success"
            >
              Convert Now
            </CustomButton>



          </div>
        )}

        {/* RESULT */}
        {cropped && (
          <div className="text-center space-y-6">
            <img src={cropped} className="mx-auto max-h-72 rounded" />

            <div className="flex justify-center gap-6">
              {/* <button
                onClick={handleDownload}
                className="download-btn"
              >
                <Download className="w-5 h-5" />

             
                <span className="download-tooltip">Download</span>
              </button>

              <button
                onClick={handleRemove}
                className="custom-btn font-bold text-sm"
              >
                Convert Another
              </button> */}


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

        <canvas ref={canvasRef} className="hidden" />
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