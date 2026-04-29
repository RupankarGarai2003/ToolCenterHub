"use client";

import { useState } from "react";
import { Clipboard, Check, RotateCcw, Download, Shield } from "lucide-react";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
    } catch (err) {
      setError("Invalid JSON");
      setOutput("");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
    } catch (err) {
      setError("Invalid JSON");
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadJSON = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen flex  justify-center p-6 ">
      <div className="w-full max-w-5xl bg-white rounded-3xl p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-80 p-4 border border-dashed border-blue-500 rounded-xl font-semibold text-sm outline-none"
          />

          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full h-80 p-4 border border-dashed border-blue-500 rounded-xl font-semibold text-sm bg-gray-50 outline-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={formatJSON}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold text-sm"
          >
            Format JSON
          </button>

          <button
            onClick={minifyJSON}
            className="bg-gray-700 text-white px-6 py-2 rounded-full font-semibold text-sm"
          >
            Minify
          </button>

          <button
            onClick={copyToClipboard}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={downloadJSON}
            className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2"
          >
            <Download size={16} /> Download
          </button>

          <button
            onClick={reset}
            className="border px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          <Shield size={18} />
          Your files remain private
        </p>
      </div>
    </div>
  );
}
