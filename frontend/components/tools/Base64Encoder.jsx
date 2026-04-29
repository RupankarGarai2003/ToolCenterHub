"use client";

import { useState, useRef } from "react";
import { Upload, Clipboard, Check, RotateCcw, Download } from "lucide-react";

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
  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Download as txt
  const download = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "base64.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setText("");
    setOutput("");
    setFileName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Base64 Encoder</h1>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encode..."
          className="w-full h-40 p-4 border rounded-xl font-mono text-sm"
        />

        {/* File Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <Upload className="mx-auto mb-2" />
          <p className="text-sm">Upload file to encode</p>
          {fileName && <p className="text-xs text-gray-500 mt-1">{fileName}</p>}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Output */}
        <textarea
          value={output}
          readOnly
          placeholder="Base64 output will appear here..."
          className="w-full h-40 p-4 border rounded-xl font-mono text-sm bg-gray-50"
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={encodeText}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Encode Text
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
          🔒 Encoding happens in your browser. No data is uploaded.
        </p>
      </div>
    </div>
  );
}
