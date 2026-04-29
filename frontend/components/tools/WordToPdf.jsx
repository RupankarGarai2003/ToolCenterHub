"use client";

import { useState } from "react";
import mammoth from "mammoth";
import html2pdf from "html2pdf.js";
import ImageUploader from "./ImageUploader";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 📥 PROCESS FILE
  const processFile = async (file) => {
    if (!file.name.endsWith(".docx")) {
      alert("Upload .docx file only");
      return;
    }

    setFile(file);
    setLoading(true);

    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.convertToHtml({
      arrayBuffer,
    });

    setHtmlContent(result.value);
    setLoading(false);
  };

  // 📂 INPUT
  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  // 🔥 DRAG DROP
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ❌ REMOVE
  const handleRemove = () => {
    setFile(null);
    setHtmlContent("");
  };

  // 📄 DOWNLOAD
  const handleDownload = () => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "converted.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4" },
      })
      .save();
  };

  return (
    <>
      {/* 🔹 TOOL SECTION */}
      <div className="container">
       


          {/* ✅ REUSED UPLOADER */}
          <ImageUploader
            preview={null}
            type="document"
            fileData={
              file
                ? {
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(2)} KB`,
                  }
                : null
            }
            onChange={handleChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onRemove={handleRemove}
          />

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-500">
              Converting...
            </p>
          )}

          {/* Download */}
          {htmlContent && (
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Download PDF
            </button>
          )}

          {/* <p className="text-xs text-center text-gray-500">
            🔒 Your files remain private and processed in browser.
          </p> */}
        
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