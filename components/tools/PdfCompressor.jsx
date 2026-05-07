"use client";

import { useState } from "react";

import { PDFDocument } from "pdf-lib";

import * as pdfjsLib from "pdfjs-dist";

import {
  Shield,
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

// PDF.JS WORKER
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// REALISTIC COMPRESSION LEVELS
const COMPRESSION_OPTIONS = {
  low: {
    scale: 1.2,
    quality: 0.65,
    label: "Low",
    description: "10–20% reduction",
  },

  medium: {
    scale: 0.9,
    quality: 0.45,
    label: "Medium",
    description: "20–40% reduction",
  },

  strong: {
    scale: 0.65,
    quality: 0.22,
    label: "Strong",
    description: "40–70% reduction",
  },
};

// FORMAT BYTES
function formatBytes(bytes) {
  if (!bytes) return "0 B";

  const k = 1024;

  const sizes = [
    "B",
    "KB",
    "MB",
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

export default function PDFCompressor() {
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

  // REAL PDF COMPRESSION
  const handleCompress =
    async () => {
      if (!file) return;

      try {
        setCompressing(true);

        const config =
          COMPRESSION_OPTIONS[
            level
          ];

        const arrayBuffer =
          await file.arrayBuffer();

        // LOAD PDF
        const pdf =
          await pdfjsLib.getDocument(
            {
              data: arrayBuffer,
            }
          ).promise;

        // CREATE NEW PDF
        const newPdf =
          await PDFDocument.create();

        // EACH PAGE
        for (
          let i = 1;
          i <= pdf.numPages;
          i++
        ) {
          const page =
            await pdf.getPage(i);

          const viewport =
            page.getViewport({
              scale:
                config.scale,
            });

          // CANVAS
          const canvas =
            document.createElement(
              "canvas"
            );

          const context =
            canvas.getContext(
              "2d"
            );

          canvas.width =
            viewport.width;

          canvas.height =
            viewport.height;

          // RENDER PAGE
          await page.render({
            canvasContext:
              context,

            viewport,
          }).promise;

          // JPEG IMAGE
          const imageData =
            canvas.toDataURL(
              "image/jpeg",
              config.quality
            );

          const jpgImage =
            await newPdf.embedJpg(
              imageData
            );

          // ADD PAGE
          const pdfPage =
            newPdf.addPage([
              viewport.width,
              viewport.height,
            ]);

          pdfPage.drawImage(
            jpgImage,
            {
              x: 0,
              y: 0,
              width:
                viewport.width,
              height:
                viewport.height,
            }
          );
        }

        // SAVE NEW PDF
        const pdfBytes =
          await newPdf.save();

        const blob =
          new Blob(
            [pdfBytes],
            {
              type:
                "application/pdf",
            }
          );

        // REDUCTION
        let reduction =
          Math.round(
            ((file.size -
              blob.size) /
              file.size) *
              100
          );

        // NEVER NEGATIVE
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

            {/* ICON */}
            <div className="w-24 h-24 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            {/* TITLE */}
            <div>
              <h2 className="text-4xl font-black text-gray-900">
                PDF Compressed
              </h2>

              <p className="text-gray-500 mt-2">
                File size reduced
                successfully
              </p>
            </div>

            {/* STATS */}
            <div className="space-y-4">

              {/* ORIGINAL */}
              <div className="bg-gray-50 rounded-3xl py-6">
                <p className="text-gray-400 text-sm">
                  Original
                </p>

                <h3 className="text-3xl font-black mt-2">
                  {formatBytes(
                    result.originalSize
                  )}
                </h3>
              </div>

              {/* NEW */}
              <div className="bg-blue-50 rounded-3xl py-6">
                <p className="text-blue-400 text-sm">
                  New
                </p>

                <h3 className="text-3xl font-black text-blue-600 mt-2">
                  {formatBytes(
                    result.newSize
                  )}
                </h3>
              </div>

              {/* REDUCED */}
              <div className="bg-green-50 rounded-3xl py-6">
                <p className="text-green-500 text-sm">
                  Reduced
                </p>

                <h3 className="text-3xl font-black text-green-600 mt-2">
                  {
                    result.reduction
                  }
                  %
                </h3>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">

              {/* RESET */}
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

              {/* DOWNLOAD */}
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

          {/* FOOTER */}
          <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2 mt-6">
            <Shield size={16} />
            Files are processed
            locally in your browser
          </p>
        </div>

        {/* CONTENT */}
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

  // MAIN UI
  return (
    <>
      <div className="max-w-md mx-auto space-y-6">

        {/* UPLOADER */}
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

        {/* OPTIONS */}
        {file && (
          <div className="bg-white rounded-[32px] shadow-xl p-6 space-y-6">

            {/* HEADER */}
            <div className="text-center">

              <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black">
                Compress PDF
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

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
          <Shield size={16} />
          Files are processed
          locally in your browser
        </p>
      </div>

      {/* CONTENT */}
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