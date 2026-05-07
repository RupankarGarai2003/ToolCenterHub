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

  const processFile = async (
    selectedFile
  ) => {
    if (!selectedFile) return;

    if (
      !selectedFile.name.endsWith(
        ".docx"
      )
    ) {
      alert(
        "Upload DOCX only"
      );
      return;
    }

    try {
      setLoading(true);

      setFile(selectedFile);

      const arrayBuffer =
        await selectedFile.arrayBuffer();

      const container =
        document.createElement(
          "div"
        );

      await renderAsync(
        arrayBuffer,
        container
      );

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

  const handleChange = (e) => {
    const f =
      e.target.files?.[0];

    if (f) processFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const f =
      e.dataTransfer.files?.[0];

    if (f) processFile(f);
  };

  const handleDragOver = (e) =>
    e.preventDefault();

  const handleRemove = () => {
    setFile(null);

    setReady(false);

    setSuccess(false);

    setPreviewHtml("");
  };

  // BEST PDF METHOD
  const handleDownload = async () => {
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
              body{
                margin:0;
                padding:20px;
                background:white;
              }

              img{
                max-width:100%;
              }

              *{
                box-sizing:border-box;
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
        printWindow.print();

        setSuccess(true);
      }, 500);
    } catch (err) {
      console.error(err);

      alert(
        "Failed to generate PDF"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">

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

      {loading && (
        <div className="bg-white rounded-3xl p-8 text-center shadow">

          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />

          <p className="font-semibold">
            Processing DOCX...
          </p>
        </div>
      )}

      {ready && !loading && (
        <div className="bg-white rounded-3xl p-6 shadow space-y-5">

          <div className="text-center">

            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black">
              Ready to Export
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Preserves original
              Word layout
            </p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl py-3 text-green-600 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              PDF Generated
            </div>
          )}

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
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}