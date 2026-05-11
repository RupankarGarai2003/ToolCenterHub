"use client";

import { useMemo, useState } from "react";

import {
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  KeyRound,
  Download,
  Sparkles,
  History,
  Eye,
  EyeOff,
  Shield,
  Timer,
  Binary,
  TriangleAlert,
} from "lucide-react";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function PasswordGenerator() {
  const [password, setPassword] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(true);

  const [length, setLength] =
    useState(16);

  const [customWord, setCustomWord] =
    useState("");

  const [uppercase, setUppercase] =
    useState(true);

  const [lowercase, setLowercase] =
    useState(true);

  const [numbers, setNumbers] =
    useState(true);

  const [symbols, setSymbols] =
    useState(true);

  const [
    excludeSimilar,
    setExcludeSimilar,
  ] = useState(false);

  const [history, setHistory] =
    useState([]);

  // PASSWORD STRENGTH
  const strength = useMemo(() => {
    let score = 0;

    if (length >= 8) score++;
    if (length >= 12) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (score <= 2) {
      return {
        text: "Weak",
        color: "bg-red-500",
        textColor: "text-red-500",
        width: "33%",
      };
    }

    if (score <= 4) {
      return {
        text: "Medium",
        color: "bg-yellow-500",
        textColor:
          "text-yellow-600",
        width: "66%",
      };
    }

    return {
      text: "Strong",
      color:
        "bg-emerald-500",
      textColor:
        "text-emerald-600",
      width: "100%",
    };
  }, [
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
  ]);

  // ENTROPY
  const entropy = useMemo(() => {
    let charset = 0;

    if (uppercase) charset += 26;
    if (lowercase) charset += 26;
    if (numbers) charset += 10;
    if (symbols) charset += 32;

    return Math.round(
      length *
        Math.log2(charset || 1)
    );
  }, [
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
  ]);

  // CRACK TIME
  const crackTime = useMemo(() => {
    if (entropy < 40)
      return "Minutes";

    if (entropy < 60)
      return "Days";

    if (entropy < 80)
      return "Years";

    if (entropy < 100)
      return "Centuries";

    return "Billions of Years";
  }, [entropy]);

  // SECURITY TIPS
  const securityTips = useMemo(() => {
    const tips = [];

    if (customWord.length > 0) {
      tips.push(
        "Avoid personal names in passwords"
      );
    }

    if (length < 12) {
      tips.push(
        "Use at least 12 characters"
      );
    }

    if (!symbols) {
      tips.push(
        "Add symbols for stronger security"
      );
    }

    if (
      tips.length === 0
    ) {
      tips.push(
        "Excellent password security"
      );
    }

    return tips;
  }, [
    customWord,
    length,
    symbols,
  ]);

  // GENERATE PASSWORD
  const generatePassword = () => {
    let chars = "";

    // CHARACTER SETS
    const upper =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const lower =
      "abcdefghijklmnopqrstuvwxyz";

    const nums = "0123456789";

    const syms =
      "!@#$%^&*()_+{}[]<>?/";

    // BUILD CHARACTER SET
    if (uppercase) chars += upper;

    if (lowercase) chars += lower;

    if (numbers) chars += nums;

    if (symbols) chars += syms;

    // EXCLUDE SIMILAR CHARACTERS
    if (excludeSimilar) {
      chars = chars.replace(
        /[O0l1I]/g,
        ""
      );
    }

    // PREVENT EMPTY GENERATION
    if (!chars) return;

    let generated = "";

    // CLEAN CUSTOM WORD
    let cleanWord =
      customWord.trim();

    // REMOVE UPPERCASE
    if (!uppercase) {
      cleanWord =
        cleanWord.replace(
          /[A-Z]/g,
          ""
        );
    }

    // REMOVE LOWERCASE
    if (!lowercase) {
      cleanWord =
        cleanWord.replace(
          /[a-z]/g,
          ""
        );
    }

    // REMOVE NUMBERS
    if (!numbers) {
      cleanWord =
        cleanWord.replace(
          /[0-9]/g,
          ""
        );
    }

    // REMOVE SYMBOLS
    if (!symbols) {
      cleanWord =
        cleanWord.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
    }

    // REMOVE SIMILAR
    if (excludeSimilar) {
      cleanWord =
        cleanWord.replace(
          /[O0l1I]/g,
          ""
        );
    }

    // ADD CUSTOM WORD
    generated += cleanWord;

    // ENSURE CHARACTER TYPES
    if (uppercase) {
      generated +=
        upper[
          Math.floor(
            Math.random() *
              upper.length
          )
        ];
    }

    if (lowercase) {
      generated +=
        lower[
          Math.floor(
            Math.random() *
              lower.length
          )
        ];
    }

    if (numbers) {
      generated +=
        nums[
          Math.floor(
            Math.random() *
              nums.length
          )
        ];
    }

    if (symbols) {
      generated +=
        syms[
          Math.floor(
            Math.random() *
              syms.length
          )
        ];
    }

    // FILL REMAINING
    while (
      generated.length < length
    ) {
      generated +=
        chars[
          Math.floor(
            Math.random() *
              chars.length
          )
        ];
    }

    // SHUFFLE
    generated = generated
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // FINAL LENGTH
    generated = generated.slice(
      0,
      length
    );

    setPassword(generated);

    // SAVE HISTORY
    setHistory((prev) => [
      generated,
      ...prev.slice(0, 4),
    ]);
  };

  // COPY
  const copyPassword = async (
    value = password
  ) => {
    if (!value) return;

    await navigator.clipboard.writeText(
      value
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  // DOWNLOAD
  const downloadPassword = () => {
    if (!password) return;

    const blob = new Blob([password], {
      type: "text/plain",
    });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `password-${Date.now()}.txt`;

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="min-h-screen bg-[#f4f7fb] py-5 px-3">
      <div className="max-w-6xl mx-auto">

        {/* CARD */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 px-6 py-5 flex items-center justify-between">

            <div className="flex items-center gap-4 text-white">

              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Password Generator
                </h2>

                <p className="text-sm text-white/70">
                  Professional secure password generator
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-sm">
              <Sparkles className="w-4 h-4" />
              Strong Security
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6">

            {/* PASSWORD */}
            <div className="mb-6">

              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Generated Password
              </label>

              <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-between gap-4">

                <div className="flex items-center gap-4 min-w-0">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-slate-500 mb-1">
                      Generated Secure Password
                    </p>

                    <h3 className="font-mono text-2xl font-bold text-slate-800 truncate">
                      {password
                        ? showPassword
                          ? password
                          : "•".repeat(
                              password.length
                            )
                        : "Generate password"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      copyPassword()
                    }
                    className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* GRID */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-5">

              {/* LEFT */}
              <div>

                {/* CUSTOM WORD */}
                <div className="mb-5">

                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Custom Keyword
                  </label>

                  <input
                    type="text"
                    value={customWord}
                    onChange={(e) =>
                      setCustomWord(
                        e.target.value
                      )
                    }
                    placeholder="Enter custom keyword"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                  />
                </div>

                {/* PRESETS */}
                <div className="mb-5">

                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Quick Presets
                  </label>

                  <div className="flex flex-wrap gap-2">

                    {[8, 12, 16, 24, 32].map(
                      (size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setLength(
                              size
                            )
                          }
                          className={`
                            px-4 py-2 rounded-xl text-sm font-medium transition
                            ${
                              length ===
                              size
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-slate-100 text-slate-700"
                            }
                          `}
                        >
                          {size} Chars
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* LENGTH */}
                <div className="mb-5">

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-medium text-slate-700">
                      Password Length
                    </label>

                    <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      {length}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="6"
                    max="64"
                    value={length}
                    onChange={(e) =>
                      setLength(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* STRENGTH */}
                <div className="mb-5">

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-medium text-slate-700">
                      Password Strength
                    </label>

                    <span
                      className={`text-sm font-semibold ${strength.textColor}`}
                    >
                      {strength.text}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">

                    <div
                      className={`h-3 rounded-full ${
                        strength.width !==
                        "33%"
                          ? strength.color
                          : "bg-red-500"
                      }`}
                    />

                    <div
                      className={`h-3 rounded-full ${
                        strength.width ===
                          "66%" ||
                        strength.width ===
                          "100%"
                          ? "bg-yellow-500"
                          : "bg-slate-200"
                      }`}
                    />

                    <div
                      className={`h-3 rounded-full ${
                        strength.width ===
                        "100%"
                          ? "bg-emerald-500"
                          : "bg-slate-200"
                      }`}
                    />
                  </div>
                </div>

                {/* SETTINGS */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Password Settings
                    </h3>
                  </div>

                  <table className="w-full text-sm">

                    <tbody>

                      <TableRow
                        label="Uppercase"
                        checked={uppercase}
                        onChange={() =>
                          setUppercase(
                            !uppercase
                          )
                        }
                      />

                      <TableRow
                        label="Lowercase"
                        checked={lowercase}
                        onChange={() =>
                          setLowercase(
                            !lowercase
                          )
                        }
                      />

                      <TableRow
                        label="Numbers"
                        checked={numbers}
                        onChange={() =>
                          setNumbers(
                            !numbers
                          )
                        }
                      />

                      <TableRow
                        label="Symbols"
                        checked={symbols}
                        onChange={() =>
                          setSymbols(
                            !symbols
                          )
                        }
                      />

                      <TableRow
                        label="Exclude Similar"
                        checked={
                          excludeSimilar
                        }
                        onChange={() =>
                          setExcludeSimilar(
                            !excludeSimilar
                          )
                        }
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-3">

                  <AnalysisCard
                    icon={
                      <Binary className="w-4 h-4" />
                    }
                    label="Entropy"
                    value={`${entropy}-bit`}
                  />

                  <AnalysisCard
                    icon={
                      <Timer className="w-4 h-4" />
                    }
                    label="Crack Time"
                    value={crackTime}
                  />

                  <AnalysisCard
                    icon={
                      <Shield className="w-4 h-4" />
                    }
                    label="Complexity"
                    value={
                      strength.text
                    }
                  />

                  <AnalysisCard
                    icon={
                      <KeyRound className="w-4 h-4" />
                    }
                    label="Characters"
                    value={length}
                  />
                </div>

                {/* HISTORY */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">

                    <History className="w-4 h-4 text-slate-600" />

                    <h3 className="text-sm font-semibold text-slate-700">
                      Password History
                    </h3>
                  </div>

                  <div className="p-3 space-y-2 max-h-[230px] overflow-auto">

                    {history.length ===
                    0 ? (
                      <p className="text-sm text-slate-400 text-center py-10">
                        No passwords generated
                      </p>
                    ) : (
                      history.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                          >
                            <p className="font-mono text-sm truncate text-slate-700">
                              {item}
                            </p>

                            <button
                              onClick={() =>
                                copyPassword(
                                  item
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                {/* TIPS */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">

                    <TriangleAlert className="w-4 h-4 text-amber-500" />

                    <h3 className="text-sm font-semibold text-slate-700">
                      Security Tips
                    </h3>
                  </div>

                  <div className="p-4 space-y-3">

                    {securityTips.map(
                      (
                        tip,
                        index
                      ) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />

                          <p>{tip}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center gap-3 mt-6">

              <ActionButton
                onClick={
                  generatePassword
                }
                icon={
                  <RefreshCw className="w-4 h-4" />
                }
                label="Generate Password"
                gradient="from-indigo-600 to-violet-600"
              />

              <ActionButton
                onClick={
                  downloadPassword
                }
                icon={
                  <Download className="w-4 h-4" />
                }
                label="Download"
                gradient="from-emerald-500 to-teal-500"
              />
            </div>
          </div>
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

      
    </>
  );
}

/* SETTINGS ROW */
function TableRow({
  label,
  checked,
  onChange,
}) {
  return (
    <tr className="border-t border-slate-200">

      <td className="px-4 py-3 text-slate-700 font-medium">
        {label}
      </td>

      <td className="px-4 py-3 text-right">

        <button
          onClick={onChange}
          className={`
            relative w-11 h-6 rounded-full transition
            ${
              checked
                ? "bg-indigo-600"
                : "bg-slate-300"
            }
          `}
        >
          <span
            className={`
              absolute top-1 left-1
              w-4 h-4 rounded-full bg-white transition
              ${
                checked
                  ? "translate-x-5"
                  : ""
              }
            `}
          />
        </button>
      </td>
    </tr>
  );
}

/* ANALYSIS CARD */
function AnalysisCard({
  icon,
  label,
  value,
}) {
  return (
    <div className=" border border-slate-200 rounded-2xl p-4">

      <div className="flex items-center gap-2 text-indigo-600 mb-2">
        {icon}

        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>
      </div>

      <h3 className="text-lg font-bold text-slate-800 truncate">
        {value}
      </h3>
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
        px-6 py-3
        rounded-2xl
        bg-gradient-to-r ${gradient}
        text-white
        text-sm
        font-medium
        shadow-lg hover:shadow-xl
        transition
      `}
    >
      {icon}
      {label}
    </button>
    
  );
}