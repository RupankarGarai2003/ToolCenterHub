"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Lock, RotateCcw, FileText } from "lucide-react";

export default function PDFProtect() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [protectedUrl, setProtectedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setProtectedUrl(null);
    }
  };

  const protectPDF = async () => {
    if (!file || !password) return;

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      const protectedBytes = await pdfDoc.save({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: "highResolution",
          modifying: false,
          copying: false,
          annotating: false,
        },
      });

      const blob = new Blob([protectedBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      setProtectedUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!protectedUrl) return;

    const a = document.createElement("a");
    a.href = protectedUrl;
    a.download = "protected.pdf";
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPassword("");
    setProtectedUrl(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Protect PDF</h1>

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

        {file && !protectedUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
              <FileText />
              <p className="font-medium">{file.name}</p>
            </div>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <button
              onClick={protectPDF}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Protecting..." : "Protect PDF"}
            </button>
          </div>
        )}

        {protectedUrl && (
          <div className="space-y-4 text-center">
            <p className="text-green-600">PDF protected successfully</p>

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
              <RotateCcw className="inline mr-2" size={16} /> Start Over
            </button>
          </div>
        )}

        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          <Lock size={12} /> Your files remain private and secure.
        </p>
      </div>
    </div>
  );
}
