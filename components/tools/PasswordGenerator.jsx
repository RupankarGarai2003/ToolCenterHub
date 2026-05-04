"use client";

import { useState } from "react";
import { Clipboard, Check, RotateCcw, Download } from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // 🔐 CHAR SETS
  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const NUM = "0123456789";
  const SYM = "!@#$%^&*()_+[]{}<>?/|";
  const SIMILAR = /[il1Lo0O]/g;

  // 🔑 GENERATE PASSWORD
  const generatePassword = () => {
    let chars = "";
    if (includeLower) chars += LOWER;
    if (includeUpper) chars += UPPER;
    if (includeNumbers) chars += NUM;
    if (includeSymbols) chars += SYM;

    if (!chars) {
      alert("Select at least one option");
      return;
    }

    if (excludeSimilar) {
      chars = chars.replace(SIMILAR, "");
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
  };

  // 📊 REAL STRENGTH LOGIC
  const getStrength = () => {
    let score = 0;

    if (length >= 8) score++;
    if (length >= 12) score++;
    if (includeUpper) score++;
    if (includeLower) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) {
      return { label: "Weak", color: "bg-red-500", width: "33%" };
    }
    if (score <= 4) {
      return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    }
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrength();

  // 📋 COPY
  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 📥 DOWNLOAD
  const download = () => {
    if (!password) return;

    const blob = new Blob([password], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "password.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  // 🔄 RESET
  const reset = () => {
    setPassword("");
    setLength(12);
    setIncludeUpper(true);
    setIncludeLower(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setExcludeSimilar(false);
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          Password Generator
        </h1>

        {/* OUTPUT */}
        <div className="p-4 border rounded-xl font-mono break-all">
          {password || "Click generate to create password"}
        </div>

        {/* STRENGTH */}
        {password && (
          <div>
            <p className="text-sm mb-1">Strength: {strength.label}</p>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded transition-all ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
          </div>
        )}

        {/* LENGTH */}
        <div>
          <label className="block text-sm mb-1">
            Length: {length}
          </label>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* OPTIONS */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label>
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={() => setIncludeUpper(!includeUpper)}
            /> Uppercase
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeLower}
              onChange={() => setIncludeLower(!includeLower)}
            /> Lowercase
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            /> Numbers
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            /> Symbols
          </label>

          <label>
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={() => setExcludeSimilar(!excludeSimilar)}
            /> Exclude Similar
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={generatePassword}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Generate
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
          🔒 Generated securely in your browser using crypto API.
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