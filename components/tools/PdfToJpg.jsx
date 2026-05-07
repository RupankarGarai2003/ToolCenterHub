"use client";

import { useState } from "react";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import {
  Upload,
  Download,
  RotateCcw,
  Loader2,
} from "lucide-react";

// PDF.JS WORKER
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfToJpg() {
  const [file, setFile] = useState(null);

  const [images, setImages] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  // HANDLE FILE
  const handleFile = (selectedFile) => {
    if (
      selectedFile &&
      selectedFile.type ===
        "application/pdf"
    ) {
      setFile(selectedFile);

      setImages([]);

      setProgress(0);
    }
  };

  // CONVERT PDF
  const convertToImages = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const arrayBuffer =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

      const totalPages = pdf.numPages;

      const output = [];

      for (
        let pageNum = 1;
        pageNum <= totalPages;
        pageNum++
      ) {
        const page =
          await pdf.getPage(pageNum);

        const viewport =
          page.getViewport({
            scale: 2,
          });

        const canvas =
          document.createElement(
            "canvas"
          );

        const context =
          canvas.getContext("2d");

        canvas.width = viewport.width;

        canvas.height =
          viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const image =
          canvas.toDataURL(
            "image/jpeg",
            1
          );

        const fileName =
          file.name.replace(
            ".pdf",
            ""
          );

        output.push({
          url: image,

          name:
            fileName +
            "-page-" +
            pageNum +
            ".jpg",
        });

        setProgress(
          Math.round(
            (pageNum / totalPages) *
              100
          )
        );
      }

      setImages(output);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to convert PDF"
      );
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD ALL
  const downloadAll = async () => {
    for (const img of images) {
      const link =
        document.createElement("a");

      link.href = img.url;

      link.download = img.name;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      await new Promise((r) =>
        setTimeout(r, 150)
      );
    }
  };

  // RESET
  const reset = () => {
    setFile(null);

    setImages([]);

    setProgress(0);

    setLoading(false);
  };

  return (
    <div className="w-full py-4">

      <div className="max-w-5xl mx-auto">

        {/* UPLOAD */}
        {!file && (
          <label
            className="
              border-2 border-dashed
              border-gray-300
              rounded-3xl
              p-10
              flex flex-col
              items-center
              justify-center
              cursor-pointer
              hover:bg-gray-50
              transition-all
            "
          >

            <Upload className="w-12 h-12 text-blue-500 mb-4" />

            <p className="font-semibold text-lg">
              Upload PDF
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Click to browse your file
            </p>

            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                handleFile(
                  e.target.files[0]
                )
              }
            />
          </label>
        )}

        {/* FILE INFO */}
        {file &&
          images.length === 0 && (
            <div className="space-y-5">

              <div
                className="
                  bg-gray-50
                  border border-gray-200
                  rounded-2xl
                  p-4
                "
              >

                <p className="font-semibold">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  PDF Ready
                </p>
              </div>

              {/* PROGRESS */}
              {loading && (
                <div>

                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="
                        h-full
                        bg-blue-500
                        transition-all
                      "
                      style={{
                        width:
                          progress + "%",
                      }}
                    />
                  </div>

                  <p className="text-center text-sm mt-2 text-gray-600">
                    {progress}% Processing...
                  </p>
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={
                  convertToImages
                }
                disabled={loading}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  flex items-center
                  justify-center
                  gap-2
                  transition-all
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert to JPG"
                )}
              </button>
            </div>
          )}

        {/* RESULTS */}
        {images.length > 0 && (
          <div className="space-y-6">

            {/* IMAGE GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {images.map((img, index) => (
                <div
                  key={index}
                  className="
                    border border-gray-200
                    rounded-2xl
                    overflow-hidden
                    bg-white
                  "
                >

                  <img
                    src={img.url}
                    alt={"page-" + index}
                    className="
                      w-full
                      h-52
                      object-cover
                    "
                  />

                  <a
                    href={img.url}
                    download={img.name}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      text-blue-600
                      hover:bg-blue-50
                      transition-all
                    "
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="grid md:grid-cols-2 gap-4">

              <button
                onClick={downloadAll}
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                "
              >
                Download All
              </button>

              <button
                onClick={reset}
                className="
                  border border-gray-300
                  py-3
                  rounded-2xl
                  font-semibold
                  hover:bg-gray-50
                  transition-all
                "
              >
                <RotateCcw className="inline w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}