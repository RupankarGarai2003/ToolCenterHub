"use client";

import { useState } from "react";

import ImageUploader from "./ImageUploader";

import {
  Download,
  Loader2,
  RotateCcw,
  Shield,
  CheckCircle2,
  FileText,
  ScanText,
} from "lucide-react";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

import { saveAs } from "file-saver";

export default function PDFToWord() {
  const [file, setFile] =
    useState(null);

  const [converting, setConverting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [layoutBlob, setLayoutBlob] =
    useState(null);

  const [ocrBlob, setOcrBlob] =
    useState(null);

  const [selectedMode, setSelectedMode] =
    useState(null);

  const [fileData, setFileData] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  // =========================
  // PROCESS FILE
  // =========================
  const processFile = (
    selectedFile
  ) => {
    if (!selectedFile) return;

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      alert(
        "Upload PDF only"
      );

      return;
    }

    setFile(selectedFile);

    setSuccess(false);

    setLayoutBlob(null);

    setOcrBlob(null);

    setSelectedMode(null);

    setProgress(0);

    setFileData({
      name: selectedFile.name,

      size:
        (
          selectedFile.size /
          1024
        ).toFixed(1) +
        " KB",
    });
  };

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    const f =
      e.target.files?.[0];

    if (f) processFile(f);
  };

  // =========================
  // DROP
  // =========================
  const handleDrop = (e) => {
    e.preventDefault();

    const f =
      e.dataTransfer.files?.[0];

    if (f) processFile(f);
  };

  const handleDragOver = (e) =>
    e.preventDefault();

  // =========================
  // RESET
  // =========================
  const handleRemove = () => {
    setFile(null);

    setSuccess(false);

    setLayoutBlob(null);

    setOcrBlob(null);

    setSelectedMode(null);

    setFileData(null);

    setProgress(0);
  };

  // =========================
  // CONVERT
  // =========================
  const handleConvert =
    async (mode) => {
      if (!file) return;

      try {
        setSelectedMode(mode);

        setConverting(true);

        const pdfjsLib =
          await import(
            "pdfjs-dist"
          );

        const Tesseract =
          await import(
            "tesseract.js"
          );

        const {
          Document,
          Packer,
          Paragraph,
          ImageRun,
          TextRun,
          HeadingLevel,
        } = await import(
          "docx"
        );

        // PDF WORKER
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        // LOAD PDF
        const arrayBuffer =
          await file.arrayBuffer();

        const pdf =
          await pdfjsLib.getDocument(
            {
              data: arrayBuffer,
            }
          ).promise;

        // NORMAL DOCX
        const layoutChildren =
          [];

        // OCR DOCX
        const ocrChildren = [];

        // LOOP PAGES
        for (
          let i = 1;
          i <= pdf.numPages;
          i++
        ) {
          setProgress(
            Math.floor(
              (i /
                pdf.numPages) *
                100
            )
          );

          const page =
            await pdf.getPage(i);

          const viewport =
            page.getViewport({
              scale: 2,
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

          await page.render({
            canvasContext:
              context,

            viewport,
          }).promise;

          // =========================
          // WITHOUT OCR
          // =========================
          if (
            mode === "normal"
          ) {
            const dataUrl =
              canvas.toDataURL(
                "image/png"
              );

            const imageBytes =
              await fetch(
                dataUrl
              ).then((res) =>
                res.arrayBuffer()
              );

            layoutChildren.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBytes,

                    transformation:
                      {
                        width: 520,

                        height:
                          (viewport.height *
                            520) /
                          viewport.width,
                      },
                  }),
                ],
              })
            );
          }

          // =========================
          // OCR
          // =========================
          if (
            mode === "ocr"
          ) {
            const result =
              await Tesseract.recognize(
                canvas,
                "eng"
              );

            const text =
              result.data.text;

            ocrChildren.push(
              new Paragraph({
                text: `Page ${i}`,
                heading:
                  HeadingLevel.HEADING_2,
              })
            );

            const paragraphs =
              text
                .split(/\n+/)
                .filter(
                  (p) =>
                    p.trim() !==
                    ""
                );

            paragraphs.forEach(
              (para) => {
                ocrChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text:
                          para.trim(),

                        size: 24,
                      }),
                    ],
                  })
                );
              }
            );
          }
        }

        // =========================
        // NORMAL DOCX
        // =========================
        if (
          mode === "normal"
        ) {
          const layoutDoc =
            new Document({
              sections: [
                {
                  children:
                    layoutChildren,
                },
              ],
            });

          const layoutBlobData =
            await Packer.toBlob(
              layoutDoc
            );

          setLayoutBlob(
            layoutBlobData
          );
        }

        // =========================
        // OCR DOCX
        // =========================
        if (
          mode === "ocr"
        ) {
          const ocrDoc =
            new Document({
              sections: [
                {
                  children:
                    ocrChildren,
                },
              ],
            });

          const ocrBlobData =
            await Packer.toBlob(
              ocrDoc
            );

          setOcrBlob(
            ocrBlobData
          );
        }

        setSuccess(true);
      } catch (err) {
        console.error(err);

        alert(
          "Conversion failed"
        );
      } finally {
        setConverting(false);
      }
    };

  // =========================
  // DOWNLOADS
  // =========================
  const downloadLayout = () => {
    if (!layoutBlob) return;

    saveAs(
      layoutBlob,
      file.name.replace(
        /\.pdf$/i,
        "-layout.docx"
      )
    );
  };

  const downloadOCR = () => {
    if (!ocrBlob) return;

    saveAs(
      ocrBlob,
      file.name.replace(
        /\.pdf$/i,
        "-ocr.docx"
      )
    );
  };

  return (
    <>
    <div className="max-w-lg mx-auto px-3 py-3 space-y-4">

      {/* UPLOADER */}
      <ImageUploader
        preview={null}
        type="document"
        fileData={fileData}
        onChange={handleChange}
        onDrop={handleDrop}
        onDragOver={
          handleDragOver
        }
        onRemove={
          handleRemove
        }
      />

      {/* CARD */}
      {file && (
        <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-5 space-y-5">

          {/* HEADER */}
          <div className="text-center space-y-3">

            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ScanText className="w-8 h-8" />
            </div>

          </div>

          {/* FILE INFO */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center justify-between">

            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {fileData?.name}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {fileData?.size}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* PROGRESS */}
          {converting && (
            <div>

              <div className="flex items-center justify-between mb-2 text-sm font-semibold">
                <span>
                  {selectedMode ===
                  "ocr"
                    ? "OCR Processing"
                    : "Converting PDF"}
                </span>

                <span>
                  {progress}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* BEFORE SUCCESS */}
          {!success && (
            <div className="space-y-4">

              {/* OPTIONS */}
              <div className="grid gap-3">

                {/* NORMAL */}
                <button
                  onClick={() =>
                    setSelectedMode(
                      "normal"
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition-all
                    ${
                      selectedMode ===
                      "normal"
                        ? "border-blue-500 bg-blue-50"
                        : "border-blue-200 bg-blue-50/50"
                    }`}
                >
                  <h3 className="font-bold text-gray-900">
                    Without OCR
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Faster and
                    preserves original
                    layout.
                  </p>
                </button>

                {/* OCR */}
                <button
                  onClick={() =>
                    setSelectedMode(
                      "ocr"
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition-all
                    ${
                      selectedMode ===
                      "ocr"
                        ? "border-purple-500 bg-purple-50"
                        : "border-purple-200 bg-purple-50/50"
                    }`}
                >
                  <h3 className="font-bold text-gray-900">
                    With OCR
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Best for scanned
                    PDFs and images.
                  </p>
                </button>
              </div>

              {/* BUTTONS */}
              {!converting && (
                <div className="grid grid-cols-2 gap-3">

                  {/* RESET */}
                  <button
                    onClick={
                      handleRemove
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>

                  {/* CONVERT */}
                  <button
                    disabled={
                      !selectedMode
                    }
                    onClick={() =>
                      handleConvert(
                        selectedMode
                      )
                    }
                    className={`h-12 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition
                      ${
                        !selectedMode
                          ? "bg-gray-300 cursor-not-allowed"
                          : selectedMode ===
                            "ocr"
                          ? "bg-gradient-to-r from-purple-500 to-pink-600"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600"
                      }`}
                  >
                    <Download className="w-4 h-4" />
                    Convert Now
                  </button>
                </div>
              )}

              {/* LOADING */}
              {converting && (
                <div className="bg-gray-50 rounded-2xl p-5 text-center">

                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />

                  <p className="font-semibold text-sm">
                    {selectedMode ===
                    "ocr"
                      ? "OCR Processing..."
                      : "Converting PDF..."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="space-y-3">

              <div className="bg-green-50 border border-green-200 rounded-2xl py-3 text-green-700 font-semibold flex items-center justify-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5" />
                DOCX Ready
              </div>

              {/* DOWNLOAD */}
              <button
                onClick={() => {
                  if (
                    selectedMode ===
                    "ocr"
                  ) {
                    downloadOCR();
                  } else {
                    downloadLayout();
                  }
                }}
                className={`w-full h-12 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition
                  ${
                    selectedMode ===
                    "ocr"
                      ? "bg-gradient-to-r from-purple-500 to-pink-600"
                      : "bg-gradient-to-r from-blue-500 to-cyan-600"
                  }`}
              >
                <Download className="w-5 h-5" />
                Download DOCX
              </button>

              {/* AGAIN */}
              <button
                onClick={
                  handleRemove
                }
                className="w-full h-12 rounded-2xl border border-gray-200 bg-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Upload Another PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
     
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