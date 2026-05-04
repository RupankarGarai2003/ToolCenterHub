"use client";

import { useState } from "react";
import { Clipboard, Check, Download, RotateCcw } from "lucide-react";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";


export default function HTMLMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // 🧠 MINIFY FUNCTION (SAFE FOR BROWSER)
  const minifyHTML = () => {
    if (!input.trim()) return;

    try {
      let result = input;

      // Remove HTML comments
      result = result.replace(/<!--[\s\S]*?-->/g, "");

      // Remove extra whitespace between tags
      result = result.replace(/>\s+</g, "><");

      // Trim spaces
      result = result.trim();

      // Collapse multiple spaces
      result = result.replace(/\s{2,}/g, " ");

      // Remove line breaks
      result = result.replace(/\n/g, "");

      setOutput(result);
    } catch (err) {
      console.error(err);
      alert("Error minifying HTML");
    }
  };

  // 📋 COPY
  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 📥 DOWNLOAD
  const download = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  // 🔄 RESET
  const reset = () => {
    setInput("");
    setOutput("");
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          HTML Minifier
        </h1>

        {/* INPUT */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your HTML code here..."
          className="w-full h-52 p-4 border rounded-xl font-mono text-sm"
        />

        {/* OUTPUT */}
        <textarea
          value={output}
          readOnly
          placeholder="Minified HTML will appear here..."
          className="w-full h-52 p-4 border rounded-xl font-mono text-sm bg-gray-50"
        />

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={minifyHTML}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Minify HTML
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

        <p className="text-xs text-center text-gray-500">
          🔒 Runs fully in your browser (no server needed)
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