"use client";

import { useMemo, useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Shield,
  Copy,
  ClipboardCheck,
  Braces,
  Sparkles,
  FileJson,
  Minimize2,
  Maximize2,
  Trash2,
} from "lucide-react";

export default function JSONValidator() {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [valid, setValid] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [minified, setMinified] = useState("");

  // VALIDATE JSON
  const validateJSON = () => {
    try {
      const parsed = JSON.parse(input);

      const pretty = JSON.stringify(
        parsed,
        null,
        2
      );

      const mini = JSON.stringify(parsed);

      setFormatted(pretty);
      setMinified(mini);

      setValid(true);
      setError("");
    } catch (err) {
      setValid(false);

      setError(
        err?.message || "Invalid JSON"
      );

      setFormatted("");
      setMinified("");
    }
  };

  // LIVE VALIDATION
  const handleChange = (value) => {
    setInput(value);

    try {
      const parsed = JSON.parse(value);

      setFormatted(
        JSON.stringify(parsed, null, 2)
      );

      setMinified(
        JSON.stringify(parsed)
      );

      setValid(true);
      setError("");
    } catch (err) {
      if (value.trim() === "") {
        setValid(null);
        setError("");
      } else {
        setValid(false);

        setError(
          err?.message || "Invalid JSON"
        );
      }
    }
  };

  // COPY
  const copyText = async (text) => {
    if (!text) return;

    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // RESET
  const reset = () => {
    setInput("");
    setFormatted("");
    setMinified("");
    setValid(null);
    setError("");
  };

  // STATS
  const stats = useMemo(() => {
    return {
      lines: input
        ? input.split("\n").length
        : 0,

      characters: input.length,

      sizeKB: (
        new Blob([input]).size / 1024
      ).toFixed(2),
    };
  }, [input]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-6 px-3">

      <div className="max-w-6xl mx-auto">

   
        {/* MAIN */}
        <div className="grid lg:grid-cols-12 gap-5">

          {/* LEFT SIDE */}
          <div className="lg:col-span-7">

            <div
              className="
                bg-white rounded-3xl
                overflow-hidden
                border border-gray-100
                shadow-sm
              "
            >

              {/* TOP BAR */}
              <div
                className="
                  flex items-center justify-between
                  px-5 py-4
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                "
              >
                <div className="flex items-center gap-2 text-white">

                  <FileJson className="w-4 h-4" />

                  <h2 className="font-bold text-sm">
                    JSON Input
                  </h2>
                </div>

                <div
                  className="
                    px-2 py-1 rounded-full
                    bg-white/20
                    text-white text-[10px]
                  "
                >
                  Live Validation
                </div>
              </div>

              {/* EDITOR */}
              <div className="p-4">

                <textarea
                  value={input}
                  onChange={(e) =>
                    handleChange(
                      e.target.value
                    )
                  }
                  spellCheck={false}
                  placeholder={`{
  "name": "John",
  "age": 25,
  "skills": ["React", "Next.js"]
}`}
                  className="
                    w-full h-[320px]
                    bg-[#f8fafc]
                    border border-gray-200
                    rounded-2xl
                    p-4
                    font-mono
                    text-sm
                    leading-7
                    text-gray-700
                    resize-none
                    outline-none
                    transition-all
                    focus:ring-2
                    focus:ring-cyan-100
                    focus:border-cyan-400
                  "
                />

                {/* STATUS */}
                {valid === true && (
                  <div
                    className="
                      mt-4
                      flex items-center gap-2
                      bg-emerald-50
                      border border-emerald-200
                      rounded-xl
                      p-3 text-emerald-700
                    "
                  >
                    <CheckCircle2 className="w-4 h-4" />

                    <div>
                      <p className="font-bold text-sm">
                        Valid JSON
                      </p>

                      <p className="text-xs opacity-80">
                        Everything looks good.
                      </p>
                    </div>
                  </div>
                )}

                {valid === false && (
                  <div
                    className="
                      mt-4
                      bg-red-50
                      border border-red-200
                      rounded-xl
                      p-3 text-red-700
                    "
                  >
                    <div className="flex items-center gap-2 mb-1">

                      <XCircle className="w-4 h-4" />

                      <p className="font-bold text-sm">
                        Invalid JSON
                      </p>
                    </div>

                    <p className="text-xs break-all">
                      {error}
                    </p>
                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-3 mt-5">

                  <ActionButton
                    onClick={validateJSON}
                    icon={
                      <Braces className="w-3.5 h-3.5" />
                    }
                    label="Validate"
                    gradient="from-cyan-500 to-blue-600"
                  />

                  <ActionButton
                    onClick={() =>
                      copyText(formatted)
                    }
                    icon={
                      copied ? (
                        <ClipboardCheck className="w-3.5 h-3.5" />
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
                    onClick={() => {
                      if (!formatted)
                        return;

                      setInput(minified);
                    }}
                    icon={
                      <Minimize2 className="w-3.5 h-3.5" />
                    }
                    label="Minify"
                    gradient="from-orange-500 to-red-500"
                  />

                  <ActionButton
                    onClick={() => {
                      if (!formatted)
                        return;

                      setInput(formatted);
                    }}
                    icon={
                      <Maximize2 className="w-3.5 h-3.5" />
                    }
                    label="Beautify"
                    gradient="from-violet-500 to-purple-600"
                  />

                  <button
                    onClick={reset}
                    className="
                      flex items-center gap-2
                      px-4 py-2.5 rounded-xl
                      bg-gray-100 text-gray-700
                      font-semibold text-sm
                      hover:bg-gray-200
                      transition-all
                    "
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 space-y-4">

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">

              <StatCard
                label="Characters"
                value={stats.characters}
              />

              <StatCard
                label="Lines"
                value={stats.lines}
              />

              <StatCard
                label="Size"
                value={`${stats.sizeKB}KB`}
              />

              <StatCard
                label="Status"
                value={
                  valid === null
                    ? "-"
                    : valid
                    ? "Valid"
                    : "Invalid"
                }
              />
            </div>

            {/* BEAUTIFIED */}
            <OutputCard
              title="Beautified JSON"
              content={formatted}
            />

            {/* MINIFIED */}
            <OutputCard
              title="Minified JSON"
              content={minified}
            />

  
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-xs mt-6">
          🔒 Local Processing • Instant
          Validation • No Server Upload
        </p>
      </div>
    </div>
  );
}

/* ACTION BUTTON */
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
        px-4 py-2.5 rounded-xl
        bg-gradient-to-r ${gradient}
        text-white font-semibold text-sm
        shadow-md
        hover:scale-105
        transition-all duration-300
      `}
    >
      {icon}
      {label}
    </button>
  );
}

/* STAT CARD */
function StatCard({ label, value }) {
  return (
    <div
      className="
        bg-white rounded-2xl
        border border-gray-100
        p-4
        shadow-sm
      "
    >
      <p className="text-gray-500 text-xs">
        {label}
      </p>

      <h3 className="text-2xl font-black text-gray-900 mt-2">
        {value}
      </h3>
    </div>
  );
}

/* OUTPUT CARD */
function OutputCard({
  title,
  content,
}) {
  return (
    <div
      className="
        bg-white rounded-2xl
        border border-gray-100
        p-5
        shadow-sm
      "
    >
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        {title}
      </h2>

      {content ? (
        <pre
          className="
            bg-[#f8fafc]
            border border-gray-200
            rounded-xl
            p-3
            overflow-auto
            text-xs
            text-gray-700
            max-h-[180px]
          "
        >
          {content}
        </pre>
      ) : (
        <p className="text-xs text-gray-400">
          Nothing to display...
        </p>
      )}
    </div>
  );
}