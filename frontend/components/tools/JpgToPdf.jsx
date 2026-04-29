"use client";
import HowToUse from "@/components/tool-content/HowToUse";
import FAQ from "@/components/tool-content/FAQ";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Trash2, Image as ImageIcon } from "lucide-react";

export default function JPGtoPDF() {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const imgs = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );

    const previews = imgs.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);
    setPdfUrl(null);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const createPDF = async () => {
    if (images.length === 0) return;

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

      const { width, height } = embedded.scale(1);

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(embedded, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setLoading(false);
  };

  const download = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "images.pdf";
    a.click();
  };

  const reset = () => {
    setImages([]);
    setPdfUrl(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">JPG to PDF</h1>

        {/* Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50"
        >
          <Upload className="mx-auto mb-2" />
          <p className="text-sm">Upload Images</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative border rounded-lg overflow-hidden">
                <img src={img.url} alt="preview" className="w-full h-40 object-cover" />
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

        {/* Actions */}
        {images.length > 0 && !pdfUrl && (
          <button
            onClick={createPDF}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Creating PDF..." : "Convert to PDF"}
          </button>
        )}

        {/* Result */}
        {pdfUrl && (
          <div className="space-y-4 text-center">
            <p className="text-green-600">PDF created successfully</p>

            <button
              onClick={download}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              <Download className="inline mr-2" size={16} /> Download PDF
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
          🔒 Your files remain private and are processed in your browser.
        </p>
        {/* ✅ CONTENT BELOW TOOL */}
        <div className="max-w-3xl w-full mt-16 space-y-10">
          <HowToUse />
          <FAQ />
        </div>

      </div>

    </div>


  );

}
