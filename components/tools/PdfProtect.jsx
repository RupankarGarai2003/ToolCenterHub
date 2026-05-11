"use client";

import { useState } from "react";
import { Lock, Upload, Download, ShieldCheck } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function PDFProtect() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // UPLOAD FILE
  const handleFile = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
  };

  // PROTECT PDF
  const protectPDF = async () => {
    if (!file || !password) {
      alert("Please upload PDF and enter password");
      return;
    }

    try {
      setLoading(true);

      const bytes = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(bytes);

      // ENCRYPT PDF
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: "highResolution",
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });

      const protectedPdf = await pdfDoc.save();

      const blob = new Blob([protectedPdf], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "protected.pdf";

      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to protect PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-5">

      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-3xl bg-red-100 text-red-500 flex items-center justify-center mb-4">
            <Lock size={40} />
          </div>

          <h1 className="text-4xl font-black text-gray-900">
            PDF Protect
          </h1>

          <p className="text-gray-500 mt-3">
            Secure your PDF files with a password instantly.
          </p>
        </div>

        {/* UPLOAD */}
        <div className="mb-6">

          <label className="border-2 border-dashed border-gray-300 rounded-3xl h-[180px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">

            <Upload size={42} className="mb-3 text-gray-500" />

            <p className="font-semibold text-lg">
              Upload PDF File
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Select your PDF document
            </p>

            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFile}
            />
          </label>

          {file && (
            <div className="mt-4 bg-gray-50 rounded-2xl p-4 text-sm font-medium">
              {file.name}
            </div>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-8">

          <label className="font-bold text-lg mb-3 block">
            Enter Password
          </label>

          <input
            type="password"
            placeholder="Enter secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-red-100"
          />
        </div>

        {/* ACTION */}
        <button
          onClick={protectPDF}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition"
        >
          {loading ? (
            "Protecting PDF..."
          ) : (
            <>
              <ShieldCheck size={22} />
              Protect PDF
            </>
          )}
        </button>
      </div>
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