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
} from "lucide-react";

import { saveAs } from "file-saver";

export default function PDFToWord() {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [converting, setConverting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [wordBlob, setWordBlob] =
    useState(null);

  const [fileData, setFileData] =
    useState(null);

  // PROCESS FILE
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

    setWordBlob(null);

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

  // INPUT
  const handleChange = (e) => {
    const f =
      e.target.files?.[0];

    if (f) processFile(f);
  };

  // DROP
  const handleDrop = (e) => {
    e.preventDefault();

    const f =
      e.dataTransfer.files?.[0];

    if (f) processFile(f);
  };

  const handleDragOver = (e) =>
    e.preventDefault();

  // RESET
  const handleRemove = () => {
    setFile(null);

    setSuccess(false);

    setWordBlob(null);

    setFileData(null);
  };

  // CONVERT
  const handleConvert =
    async () => {
      if (!file) return;

      try {
        setConverting(true);

        const pdfjsLib =
          await import(
            "pdfjs-dist"
          );

        const {
          Document,
          Packer,
          Paragraph,
          ImageRun,
        } = await import(
          "docx"
        );

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer =
          await file.arrayBuffer();

        const pdf =
          await pdfjsLib.getDocument(
            {
              data: arrayBuffer,
            }
          ).promise;

        const children = [];

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
              scale: 2,
            });

          // CANVAS
          const canvas =
            document.createElement(
              "canvas"
            );

          const context =
            canvas.getContext("2d");

          canvas.width =
            viewport.width;

          canvas.height =
            viewport.height;

          await page.render({
            canvasContext:
              context,

            viewport,
          }).promise;

          // IMAGE
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

          // DOCX PAGE
          children.push(
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

        // DOCX
        const doc =
          new Document({
            sections: [
              {
                children,
              },
            ],
          });

        const blob =
          await Packer.toBlob(
            doc
          );

        setWordBlob(blob);

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

  // DOWNLOAD
  const handleDownload = () => {
    if (!wordBlob) return;

    const filename =
      file.name.replace(
        /\.pdf$/i,
        ".docx"
      );

    saveAs(
      wordBlob,
      filename
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-8">

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

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-3xl p-8 text-center shadow">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />

          <p className="font-semibold">
            Reading PDF...
          </p>
        </div>
      )}

      {/* READY */}
      {file && (
        <div className="bg-white rounded-3xl p-6 shadow space-y-5">

          <div className="text-center">

            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black">
              PDF to Word
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Preserve original
              layout and design
            </p>
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl py-3 text-green-600 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              DOCX Ready
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4">

            {/* RESET */}
            <button
              onClick={
                handleRemove
              }
              className="w-full h-12 rounded-2xl border font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            {/* CONVERT */}
            {!success ? (
              <button
                onClick={
                  handleConvert
                }
                disabled={
                  converting
                }
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                {converting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Convert
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={
                  handleDownload
                }
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
        <Shield size={16} />
        Your files remain private
      </p>
    </div>
  );
}