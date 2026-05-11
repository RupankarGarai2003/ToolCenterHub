"use client";

import { useRef, useState } from "react";

import QRCode from "react-qr-code";

import {
  QrCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Link2,
  Type,
  Wifi,
  Mail,
  Smartphone,
  Sparkles,
  Shield,
} from "lucide-react";

import ImageUploader from "./ImageUploader";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function AdvancedQRCodeGenerator() {
  const qrRef = useRef(null);

  const [text, setText] =
    useState("https://example.com");

  const [size, setSize] =
    useState(180);

  const [fgColor, setFgColor] =
    useState("#1d4ed8");

  const [bgColor, setBgColor] =
    useState("#ffffff");

  const [copied, setCopied] =
    useState(false);

  const [includeMargin, setIncludeMargin] =
    useState(true);

  const [type, setType] =
    useState("url");

  // PRESETS
  const presets = [
    {
      label: "Website",
      icon: <Link2 className="w-4 h-4" />,
      value: "url",
      sample: "https://example.com",
    },
    {
      label: "Text",
      icon: <Type className="w-4 h-4" />,
      value: "text",
      sample: "Hello World",
    },
    {
      label: "Email",
      icon: <Mail className="w-4 h-4" />,
      value: "email",
      sample: "mailto:test@example.com",
    },
    {
      label: "WiFi",
      icon: <Wifi className="w-4 h-4" />,
      value: "wifi",
      sample:
        "WIFI:T:WPA;S:MyWifi;P:12345678;;",
    },
    {
      label: "Phone",
      icon: (
        <Smartphone className="w-4 h-4" />
      ),
      value: "phone",
      sample: "tel:+1234567890",
    },
  ];

  // COPY
  const copyText = async () => {
    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  // DOWNLOAD QR
  const downloadQR = () => {
    const svg =
      qrRef.current.querySelector("svg");

    const svgData =
      new XMLSerializer().serializeToString(
        svg
      );

    const canvas =
      document.createElement("canvas");

    const ctx =
      canvas.getContext("2d");

    const img = new Image();

    canvas.width = size + 40;
    canvas.height = size + 40;

    img.onload = () => {
      ctx.fillStyle = bgColor;

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        img,
        20,
        20,
        Math.min(size, 240),
        Math.min(size, 240)
      );

      const pngFile =
        canvas.toDataURL("image/png");

      const downloadLink =
        document.createElement("a");

      downloadLink.download =
        "qrcode.png";

      downloadLink.href = pngFile;

      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(
      svgData
    )}`;
  };

  // RESET
  const resetAll = () => {
    setText(
      "https://example.com"
    );

    setSize(180);

    setFgColor("#1d4ed8");

    setBgColor("#ffffff");

    setIncludeMargin(true);

    setType("url");
  };

  return (
    <div className="min-h-screen bg-white py-3 sm:py-5 px-2 sm:px-4">

      <div className="max-w-6xl mx-auto">

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl sm:rounded-[28px] overflow-hidden border border-slate-200 shadow-lg sm:shadow-xl shadow-slate-200/40">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-700 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="flex items-center gap-4 text-white">

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">

                <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div>

                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  QR Code Generator
                </h2>

                <p className="text-xs sm:text-sm text-white/70">
                  Professional customizable QR creator
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-sm">

              <Sparkles className="w-4 h-4" />

              Live Generator
            </div>
          </div>

          {/* BODY */}
          <div className="p-3 sm:p-5">

            <div className="grid lg:grid-cols-[1fr_290px] gap-4 sm:gap-5 items-start">

              {/* LEFT */}
              <div className="space-y-4">

                {/* TYPE */}
                <div>

                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    QR Type
                  </label>

                  <div className="flex flex-wrap gap-2">

                    {presets.map(
                      (item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            setType(
                              item.value
                            );

                            setText(
                              item.sample
                            );
                          }}
                          className={`
                            flex items-center gap-2
                            px-3 sm:px-4 py-2
                            rounded-xl
                            text-xs sm:text-sm
                            font-medium
                            transition
                            ${
                              type ===
                              item.value
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }
                          `}
                        >
                          {item.icon}

                          {item.label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div>

                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    QR Content
                  </label>

                  <textarea
                    value={text}
                    onChange={(e) =>
                      setText(
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Enter URL, WiFi, Email..."
                    className="
                      w-full
                      border border-slate-200
                      rounded-2xl
                      p-4
                      outline-none
                      focus:ring-2
                      focus:ring-indigo-200
                      text-sm
                      resize-none
                    "
                  />
                </div>

                {/* SIZE */}
                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-semibold text-slate-700">
                      QR Size
                    </label>

                    <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">

                      {size}px
                    </div>
                  </div>

                  <input
                    type="range"
                    min="120"
                    max="240"
                    value={size}
                    onChange={(e) =>
                      setSize(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* COLORS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* FOREGROUND */}
                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 mb-3">

                      <Palette className="w-4 h-4 text-indigo-600" />

                      <p className="text-sm font-semibold text-slate-700">
                        Foreground
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) =>
                          setFgColor(
                            e.target.value
                          )
                        }
                        className="w-14 h-12 rounded-xl border border-slate-200"
                      />

                      <div
                        className="flex-1 h-12 rounded-xl border border-slate-200"
                        style={{
                          background:
                            fgColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* BACKGROUND */}
                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 mb-3">

                      <Palette className="w-4 h-4 text-indigo-600" />

                      <p className="text-sm font-semibold text-slate-700">
                        Background
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) =>
                          setBgColor(
                            e.target.value
                          )
                        }
                        className="w-14 h-12 rounded-xl border border-slate-200"
                      />

                      <div
                        className="flex-1 h-12 rounded-xl border border-slate-200"
                        style={{
                          background:
                            bgColor,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* SETTINGS */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">

                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">

                    <h3 className="text-sm font-semibold text-slate-700">
                      QR Settings
                    </h3>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4">

                    <p className="text-sm font-medium text-slate-700">
                      Include Margin
                    </p>

                    <button
                      onClick={() =>
                        setIncludeMargin(
                          !includeMargin
                        )
                      }
                      className={`
                        relative w-11 h-6 rounded-full transition
                        ${
                          includeMargin
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
                            includeMargin
                              ? "translate-x-5"
                              : ""
                          }
                        `}
                      />
                    </button>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-1">

                  <ActionButton
                    onClick={copyText}
                    icon={
                      copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )
                    }
                    label={
                      copied
                        ? "Copied"
                        : "Copy"
                    }
                    gradient="from-indigo-600 to-violet-600"
                  />

                  <ActionButton
                    onClick={downloadQR}
                    icon={
                      <Download className="w-4 h-4" />
                    }
                    label="Download"
                    gradient="from-emerald-500 to-teal-500"
                  />

                  <ActionButton
                    onClick={resetAll}
                    icon={
                      <RefreshCw className="w-4 h-4" />
                    }
                    label="Reset"
                    gradient="from-orange-500 to-red-500"
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">

                {/* QR PREVIEW */}
                <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-center shadow-sm">

                  <div className="flex items-center justify-center gap-2 mb-4">

                    <Shield className="w-5 h-5 text-indigo-600" />

                    <h3 className="text-base sm:text-lg font-bold text-slate-800">
                      Live Preview
                    </h3>
                  </div>

                  <div
                    ref={qrRef}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      overflow-hidden
                      bg-white
                      rounded-3xl
                      border
                      border-slate-200
                      p-3 sm:p-4
                      shadow-sm
                    "
                  >

                    <QRCode
                      value={
                        text ||
                        "https://example.com"
                      }
                      size={Math.min(
                        size,
                        240
                      )}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="H"
                      includeMargin={
                        includeMargin
                      }
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-4">
                    High quality PNG export
                  </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3">

                  <StatsCard
                    title="QR Size"
                    value={`${size}px`}
                  />

                  <StatsCard
                    title="Type"
                    value={type.toUpperCase()}
                  />

                  <StatsCard
                    title="Margin"
                    value={
                      includeMargin
                        ? "Enabled"
                        : "Disabled"
                    }
                  />

                  <StatsCard
                    title="Security"
                    value="High"
                  />
                </div>
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
    </div>
  );
}

/* STATS CARD */
function StatsCard({
  title,
  value,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">

      <p className="text-xs font-medium text-slate-500 mb-2">
        {title}
      </p>

      <h3 className="text-sm sm:text-lg font-bold text-slate-800 truncate">
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
        px-4 sm:px-5 py-2.5 sm:py-3
        rounded-2xl
        bg-gradient-to-r ${gradient}
        text-white
        text-xs sm:text-sm
        font-medium
        shadow-lg hover:scale-[1.02]
        transition
      `}
    >
      {icon}

      {label}
    </button>
  );
}