"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Loader2,
  FileText,
  RotateCcw,
  Download,
} from "lucide-react";

import ImageUploader from "./ImageUploader";

import CustomButton from "../tools/CustomButton";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

// LEVELS
const COMPRESSION_OPTIONS = {
  low: {
    label: "Low",
    description:
      "10–15% reduction",
  },

  medium: {
    label: "Medium",
    description:
      "15–40% reduction",
  },

  strong: {
    label: "Strong",
    description:
      "40–70% reduction",
  },
};

// FORMAT SIZE
function formatBytes(bytes) {
  if (!bytes) return "0 B";

  const k = 1024;

  const sizes = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const i = Math.floor(
    Math.log(bytes) /
      Math.log(k)
  );

  return (
    (
      bytes /
      Math.pow(k, i)
    ).toFixed(1) +
    " " +
    sizes[i]
  );
}

export default function PdfCompressor() {
  const [file, setFile] =
    useState(null);

  const [level, setLevel] =
    useState("medium");

  const [compressing, setCompressing] =
    useState(false);

  const [result, setResult] =
    useState(null);

  // FILE
  const handleFile = (f) => {
    if (!f) return;

    if (
      !f.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert(
        "Upload PDF only"
      );

      return;
    }

    setFile(f);

    setResult(null);
  };

  const handleChange = (e) => {
    const f =
      e.target.files?.[0];

    if (f) handleFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const f =
      e.dataTransfer.files[0];

    if (f) handleFile(f);
  };

  const handleDragOver = (e) =>
    e.preventDefault();

  // RESET
  const handleRemove = () => {
    setFile(null);

    setResult(null);
  };

  // REAL API COMPRESSION
  const handleCompress =
    async () => {
      if (!file) return;

      try {
        setCompressing(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "level",
          level
        );

        const response =
          await fetch(
            "/api/compress",
            {
              method: "POST",
              body: formData,
            }
          );

        if (!response.ok) {
          throw new Error(
            "Compression failed"
          );
        }

        const blob =
          await response.blob();

        let reduction =
          Math.round(
            ((file.size -
              blob.size) /
              file.size) *
              100
          );

        if (reduction < 0) {
          reduction = 0;
        }

        setResult({
          blob,

          originalSize:
            file.size,

          newSize:
            blob.size,

          reduction,

          fileName:
            file.name.replace(
              ".pdf",
              "_compressed.pdf"
            ),
        });
      } catch (err) {
        console.error(err);

        alert(
          "Compression failed"
        );
      } finally {
        setCompressing(false);
      }
    };

  // DOWNLOAD
  const download = () => {
    if (!result) return;

    const url =
      URL.createObjectURL(
        result.blob
      );

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      result.fileName;

    a.click();

    URL.revokeObjectURL(url);
  };

  // RESULT UI
  if (result) {
    return (
      <>
        <div className="max-w-md mx-auto">

          <div className="bg-white rounded-[32px] shadow-xl p-8 text-center space-y-6">

            <div className="w-24 h-24 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                PDF Compressed
              </h2>

              <p className="text-gray-500 mt-2">
                File size reduced
                successfully
              </p>
            </div>

            {/* STATS */}
            <div className="space-y-4">

              <div className="bg-gray-50 rounded-3xl py-6">
                <p className="text-gray-600 text-sm">
                  Original
                </p>

                <h3 className="text-2xl font-black mt-2">
                  {formatBytes(
                    result.originalSize
                  )}
                </h3>
              </div>

              <div className="bg-blue-50 rounded-3xl py-6">
                <p className="text-blue-400 text-sm">
                  New
                </p>

                <h3 className="text-2xl font-black text-blue-600 mt-2">
                  {formatBytes(
                    result.newSize
                  )}
                </h3>
              </div>

              <div className="bg-green-50 rounded-3xl py-6">
                <p className="text-green-500 text-sm">
                  Reduced
                </p>

                <h3 className="text-2xl font-black text-green-600 mt-2">
                  {
                    result.reduction
                  }
                  %
                </h3>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">

              <button
                onClick={
                  handleRemove
                }
                className="
                  w-full h-14
                  rounded-2xl
                  border border-gray-300
                  bg-white
                  text-gray-800
                  font-bold
                  hover:bg-gray-50
                  transition-all
                  flex items-center justify-center gap-2
                "
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>

              <button
                onClick={download}
                className="
                  w-full h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-600
                  text-white
                  font-bold
                  shadow-lg shadow-green-500/20
                  hover:scale-[1.02]
                  transition-all
                  flex items-center justify-center gap-2
                "
              >
                <Download className="w-5 h-5" />
                Download
              </button>
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

  return (
    <>
      <div className="max-w-md mx-auto space-y-6">

        <ImageUploader
          preview={null}
          type="document"
          fileData={
            file
              ? {
                  name: file.name,

                  size:
                    formatBytes(
                      file.size
                    ),
                }
              : null
          }
          onChange={
            handleChange
          }
          onDrop={handleDrop}
          onDragOver={
            handleDragOver
          }
          onRemove={
            handleRemove
          }
        />

        {file && (
          <div className="bg-white rounded-[32px] shadow-xl p-6 space-y-6">

            <div className="text-center">

              <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-black">
                Select Option
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Reduce file size
                while keeping good
                quality
              </p>
            </div>

            {/* LEVELS */}
            <div className="space-y-3">

              {Object.entries(
                COMPRESSION_OPTIONS
              ).map(
                ([key, option]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setLevel(key)
                    }
                    className={`
                      w-full
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition-all
                      ${
                        level === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }
                    `}
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-bold capitalize">
                          {
                            option.label
                          }
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            option.description
                          }
                        </p>
                      </div>

                      <div
                        className={`
                          w-5 h-5 rounded-full border-2
                          ${
                            level === key
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }
                        `}
                      />
                    </div>
                  </button>
                )
              )}
            </div>

            {/* BUTTON */}
            <CustomButton
              onClick={
                handleCompress
              }
            >
              {compressing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Compressing...
                </span>
              ) : (
                "Compress PDF"
              )}
            </CustomButton>
          </div>
        )}
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