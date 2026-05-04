"use client";

import { useState } from "react";
import * as csso from "csso";
import { Clipboard, Check, Download, RotateCcw } from "lucide-react";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function CSSMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleMinify = () => {
    if (!input.trim()) return;

    try {
      setError("");

      const result = csso.minify(input);
      setOutput(result.css);
    } catch (err) {
      console.error(err);
      setError("Invalid CSS");
      setOutput("");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.css";
    a.click();

    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          CSS Minifier
        </h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSS..."
          className="w-full h-52 p-4 border rounded-xl font-mono text-sm"
        />

        <textarea
          value={output}
          readOnly
          placeholder="Minified CSS..."
          className="w-full h-52 p-4 border rounded-xl font-mono text-sm bg-gray-50"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleMinify}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Minify CSS
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
          🔒 Processed in browser (no fs error 😄)
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