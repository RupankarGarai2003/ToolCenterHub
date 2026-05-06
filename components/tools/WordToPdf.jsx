"use client";

import { useState, useRef } from "react";
import mammoth from "mammoth";
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
  const processFile = async (selectedFile) => {
    if (!selectedFile.name.endsWith(".docx")) {
      alert("Upload .docx file only");
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setHtmlContent("");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (error) {
      console.error("Mammoth conversion error:", error);
      alert("Failed to read the Word document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = () => {
    setFile(null);
    setHtmlContent("");
  };

  // 📄 DOWNLOAD PDF
  const handleDownload = async () => {
    if (!htmlContent) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // ✅ KEY FIX: Create a temp container appended directly to document.body.
      // html2canvas CANNOT render elements that are:
      //   - positioned at left: -99999px (too far offscreen)
      //   - display: none
      //   - visibility: hidden
      // Using opacity: 0 + z-index: -9999 keeps it invisible to the user
      // while still being fully renderable by html2canvas.
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 794px;
        background: #ffffff;
        color: #000000;
        font-family: serif;
        font-size: 12pt;
        line-height: 1.6;
        padding: 40px;
        z-index: -9999;
        pointer-events: none;
        opacity: 0;
      `;
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      const filename = file
        ? file.name.replace(/\.docx$/i, ".pdf")
        : "converted.pdf";

      await html2pdf()
        .from(container)
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 794, // matches container width for correct layout
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .save();

      // ✅ Always clean up the temp element
      document.body.removeChild(container);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("PDF generation failed. Please try again.");
    }
  };

  return (
    <>
      {/* 🔹 TOOL SECTION */}
      <div className="container">

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

        {loading && (
          <p className="text-center text-gray-500 mt-2">
            Converting, please wait...
          </p>
        )}

        {htmlContent && !loading && (
          <button
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-2 rounded-lg mt-4"
          >
            Download PDF
          </button>
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