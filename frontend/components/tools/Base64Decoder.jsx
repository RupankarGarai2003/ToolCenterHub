"use client";

import { useState } from "react";
import { Clipboard, Check, RotateCcw, Download } from "lucide-react";

export default function Base64Decoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const decodeText = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err) {
      setOutput("Invalid Base64 string");
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

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "decoded.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Base64 Decoder</h1>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Base64 string here..."
          className="w-full h-40 p-4 border rounded-xl font-mono text-sm"
        />

        {/* Output */}
        <textarea
          value={output}
          readOnly
          placeholder="Decoded output will appear here..."
          className="w-full h-40 p-4 border rounded-xl font-mono text-sm bg-gray-50"
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={decodeText}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Decode
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
          🔒 Decoding happens in your browser. No data is uploaded.
        </p>
      </div>
    </div>
  );
}
