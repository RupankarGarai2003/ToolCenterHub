"use client";

import { useState } from "react";

import { renderAsync } from "docx-preview";

import ImageUploader from "./ImageUploader";

import {
  Download,
  Loader2,
  FileText,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";

export default function WordToPDF() {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [previewHtml, setPreviewHtml] =
    useState("");

  // =========================
  // PROCESS DOCX
  // =========================
  const processFile = async (
    selectedFile
  ) => {
    if (!selectedFile) return;

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".docx")
    ) {
      alert(
        "Upload DOCX only"
      );

      return;
    }

    try {
      setLoading(true);

      setSuccess(false);

      setFile(selectedFile);

      const arrayBuffer =
        await selectedFile.arrayBuffer();

      // TEMP CONTAINER
      const container =
        document.createElement(
          "div"
        );

      // DOCX RENDER
      await renderAsync(
        arrayBuffer,
        container,
        undefined,
        {
          className:
            "docx-preview",

          inWrapper: true,

          breakPages: true,

          // IMPORTANT
          renderHeaders: true,

          renderFooters: true,

          renderFootnotes: true,

          renderEndnotes: true,
        }
      );

      // SAVE HTML
      setPreviewHtml(
        container.innerHTML
      );

      setReady(true);
    } catch (err) {
      console.error(err);

      alert(
        "Failed to process DOCX"
      );
    } finally {
      setLoading(false);
    }
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

    setReady(false);

    setSuccess(false);

    setPreviewHtml("");
  };

  // =========================
  // EXPORT PDF
  // =========================
  const handleDownload =
    async () => {
      try {
        const printWindow =
          window.open(
            "",
            "_blank"
          );

        printWindow.document.write(`
          <html>
            <head>
              <title>${file.name}</title>

              <style>

                /* PAGE */
                @page {
                  size: A4;
                  margin: 0;
                }

                html,
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                }

                body{
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }

                *{
                  box-sizing:border-box;
                }

                img{
                  max-width:100%;
                }

                /* DOCX WRAPPER */
                .docx-wrapper{
                  background:white !important;
                  padding:0 !important;
                }

                /* DOC PAGE */
                .docx{
                  margin:auto !important;
                  box-shadow:none !important;
                }

                section{
                  box-shadow:none !important;
                  margin:auto !important;
                }

                /* PRINT */
                @media print {

                  html,
                  body{
                    margin:0 !important;
                    padding:0 !important;
                  }

                  .docx-wrapper{
                    padding:0 !important;
                    margin:0 !important;
                  }

                  .docx{
                    break-after:page;
                    page-break-after:always;
                  }

                  section{
                    break-after:page;
                    page-break-after:always;
                  }

                }

              </style>
            </head>

            <body>
              ${previewHtml}
            </body>
          </html>
        `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {

          // IMPORTANT
          alert(
            "In print dialog disable 'Headers and Footers' for clean PDF export."
          );

          printWindow.print();

          setSuccess(true);

        }, 800);

      } catch (err) {
        console.error(err);

        alert(
          "Failed to generate PDF"
        );
      }
    };

  return (
    <>
    <div className="max-w-md mx-auto space-y-6">

      {/* DOCX GLOBAL CSS */}
      <style jsx global>{`
        .docx-wrapper {
          background: #f5f5f5 !important;
          padding: 20px !important;
        }

        .docx {
          background: white !important;
          margin: auto !important;
          box-shadow: 0 2px 10px
            rgba(0, 0, 0, 0.08) !important;
        }

        section {
          background: white !important;
        }
      `}</style>

      {/* UPLOADER */}
      <ImageUploader
        preview={null}
        type="document"
        fileData={
          file
            ? {
                name: file.name,

                size:
                  (
                    file.size /
                    1024
                  ).toFixed(1) +
                  " KB",
              }
            : null
        }
        onChange={handleChange}
        onDrop={handleDrop}
        onDragOver={
          handleDragOver
        }
        onRemove={
          handleRemove
        }
      />

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-3xl p-8 text-center shadow">

          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />

          <p className="font-semibold">
            Processing DOCX...
          </p>

        </div>
      )}

      {/* READY */}
      {ready && !loading && (
        <div className="bg-white rounded-3xl p-6 shadow space-y-5">

          {/* HEADER */}
          <div className="text-center">

            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">

              <FileText className="w-8 h-8" />

            </div>

            <h2 className="text-xl font-black">
              Ready to Download
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Preserves original Word
              layout with headers &
              footers
            </p>

          </div>

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl py-3 text-green-600 font-semibold flex items-center justify-center gap-2">

              <CheckCircle2 className="w-5 h-5" />

              PDF Generated

            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4">

            <button
              onClick={
                handleRemove
              }
              className="w-full h-12 rounded-2xl border font-semibold flex items-center justify-center gap-2"
            >

              <RotateCcw className="w-4 h-4" />

              Reset

            </button>

            <button
              onClick={
                handleDownload
              }
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
            >

              <Download className="w-4 h-4" />

              Download PDF

            </button>

          </div>

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