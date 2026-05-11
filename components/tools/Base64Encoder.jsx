"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Clipboard,
  Check,
  RotateCcw,
  Download,
  FileText,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";


export default function Base64Encoder() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);

  // Encode text
  const encodeText = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setOutput(encoded);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle file upload
  const handleFile = (file) => {
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setOutput(base64);
    };

    reader.readAsDataURL(file);
  };

  // Copy
  const copyToClipboard = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // Download
  const downloadFile = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "base64.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  // Reset
  const resetFields = () => {
    setText("");
    setOutput("");
    setFileName("");
  };

  return (
    <>
    <div className="bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        {/* Text Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Enter Text
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to encode into Base64..."
            className="w-full h-36 rounded-xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* File Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="mb-5 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition"
        >
          <Upload
            size={26}
            className="mx-auto mb-3 text-blue-600"
          />

          <p className="text-sm font-medium text-gray-700">
            Upload File to Encode
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Click here to upload any file
          </p>

          {fileName && (
            <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700">
              <FileText size={16} />
              {fileName}
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) =>
              handleFile(e.target.files?.[0])
            }
          />
        </div>

        {/* Output */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Base64 Output
          </label>

          <textarea
            value={output}
            readOnly
            placeholder="Encoded Base64 output will appear here..."
            className="w-full h-36 rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none font-mono"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={encodeText}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Encode Text
          </button>

          <button
            onClick={copyToClipboard}
            disabled={!output}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={downloadFile}
            disabled={!output}
            className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>

          <button
            onClick={resetFields}
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
          <span className="inline-block text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
            🔒 Encoding happens locally in your browser.
          </span>
        </div>
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