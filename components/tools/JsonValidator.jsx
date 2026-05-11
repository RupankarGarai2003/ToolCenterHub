"use client";

import { useState } from "react";

import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clipboard,
  Check,
} from "lucide-react";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function JSONValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // VALIDATE JSON
  const validateJSON = () => {
    try {
      JSON.parse(input);

      setResult("valid");
      setError("");
    } catch (err) {
      setResult("invalid");
      setError(err.message);
    }
  };

  // COPY JSON
  const copyToClipboard = async () => {
    if (!input) return;

    await navigator.clipboard.writeText(
      input
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  // RESET
  const reset = () => {
    setInput("");
    setResult(null);
    setError("");
  };

  return (
    <>
    <div className="bg-white py-4 px-3">
      <div className="max-w-4xl mx-auto">

        {/* CARD */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">

          {/* TOPBAR */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-500">

            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-4 h-4" />

              <h2 className="text-sm font-semibold">
                JSON Validator
              </h2>
            </div>

            <div className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full">
              Fast Validation
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4">

            {/* LABEL */}
            <div className="flex items-center justify-between mb-2">

              <label className="text-xs font-medium text-gray-700">
                JSON Input
              </label>

              <span className="text-[11px] text-gray-400">
                Paste JSON here
              </span>
            </div>

            {/* TEXTAREA */}
            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
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
                focus:border-emerald-400
                focus:ring-2
                focus:ring-emerald-100
              "
            />

            {/* RESULT */}
            {result === "valid" && (
              <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl px-3 py-3">

                <CheckCircle2 className="w-4 h-4" />

                Valid JSON
              </div>
            )}

            {result === "invalid" && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-3">

                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4" />

                  Invalid JSON
                </div>

                <div className="text-[11px] text-red-500 font-mono break-all">
                  {error}
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">

              {/* VALIDATE */}
              <button
                onClick={validateJSON}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-emerald-600
                  to-green-500
                  text-white
                  text-xs
                  font-medium
                  shadow-sm
                  hover:opacity-90
                  transition
                "
              >
                <ShieldCheck className="w-3.5 h-3.5" />

                Validate
              </button>

              {/* COPY */}
              <button
                onClick={copyToClipboard}
                disabled={!input}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  text-xs
                  font-medium
                  shadow-sm
                  hover:opacity-90
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Clipboard className="w-3.5 h-3.5" />
                )}

                {copied
                  ? "Copied"
                  : "Copy"}
              </button>

              {/* RESET */}
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