"use client";

import { useMemo, useState } from "react";

import {
  Type,
  Copy,
  Check,
  RotateCcw,
  Download,
  Clock3,
  Hash,
  AlignLeft,
  Languages,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // STATS
  const stats = useMemo(() => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const sentences =
      text.match(/[^.!?]+[.!?]+/g) || [];

    const paragraphs = text
      .split(/\n\s*\n/)
      .filter((p) => p.trim() !== "");

    const characters = text.length;

    const charactersNoSpaces =
      text.replace(/\s/g, "").length;

    const readingTime = Math.ceil(
      words.length / 200
    );

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime,
    };
  }, [text]);

  // COPY
  const copyText = async () => {
    if (!text) return;

    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  // DOWNLOAD
  const downloadText = () => {
    if (!text) return;

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `text-${Date.now()}.txt`;

    a.click();

    URL.revokeObjectURL(url);
  };

  // RESET
  const reset = () => {
    setText("");
  };

  return (
    <div className="bg-white py-4 px-3">
      <div className="max-w-7xl mx-auto">

        {/* CARD */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">

          {/* TOPBAR */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-500">

            <div className="flex items-center gap-2 text-white">
              <Type className="w-4 h-4" />

              <h2 className="text-sm font-semibold">
                Advanced Word Counter
              </h2>
            </div>

            <div className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full">
              Live Analysis
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4">

            {/* MAIN LAYOUT */}
            <div className="grid lg:grid-cols-[1fr_280px] gap-4">

              {/* LEFT SIDE */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-medium text-gray-700">
                    Enter Text
                  </label>

                  <span className="text-[11px] text-gray-400">
                    Real-time stats
                  </span>
                </div>

                <textarea
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  spellCheck={false}
                  placeholder="Start typing or paste your content here..."
                  className="
                    w-full h-[420px]
                    rounded-2xl
                    border border-gray-200
                    bg-[#fafafa]
                    p-4
                    text-sm
                    leading-7
                    text-gray-700
                    resize-none
                    outline-none
                    transition
                    focus:border-violet-400
                    focus:ring-2
                    focus:ring-violet-100
                  "
                />
              </div>

              {/* RIGHT SIDE STATS */}
              <div className="space-y-3">

                <StatCard
                  icon={
                    <Languages className="w-4 h-4" />
                  }
                  label="Words"
                  value={stats.words}
                  gradient="from-blue-500 to-cyan-500"
                />

                <StatCard
                  icon={
                    <Hash className="w-4 h-4" />
                  }
                  label="Characters"
                  value={stats.characters}
                  gradient="from-violet-500 to-purple-500"
                />

                <StatCard
                  icon={
                    <AlignLeft className="w-4 h-4" />
                  }
                  label="Sentences"
                  value={stats.sentences}
                  gradient="from-orange-500 to-red-500"
                />

                <StatCard
                  icon={
                    <AlignLeft className="w-4 h-4" />
                  }
                  label="Paragraphs"
                  value={stats.paragraphs}
                  gradient="from-pink-500 to-rose-500"
                />

                <StatCard
                  icon={
                    <Clock3 className="w-4 h-4" />
                  }
                  label="Read Time"
                  value={`${stats.readingTime} min`}
                  gradient="from-indigo-500 to-blue-600"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">

              <ActionButton
                onClick={copyText}
                icon={
                  copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
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
                onClick={downloadText}
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

        {/* TOOL CONTENT */}
        <div className="contentWrapper">
          <About />
          <HowToUse />
          <Features />
          <Benefits />
          <FAQ />
        </div>

      </div>
    </div>
  );
}

/* STATS CARD */
function StatCard({
  icon,
  label,
  value,
  gradient,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-3
        shadow-sm
        flex items-center gap-3
      "
    >
      <div
        className={`
          w-10 h-10 rounded-xl
          bg-gradient-to-r ${gradient}
          flex items-center justify-center
          text-white
          shrink-0
        `}
      >
        {icon}
      </div>

      <div>
        <p className="text-[11px] text-gray-500">
          {label}
        </p>

        <h3 className="text-lg font-bold text-gray-800">
          {value}
        </h3>
      </div>
    </div>
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