"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Download,
  Trash2,
} from "lucide-react";

import ImageUploader from "./ImageUploader";

import ToolLayout from "@/components/ToolLayout";
import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function JPGtoPDF() {
  const [images, setImages] =
    useState([]);

  const [pdfUrl, setPdfUrl] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // HANDLE FILES
  // =========================
  const handleFiles = (files) => {
    const imgs = Array.from(
      files
    ).filter((f) =>
      f.type.startsWith("image/")
    );

    if (imgs.length === 0)
      return;

    // LIMIT
    if (
      imgs.length +
        images.length >
      20
    ) {
      alert(
        "Max 20 images allowed"
      );

      return;
    }

    const previews = imgs.map(
      (file) => ({
        file,
        url:
          URL.createObjectURL(
            file
          ),
      })
    );

    setImages((prev) => [
      ...prev,
      ...previews,
    ]);

    setPdfUrl(null);
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    handleFiles(
      e.target.files
    );
  };

  // =========================
  // DROP
  // =========================
  const handleDrop = (e) => {
    e.preventDefault();

    handleFiles(
      e.dataTransfer.files
    );
  };

  const handleDragOver = (e) =>
    e.preventDefault();

  // =========================
  // REMOVE SINGLE IMAGE
  // =========================
  const removeImage = (
    index
  ) => {
    URL.revokeObjectURL(
      images[index].url
    );

    setImages(
      images.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // RESET
  // =========================
  const reset = () => {
    images.forEach((img) =>
      URL.revokeObjectURL(
        img.url
      )
    );

    setImages([]);

    setPdfUrl(null);
  };

  // =========================
  // CREATE PDF
  // =========================
  const createPDF =
    async () => {
      if (
        images.length === 0
      )
        return;

      try {
        setLoading(true);

        const pdfDoc =
          await PDFDocument.create();

        for (const img of images) {
          const bytes =
            await img.file.arrayBuffer();

          let embedded;

          if (
            img.file.type ===
            "image/png"
          ) {
            embedded =
              await pdfDoc.embedPng(
                bytes
              );
          } else {
            embedded =
              await pdfDoc.embedJpg(
                bytes
              );
          }

          const {
            width,
            height,
          } = embedded;

          // A4 WIDTH
          const maxWidth = 595;

          const scale =
            width > maxWidth
              ? maxWidth / width
              : 1;

          const page =
            pdfDoc.addPage([
              width * scale,
              height * scale,
            ]);

          page.drawImage(
            embedded,
            {
              x: 0,
              y: 0,
              width:
                width * scale,
              height:
                height * scale,
            }
          );
        }

        const pdfBytes =
          await pdfDoc.save();

        const blob = new Blob(
          [pdfBytes],
          {
            type:
              "application/pdf",
          }
        );

        const url =
          URL.createObjectURL(
            blob
          );

        setPdfUrl(url);
      } catch (err) {
        console.error(err);

        alert(
          "Error creating PDF"
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // DOWNLOAD
  // =========================
  const download = () => {
    if (!pdfUrl) return;

    const a =
      document.createElement(
        "a"
      );

    a.href = pdfUrl;

    a.download = "images.pdf";

    a.click();
  };

  return (
    <>
     <div className="container">

        {/* UPLOADER */}
        <ImageUploader
          preview={
            images[0]?.url ||
            null
          }
          type="image"
          fileData={
            images.length > 0
              ? {
                  name: `${images.length} image${
                    images.length >
                    1
                      ? "s"
                      : ""
                  } selected`,
                  size: `${images.length} file(s)`,
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
          onRemove={reset}
        />

        {/* PREVIEW */}
        {images.length >
          0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {images.map(
              (img, i) => (
                <div
                  key={i}
                  className="relative  rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={
                      img.url
                    }
                    alt="preview"
                    className="w-full h-40 object-cover"
                  />

                  <button
                    onClick={() =>
                      removeImage(
                        i
                      )
                    }
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* CONVERT */}
        {images.length >
          0 &&
          !pdfUrl && (
            <button
              onClick={
                createPDF
              }
              disabled={
                loading
              }
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold disabled:opacity-50"
            >
              {loading
                ? "Creating PDF..."
                : "Convert to PDF"}
            </button>
          )}

        {/* RESULT */}
        {pdfUrl && (
          <div className="space-y-4 text-center">

            <div className="bg-green-50 border border-green-200 rounded-2xl py-3 text-green-700 font-semibold">
              PDF created successfully 🎉
            </div>

            <button
              onClick={
                download
              }
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Download
                size={18}
              />
              Download PDF
            </button>

            <button
              onClick={
                reset
              }
              className="w-full h-12 rounded-2xl border border-gray-200 bg-white font-semibold"
            >
              Start Over
            </button>
          </div>
        )}

     

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