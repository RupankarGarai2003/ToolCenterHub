"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Download, Clipboard, Check, RotateCcw } from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔲 GENERATE QR
  const generateQR = async () => {
    if (!text) return;

    try {
      setLoading(true);
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
      });
      setQr(url);
    } catch (err) {
      console.error(err);
      alert("Error generating QR code");
    } finally {
      setLoading(false);
    }
  };

  // 📋 COPY INPUT
  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 📥 DOWNLOAD QR
  const download = () => {
    if (!qr) return;

    const a = document.createElement("a");
    a.href = qr;
    a.download = "qr-code.png";
    a.click();
  };

  // 🔄 RESET
  const reset = () => {
    setText("");
    setQr("");
  };

  return (
    <>
    <div className=" flex items-center justify-center p-1 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

       

        {/* INPUT */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text, URL, or anything..."
          className="w-full h-32 p-4 border rounded-xl font-mono text-sm"
        />

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={generateQR}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate QR"}
          </button>

          <button
            onClick={copy}
            className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={download}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} /> Download
          </button>

          <button
            onClick={reset}
            className="border px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {/* QR PREVIEW */}
        {qr && (
          <div className="flex justify-center mt-4">
            <img
              src={qr}
              alt="QR Code"
              className="border p-3 rounded-xl bg-white"
            />
          </div>
        )}

        <p className="text-xs text-center text-gray-500">
          🔒 Generated locally in your browser. No data is uploaded.
        </p>
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