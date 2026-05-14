"use client";

import { useState } from "react";
import {
  Clipboard,
  Check,
  RotateCcw,
  Download,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";


export default function URLEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  

  const encodeURL = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const downloadFile = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "encoded-url.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const resetFields = () => {
    setInput("");
    setOutput("");
  };

  return (
    <>
    <div className="bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        {/* Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Enter URL or Text
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/search?q=hello world"
            className="w-full h-36 rounded-xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* Output */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Encoded Result
          </label>

          <textarea
            value={output}
            readOnly
            placeholder="Encoded URL will appear here..."
            className="w-full h-36 rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={encodeURL}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Encode URL
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