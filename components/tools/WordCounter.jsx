"use client";

import { useState, useEffect } from "react";
import {
  Clipboard,
  Check,
  Download,
  RotateCcw,
  FileText,
  Clock3,
  Hash,
  AlignLeft,
  Sparkles,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({});
  const [copied, setCopied] = useState(false);

  // 📊 PROCESS TEXT
  useEffect(() => {
    const words = text.trim().match(/\b\w+\b/g) || [];

    const sentences =
      text.match(/[^.!?]+[.!?]+/g) || [];

    const paragraphs = text
      .split(/\n+/)
      .filter((p) => p.trim() !== "");

    const characters = text.length;

    const charactersNoSpace =
      text.replace(/\s/g, "").length;

    const readingTime = (
      words.length / 200
    ).toFixed(2);

    const speakingTime = (
      words.length / 130
    ).toFixed(2);

    const freq = {};

    words.forEach((w) => {
      const word = w.toLowerCase();

      if (word.length > 2) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    setStats({
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      characters,
      charactersNoSpace,
      readingTime,
      speakingTime,
      keywords: sortedKeywords,
    });
  }, [text]);

  // 📋 COPY
  const copy = async () => {
    if (!text) return;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // 📥 DOWNLOAD
  const download = () => {
    if (!text) return;

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "text.txt";

    a.click();

    URL.revokeObjectURL(url);
  };

  // 🔄 RESET
  const reset = () => {
    setText("");
    setStats({});
  };

  return (
    <>
      <div className="bg-[#f5f7fb] min-h-screen py-14 px-4">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          {/* <div className="text-center mb-14">

            <div
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                bg-cyan-100 text-cyan-700
                text-sm font-semibold mb-5
              "
            >
              <Sparkles className="w-4 h-4" />
              Smart Text Analytics
            </div>

            <h1
              className="
                text-5xl md:text-6xl
                font-black
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                bg-clip-text
                text-transparent
              "
            >
              Word Counter
            </h1>

            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Analyze words, characters, reading time,
              speaking time & keyword density instantly.
            </p>
          </div> */}

          {/* MAIN LAYOUT */}
          <div className="grid xl:grid-cols-12 gap-8 items-start">

            {/* LEFT SIDE */}
            <div className="xl:col-span-8">

              <div
                className="
                  bg-white
                  rounded-[32px]
                  shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  overflow-hidden
                  border border-gray-100
                "
              >

                {/* TOP BAR */}
                <div
                  className="
                    flex items-center justify-between
                    px-7 py-5
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                  "
                >
                  <div className="flex items-center gap-3 text-white">
                    <FileText className="w-5 h-5" />

                    <p className="font-bold text-lg">
                      Text Editor
                    </p>
                  </div>

                  <div className="text-cyan-100 text-sm">
                    Live Analysis
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-7">

                  <textarea
                    value={text}
                    onChange={(e) =>
                      setText(e.target.value)
                    }
                    placeholder="Start typing or paste your text here..."
                    className="
                      w-full h-[420px]
                      rounded-3xl
                      border border-gray-200
                      bg-[#f8fafc]
                      p-6
                      text-gray-700
                      text-[15px]
                      leading-8
                      resize-none
                      outline-none
                      transition-all
                      focus:ring-4
                      focus:ring-cyan-100
                      focus:border-cyan-400
                    "
                  />

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-4 mt-6">

                    {/* COPY */}
                    <button
                      onClick={copy}
                      className="
                        flex items-center gap-2
                        px-6 py-3 rounded-2xl
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-500
                        text-white font-semibold
                        shadow-lg shadow-green-500/20
                        hover:scale-105
                        transition-all duration-300
                      "
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}

                      {copied ? "Copied" : "Copy"}
                    </button>

                    {/* DOWNLOAD */}
                    <button
                      onClick={download}
                      className="
                        flex items-center gap-2
                        px-6 py-3 rounded-2xl
                        bg-gradient-to-r
                        from-violet-500
                        to-purple-500
                        text-white font-semibold
                        shadow-lg shadow-purple-500/20
                        hover:scale-105
                        transition-all duration-300
                      "
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    {/* RESET */}
                    <button
                      onClick={reset}
                      className="
                        flex items-center gap-2
                        px-6 py-3 rounded-2xl
                        bg-gray-100
                        text-gray-700 font-semibold
                        hover:bg-gray-200
                        hover:scale-105
                        transition-all duration-300
                      "
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="xl:col-span-4 space-y-6">

              {/* STATS */}
              <div className="grid grid-cols-2 gap-5">

                <StatCard
                  icon={<Hash />}
                  label="Words"
                  value={stats.words || 0}
                />

                <StatCard
                  icon={<AlignLeft />}
                  label="Characters"
                  value={stats.characters || 0}
                />

                <StatCard
                  icon={<FileText />}
                  label="Sentences"
                  value={stats.sentences || 0}
                />

                <StatCard
                  icon={<Clock3 />}
                  label="Reading"
                  value={`${stats.readingTime || 0}m`}
                />

                <StatCard
                  icon={<Clock3 />}
                  label="Speaking"
                  value={`${stats.speakingTime || 0}m`}
                />

                <StatCard
                  icon={<Hash />}
                  label="Paragraphs"
                  value={stats.paragraphs || 0}
                />
              </div>

              {/* DETAILS */}
              <div
                className="
                  bg-white
                  rounded-3xl
                  shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                  border border-gray-100
                  p-7
                "
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Detailed Statistics
                </h2>

                <div className="space-y-5">

                  <InfoRow
                    label="Characters (No Spaces)"
                    value={
                      stats.charactersNoSpace || 0
                    }
                  />

                  <InfoRow
                    label="Average Reading Speed"
                    value="200 WPM"
                  />

                  <InfoRow
                    label="Average Speaking Speed"
                    value="130 WPM"
                  />
                </div>
              </div>

              {/* KEYWORDS */}
              <div
                className="
                  bg-white
                  rounded-3xl
                  shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                  border border-gray-100
                  p-7
                "
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Top Keywords
                </h2>

                {stats.keywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {stats.keywords.map(
                      ([word, count], i) => (
                        <div
                          key={i}
                          className="
                            px-4 py-2 rounded-full
                            bg-gradient-to-r
                            from-cyan-100
                            to-blue-100
                            text-cyan-700
                            font-semibold text-sm
                            border border-cyan-200
                          "
                        >
                          {word} ({count})
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Keywords will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <p className="text-center text-gray-500 text-sm mt-10">
            🔒 Your text is processed locally in your browser.
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

/* 📦 STAT CARD */
function StatCard({ icon, label, value }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-5
        border border-gray-100
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div
        className="
          w-12 h-12 rounded-2xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
          text-white
          flex items-center justify-center
          mb-4
        "
      >
        {icon}
      </div>

      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <h3 className="text-3xl font-black text-gray-900 mt-1">
        {value}
      </h3>
    </div>
  );
}

/* 📦 INFO ROW */
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <p className="font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}