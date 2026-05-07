"use client";

import {
  useState,
  useEffect,
  useMemo,
} from "react";

import { PDFDocument } from "pdf-lib";

import JSZip from "jszip";

import { saveAs } from "file-saver";

import {
  Download,
  Scissors,
  RotateCcw,
  FileText,
  Shield,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import ImageUploader from "./ImageUploader";

/* HELPERS */
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";

  const k = 1024;

  const sizes = ["B", "KB", "MB"];

  const i = Math.floor(
    Math.log(bytes) / Math.log(k)
  );

  return (
    (
      bytes / Math.pow(k, i)
    ).toFixed(1) +
    " " +
    sizes[i]
  );
};

const parseRanges = (
  input,
  maxPages
) => {
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const pages = new Set();

  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part
        .split("-")
        .map(Number);

      if (
        isNaN(a) ||
        isNaN(b)
      ) {
        continue;
      }

      for (let i = a; i <= b; i++) {
        if (
          i >= 1 &&
          i <= maxPages
        ) {
          pages.add(i);
        }
      }
    } else {
      const n = parseInt(part);

      if (
        !isNaN(n) &&
        n >= 1 &&
        n <= maxPages
      ) {
        pages.add(n);
      }
    }
  }

  return Array.from(pages).sort(
    (a, b) => a - b
  );
};

export default function PDFSplitter() {
  const [file, setFile] =
    useState(null);

  const [pageCount, setPageCount] =
    useState(0);

  const [mode, setMode] =
    useState("each");

  const [ranges, setRanges] =
    useState("");

  const [rangeError, setRangeError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [results, setResults] =
    useState([]);

  const [success, setSuccess] =
    useState(false);

  /* PARSED PAGES */
  const parsedPages = useMemo(() => {
    return parseRanges(
      ranges,
      pageCount
    );
  }, [ranges, pageCount]);

  /* CLEAN URLS */
  const clearResults = () => {
    results.forEach((r) => {
      URL.revokeObjectURL(r.url);
    });
  };

  /* AUTO CLEANUP */
  useEffect(() => {
    return () => {
      results.forEach((r) => {
        URL.revokeObjectURL(r.url);
      });
    };
  }, [results]);

  /* HANDLE FILE */
  const handleFile = async (f) => {
    if (
      !f ||
      f.type !== "application/pdf"
    ) {
      alert("Upload PDF only");
      return;
    }

    if (
      f.size >
      50 * 1024 * 1024
    ) {
      alert(
        "Maximum file size is 50MB"
      );
      return;
    }

    clearResults();

    setFile(f);

    setResults([]);

    setSuccess(false);

    const bytes =
      await f.arrayBuffer();

    const pdf =
      await PDFDocument.load(bytes);

    setPageCount(
      pdf.getPageCount()
    );
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

  const handleDragLeave = () => {};

  /* RANGE CHANGE */
  const handleRangeChange = (e) => {
    const value = e.target.value;

    setRanges(value);

    const parsed = parseRanges(
      value,
      pageCount
    );

    if (
      value &&
      !parsed.length
    ) {
      setRangeError(
        "Invalid page range"
      );
    } else {
      setRangeError("");
    }
  };

  /* REMOVE */
  const handleRemove = () => {
    clearResults();

    setFile(null);

    setResults([]);

    setProgress(0);

    setRanges("");

    setRangeError("");
  };

  /* SPLIT */
  const handleSplit = async () => {
    if (!file) return;

    try {
      setLoading(true);

      setProgress(0);

      setSuccess(false);

      const bytes =
        await file.arrayBuffer();

      const pdf =
        await PDFDocument.load(bytes);

      const cleanName =
        file.name.replace(
          /\.pdf$/i,
          ""
        );

      let outputs = [];

      /* EACH PAGE */
      if (mode === "each") {
        for (
          let i = 0;
          i < pdf.getPageCount();
          i++
        ) {
          const newPdf =
            await PDFDocument.create();

          const [page] =
            await newPdf.copyPages(
              pdf,
              [i]
            );

          newPdf.addPage(page);

          const pdfBytes =
            await newPdf.save();

          const blob =
            new Blob([pdfBytes], {
              type: "application/pdf",
            });

          outputs.push({
            url:
              URL.createObjectURL(
                blob
              ),

            blob,

            name:
              cleanName +
              "_page_" +
              (i + 1) +
              ".pdf",

            size: blob.size,
          });

          setProgress(
            ((i + 1) /
              pdf.getPageCount()) *
              100
          );
        }
      }

      /* CUSTOM / ODD / EVEN */
      else {
        let pages = [];

        if (mode === "ranges") {
          pages = parseRanges(
            ranges,
            pdf.getPageCount()
          );

          if (!pages.length) {
            setRangeError(
              "Invalid page range"
            );

            setLoading(false);

            return;
          }
        }

        if (mode === "odd") {
          for (
            let i = 1;
            i <= pdf.getPageCount();
            i++
          ) {
            if (i % 2 !== 0) {
              pages.push(i);
            }
          }
        }

        if (mode === "even") {
          for (
            let i = 1;
            i <= pdf.getPageCount();
            i++
          ) {
            if (i % 2 === 0) {
              pages.push(i);
            }
          }
        }

        const newPdf =
          await PDFDocument.create();

        const copied =
          await newPdf.copyPages(
            pdf,
            pages.map(
              (p) => p - 1
            )
          );

        copied.forEach((p) =>
          newPdf.addPage(p)
        );

        const pdfBytes =
          await newPdf.save();

        const blob =
          new Blob([pdfBytes], {
            type: "application/pdf",
          });

        outputs.push({
          url:
            URL.createObjectURL(
              blob
            ),

          blob,

          name:
            cleanName +
            "_" +
            mode +
            ".pdf",

          size: blob.size,
        });

        setProgress(100);
      }

      setResults(outputs);

      setSuccess(true);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to split PDF"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ZIP DOWNLOAD */
  const downloadAll = async () => {
    const zip = new JSZip();

    results.forEach((r) => {
      zip.file(r.name, r.blob);
    });

    const content =
      await zip.generateAsync({
        type: "blob",
      });

    saveAs(
      content,
      "split-pdf-files.zip"
    );
  };

  /* RESET */
  const reset = () => {
    clearResults();

    setFile(null);

    setResults([]);

    setRanges("");

    setMode("each");

    setProgress(0);

    setSuccess(false);

    setRangeError("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">

      {/* UPLOADER */}
      {!file && (
        <ImageUploader
          preview={null}
          type="document"
          fileData={null}
          onChange={handleChange}
          onDrop={handleDrop}
          onDragOver={
            handleDragOver
          }
          onDragLeave={
            handleDragLeave
          }
          onRemove={() => {}}
        />
      )}

      {/* FILE */}
      {file && !results.length && (
        <div className="space-y-5">

          <div
            className="
              flex items-center gap-3
              bg-gray-100
              rounded-2xl
              p-4
            "
          >

            <FileText className="text-blue-600" />

            <div>
              <p className="font-semibold">
                {file.name}
              </p>

              <p className="text-xs text-gray-500">
                {formatBytes(
                  file.size
                )}{" "}
                • {pageCount} pages
              </p>
            </div>
          </div>

          {/* MODES */}
          <div className="grid grid-cols-2 gap-3">

            {[
              {
                key: "each",
                label:
                  "Each Page",
              },

              {
                key: "ranges",
                label:
                  "Custom",
              },

              {
                key: "odd",
                label: "Odd",
              },

              {
                key: "even",
                label: "Even",
              },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() =>
                  setMode(m.key)
                }
                disabled={loading}
                className={`
                  h-11 rounded-2xl
                  border text-sm font-semibold
                  transition-all duration-300
                  ${
                    mode === m.key
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* RANGE INPUT */}
          {mode === "ranges" && (
            <div>

              <input
                value={ranges}
                onChange={
                  handleRangeChange
                }
                placeholder="1-3,5"
                className="
                  w-full
                  h-11
                  border border-gray-300
                  rounded-2xl
                  px-4
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-blue-200
                "
              />

              {rangeError && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">

                  <XCircle className="w-3 h-3" />

                  {rangeError}
                </div>
              )}

              {parsedPages.length >
                0 && (
                <div className="flex flex-wrap gap-2 mt-3">

                  {parsedPages.map(
                    (p) => (
                      <span
                        key={p}
                        className="
                            px-3 py-1 rounded-full
                            bg-blue-100 text-blue-700
                            text-xs font-semibold
                          "
                      >
                        {p}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* PROGRESS */}
          {loading && (
            <div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                <div
                  className="
                    h-full
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    transition-all
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-xs text-center mt-2 text-gray-500">
                {Math.round(
                  progress
                )}
                %
              </p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4">

            {/* SPLIT */}
            <button
              onClick={handleSplit}
              disabled={
                loading ||
                !!rangeError
              }
              className="
                w-full
                flex items-center justify-center gap-2
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-semibold text-sm
                shadow-lg shadow-blue-500/20
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-300
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  Split PDF
                </>
              )}
            </button>

            {/* CHANGE */}
            <button
              onClick={
                handleRemove
              }
              disabled={loading}
              className="
                w-full
                flex items-center justify-center gap-2
                h-11
                rounded-2xl
                border border-gray-300
                bg-white
                text-gray-700
                font-semibold text-sm
                hover:bg-gray-50
                transition-all duration-300
              "
            >
              <RotateCcw className="w-4 h-4" />
              Change File
            </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="space-y-4">

          {/* SUCCESS */}
          {success && (
            <div
              className="
                flex items-center justify-center gap-2
                text-green-600
                font-bold text-lg
              "
            >
              <CheckCircle2 className="w-5 h-5 animate-bounce" />
              Split Complete
            </div>
          )}

          {/* FILE LIST */}
          <div className="space-y-2 max-h-72 overflow-y-auto">

            {results.map((r, i) => (
              <div
                key={i}
                className="
                  flex justify-between items-center
                  p-3
                  border border-gray-200
                  rounded-2xl
                  bg-white
                "
              >

                <div>
                  <p className="text-sm font-semibold">
                    {r.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatBytes(
                      r.size
                    )}
                  </p>
                </div>

                <a
                  href={r.url}
                  download={r.name}
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    flex items-center justify-center
                    hover:bg-blue-100
                    transition-all
                  "
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {/* RESULT BUTTONS */}
          <div className="flex gap-4">

            {/* ZIP */}
            <button
              onClick={downloadAll}
              className="
                w-full
                flex items-center justify-center gap-2
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                text-white
                font-bold text-sm
                shadow-lg shadow-green-500/20
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <Download className="w-4 h-4" />
              Download ZIP
            </button>

            {/* RESET */}
            <button
              onClick={reset}
              className="
                w-full
                flex items-center justify-center gap-2
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-red-500
                text-white
                font-bold text-sm
                shadow-lg shadow-orange-500/20
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <p
        className="
          text-xs text-center text-gray-500
          flex items-center justify-center gap-2
        "
      >
        <Shield size={16} />
        Your files remain private
      </p>
    </div>
  );
}