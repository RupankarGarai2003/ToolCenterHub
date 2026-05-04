"use client";

import { useState, useEffect } from "react";
import { Clipboard, Check, Download, RotateCcw } from "lucide-react";

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
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== "");

    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, "").length;

    // ⏱ Time calculations
    const readingTime = (words.length / 200).toFixed(2);
    const speakingTime = (words.length / 130).toFixed(2);

    // 🔑 Keyword density
    const freq = {};
    words.forEach((w) => {
      const word = w.toLowerCase();
      freq[word] = (freq[word] || 0) + 1;
    });

    const sortedKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

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
    setTimeout(() => setCopied(false), 1500);
  };

  // 📥 DOWNLOAD
  const download = () => {
    if (!text) return;

    const blob = new Blob([text], { type: "text/plain" });
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          Word Counter
        </h1>

        {/* TEXT INPUT */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text..."
          className="w-full h-52 p-4 border rounded-xl font-mono text-sm"
        />

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <Stat label="Words" value={stats.words || 0} />
          <Stat label="Characters" value={stats.characters || 0} />
          <Stat label="No Spaces" value={stats.charactersNoSpace || 0} />
          <Stat label="Sentences" value={stats.sentences || 0} />
          <Stat label="Paragraphs" value={stats.paragraphs || 0} />
          <Stat label="Reading Time (min)" value={stats.readingTime || 0} />
          <Stat label="Speaking Time (min)" value={stats.speakingTime || 0} />
        </div>

        {/* KEYWORDS */}
        {stats.keywords?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Top Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {stats.keywords.map(([word, count], i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {word} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 justify-center">
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

// 📦 SMALL COMPONENT
function Stat({ label, value }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}