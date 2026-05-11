"use client";

import { useState } from "react";

import {
  Clipboard,
  Check,
  RotateCcw,
  Download,
  Minimize2,
  Maximize2,
  Braces,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // FORMAT JSON
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);

      const formatted = JSON.stringify(
        parsed,
        null,
        2
      );

      setOutput(formatted);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setOutput("");
    }
  };

  // MINIFY JSON
  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);

      const minified =
        JSON.stringify(parsed);

      setOutput(minified);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setOutput("");
    }
  };

  // COPY
  const copyToClipboard = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(
      output
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  // DOWNLOAD
  const downloadJSON = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "application/json",
    });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "formatted.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  // RESET
  const reset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <>
    <div className="bg-white py-4 px-3">
      <div className="max-w-6xl mx-auto">

        {/* CARD */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">

          {/* TOPBAR */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500">

            <div className="flex items-center gap-2 text-white">
              <Braces className="w-4 h-4" />

              <h2 className="text-sm font-semibold">
                JSON Formatter
              </h2>
            </div>

            <div className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full">
              Instant
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 pb-3">

            {/* EDITORS */}
            <div className="grid lg:grid-cols-2 gap-3">

              {/* INPUT */}
              <div>
                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-medium text-gray-700">
                    Input JSON
                  </label>

                  <span className="text-[11px] text-gray-400">
                    Paste JSON
                  </span>
                </div>

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                  spellCheck={false}
                  placeholder={`{
  "name": "John",
  "age": 25
}`}
                  className="
                    w-full h-[320px]
                    rounded-xl
                    border border-gray-200
                    bg-[#fafafa]
                    p-4
                    font-mono
                    text-xs
                    leading-6
                    text-gray-700
                    resize-none
                    outline-none
                    transition
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* OUTPUT */}
              <div>
                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-medium text-gray-700">
                    Output JSON
                  </label>

                  <span className="text-[11px] text-gray-400">
                    Result
                  </span>
                </div>

                <textarea
                  value={output}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                  className="
                    w-full h-[320px]
                    rounded-xl
                    border border-gray-200
                    bg-[#fafafa]
                    p-4
                    font-mono
                    text-xs
                    leading-6
                    text-gray-700
                    resize-none
                    outline-none
                  "
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            {/* BUTTONS */}
           <div className="flex flex-wrap items-center justify-center gap-2 mt--1">

              <ActionButton
                onClick={formatJSON}
                icon={
                  <Maximize2 className="w-3.5 h-3.5" />
                }
                label="Format"
                gradient="from-blue-600 to-cyan-500"
              />

              <ActionButton
                onClick={minifyJSON}
                icon={
                  <Minimize2 className="w-3.5 h-3.5" />
                }
                label="Minify"
                gradient="from-orange-500 to-red-500"
              />

              <ActionButton
                onClick={
                  copyToClipboard
                }
                icon={
                  copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Clipboard className="w-3.5 h-3.5" />
                  )
                }
                label={
                  copied
                    ? "Copied"
                    : "Copy"
                }
                gradient="from-emerald-500 to-green-500"
              />

              <ActionButton
                onClick={downloadJSON}
                icon={
                  <Download className="w-3.5 h-3.5" />
                }
                label="Download"
                gradient="from-violet-500 to-purple-600"
              />

              <button
                onClick={reset}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-gray-100
                  text-gray-700
                  text-xs
                  font-medium
                  hover:bg-gray-200
                  transition
                "
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
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

/* BUTTON */
function ActionButton({
  onClick,
  icon,
  label,
  gradient,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2
        px-4 py-2.5
        rounded-xl
        bg-gradient-to-r ${gradient}
        text-white
        text-xs
        font-medium
        shadow-sm
        hover:opacity-90
        transition
      `}
    >
      {icon}
      {label}
    </button>
  );
}