"use client";

import { useState, useRef } from "react";
import { Upload, Download, RotateCcw, FileText } from "lucide-react";

// We will dynamically load pdf.js to avoid SSR issues
const loadPdfJs = async () => {
  const pdfjsLib = await import("pdfjs-dist/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"; // make sure this file exists in /public
  return pdfjsLib;
};

export default function PDFtoJPG() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setImages([]);
      setProgress(0);
    }
  };

  const convertToImages = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      const results = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 2 }); // higher = better quality
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

        results.push({
          url: dataUrl,
          name: `${file.name.replace(/\.pdf$/i, "")}_page_${i}.jpg`,
        });

        setProgress(Math.round((i / totalPages) * 100));
        await new Promise((r) => setTimeout(r, 0));
      }

      setImages(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    for (const img of images) {
      const a = document.createElement("a");
      a.href = img.url;
      a.download = img.name;
      a.click();
      await new Promise((r) => setTimeout(r, 150));
    }
  };

  const reset = () => {
    setFile(null);
    setImages([]);
    setProgress(0);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">PDF to JPG</h1>

        {!file && (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50"
          >
            <Upload className="mx-auto mb-2" />
            <p className="text-sm">Upload PDF</p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {file && images.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
              <FileText />
              <div>
                <p className="font-medium">{file.name}</p>
              </div>
            </div>

            {loading && (
              <div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1">{progress}%</p>
              </div>
            )}

            <button
              onClick={convertToImages}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Convert to JPG
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-4">
            <p className="text-green-600 text-center">Conversion complete</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
              {images.map((img, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <img src={img.url} alt="preview" className="w-full h-40 object-cover" />
                  <a
                    href={img.url}
                    download={img.name}
                    className="block text-center text-blue-600 text-sm py-1"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={downloadAll}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              <Download className="inline mr-2" size={16} /> Download All
            </button>

            <button
              onClick={reset}
              className="w-full border py-2 rounded-lg"
            >
              <RotateCcw className="inline mr-2" size={16} /> Start Over
            </button>
          </div>
        )}

        <p className="text-xs text-center text-gray-500">
          🔒 Your files remain private and are processed in your browser.
        </p>
      </div>
    </div>
  );
}
