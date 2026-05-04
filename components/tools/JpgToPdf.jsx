"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Trash2 } from "lucide-react";

import ToolLayout from "@/components/ToolLayout";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function JPGtoPDF() {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef(null);

  // 📥 HANDLE FILES
  const handleFiles = (files) => {
    const imgs = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (imgs.length === 0) return;

    // Limit
    if (imgs.length + images.length > 20) {
      alert("Max 20 images allowed");
      return;
    }

    const previews = imgs.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);
    setPdfUrl(null);
  };

  // 📂 INPUT CHANGE
  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  // 🔥 DRAG & DROP
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  // ❌ REMOVE IMAGE
  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].url);
    setImages(images.filter((_, i) => i !== index));
  };

  // 🔄 RESET
  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setPdfUrl(null);
  };

  // 📄 CREATE PDF
  const createPDF = async () => {
    if (images.length === 0) return;

    try {
      setLoading(true);

      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();

        let embedded;
        if (img.file.type === "image/png") {
          embedded = await pdfDoc.embedPng(bytes);
        } else {
          embedded = await pdfDoc.embedJpg(bytes);
        }

        const { width, height } = embedded;

        // Scale to A4 width
        const maxWidth = 595;
        const scale = width > maxWidth ? maxWidth / width : 1;

        const page = pdfDoc.addPage([
          width * scale,
          height * scale,
        ]);

        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: width * scale,
          height: height * scale,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error creating PDF");
    } finally {
      setLoading(false);
    }
  };

  // 📥 DOWNLOAD
  const download = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "images.pdf";
    a.click();
  };

  return (
    <>
      <ToolLayout title="JPG to PDF">
        {/* Upload Box */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            dragging ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"
          }`}
        >
          <Upload className="mx-auto mb-2" />
          <p className="text-sm">
            Click or drag & drop images here
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative border rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  alt="preview"
                  className="w-full h-40 object-cover"
                />

                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Convert */}
        {images.length > 0 && !pdfUrl && (
          <button
            onClick={createPDF}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating PDF..." : "Convert to PDF"}
          </button>
        )}

        {/* Result */}
        {pdfUrl && (
          <div className="space-y-4 text-center">
            <p className="text-green-600 font-medium">
              PDF created successfully 🎉
            </p>

            <button
              onClick={download}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              <Download className="inline mr-2" size={16} />
              Download PDF
            </button>

            <button
              onClick={reset}
              className="w-full border py-2 rounded-lg"
            >
              Start Over
            </button>
          </div>
        )}

        <p className="text-xs text-center text-gray-500">
          🔒 Files are processed in your browser. Nothing is uploaded.
        </p>
      </ToolLayout>

      {/* Content Section */}
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