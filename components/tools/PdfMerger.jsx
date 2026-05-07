"use client";

import {
  useState,
  useEffect,
} from "react";

import { PDFDocument } from "pdf-lib";

import {
  Download,
  Trash2,
  RotateCcw,
  FileText,
  Loader2,
  Shield,
  CheckCircle2,
  Plus,
} from "lucide-react";

import ImageUploader from "./ImageUploader";

/* HELPERS */
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";

  const k = 1024;

  const sizes = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

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

export default function PDFMerger() {
  const [files, setFiles] =
    useState([]);

  const [mergedUrl, setMergedUrl] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [success, setSuccess] =
    useState(false);

  /* CLEANUP */
  useEffect(() => {
    return () => {
      if (mergedUrl) {
        URL.revokeObjectURL(
          mergedUrl
        );
      }
    };
  }, [mergedUrl]);

  /* HANDLE FILE */
  const handleFile = (file) => {
    if (!file) return;

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Only PDF files allowed"
      );

      return;
    }

    // 50MB LIMIT
    if (
      file.size >
      50 * 1024 * 1024
    ) {
      alert(
        "Maximum file size is 50MB"
      );

      return;
    }

    // DUPLICATE CHECK
    const exists = files.some(
      (f) =>
        f.name === file.name &&
        f.size === file.size
    );

    if (exists) {
      alert(
        "File already added"
      );

      return;
    }

    setFiles((prev) => [
      ...prev,
      file,
    ]);

    setMergedUrl(null);

    setSuccess(false);
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

  /* REMOVE FILE */
  const removeFile = (index) => {
    setFiles(
      files.filter(
        (_, i) => i !== index
      )
    );
  };

  /* RESET */
  const reset = () => {
    if (mergedUrl) {
      URL.revokeObjectURL(
        mergedUrl
      );
    }

    setFiles([]);

    setMergedUrl(null);

    setLoading(false);

    setProgress(0);

    setSuccess(false);
  };

  /* MERGE PDFS */
  const mergePDFs = async () => {
    if (files.length < 2)
      return;

    try {
      setLoading(true);

      setProgress(0);

      setSuccess(false);

      const mergedPdf =
        await PDFDocument.create();

      for (
        let i = 0;
        i < files.length;
        i++
      ) {
        const file = files[i];

        const bytes =
          await file.arrayBuffer();

        const pdf =
          await PDFDocument.load(
            bytes
          );

        const copiedPages =
          await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );

        copiedPages.forEach(
          (page) =>
            mergedPdf.addPage(page)
        );

        setProgress(
          ((i + 1) /
            files.length) *
            100
        );
      }

      const mergedBytes =
        await mergedPdf.save();

      const blob = new Blob(
        [mergedBytes],
        {
          type: "application/pdf",
        }
      );

      const url =
        URL.createObjectURL(blob);

      setMergedUrl(url);

      setSuccess(true);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to merge PDFs"
      );
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */
  const download = () => {
    if (!mergedUrl) return;

    const a =
      document.createElement("a");

    a.href = mergedUrl;

    a.download =
      "merged-document.pdf";

    a.click();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">

      {/* UPLOADER */}
      {!mergedUrl && (
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

      {/* FILES */}
      {files.length > 0 && (
        <div className="space-y-3">

          {files.map(
            (file, index) => (
              <div
                key={index}
                className="
                  flex items-center justify-between
                  gap-3
                  p-4
                  border border-gray-200
                  rounded-2xl
                  bg-white
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div
                    className="
                      w-11 h-11
                      rounded-xl
                      bg-red-50
                      text-red-500
                      flex items-center justify-center
                      shrink-0
                    "
                  >
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold truncate">
                      {file.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {formatBytes(
                        file.size
                      )}
                    </p>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeFile(
                      index
                    )
                  }
                  disabled={loading}
                  className="
                    w-9 h-9
                    rounded-xl
                    bg-red-50
                    text-red-500
                    flex items-center justify-center
                    hover:bg-red-100
                    transition-all
                    disabled:opacity-50
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          )}

          {/* FILE COUNT */}
          <div className="text-xs text-gray-500 text-center">
            {files.length} PDF
            {files.length > 1
              ? "s"
              : ""}{" "}
            selected
          </div>
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
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      {files.length > 0 &&
        !mergedUrl && (
          <div className="flex gap-4">

            {/* MERGE */}
            <button
              onClick={mergePDFs}
              disabled={
                loading ||
                files.length < 2
              }
              className="
                w-full
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-semibold text-sm
                flex items-center justify-center gap-2
                shadow-lg shadow-blue-500/20
                hover:scale-[1.02]
                hover:shadow-xl hover:shadow-blue-500/30
                active:scale-[0.98]
                transition-all duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Merge PDFs
                </>
              )}
            </button>

            {/* RESET */}
            <button
              onClick={reset}
              disabled={loading}
              className="
                w-full
                h-11
                rounded-2xl
                border border-gray-300
                bg-white
                text-gray-700
                font-semibold text-sm
                flex items-center justify-center gap-2
                hover:bg-gray-50
                hover:border-gray-400
                transition-all duration-300
                disabled:opacity-50
              "
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}

      {/* RESULT */}
      {mergedUrl && (
        <div
          className="
            bg-white
            border border-gray-200
            rounded-3xl
            p-6
            shadow-sm
            text-center
            space-y-5
          "
        >

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
              PDF merged successfully
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4">

            {/* START OVER */}
            <button
              onClick={reset}
              className="
                w-full
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-red-500
                text-white
                font-semibold text-sm
                flex items-center justify-center gap-2
                shadow-lg shadow-orange-500/20
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>

            {/* DOWNLOAD */}
            <button
              onClick={download}
              className="
                w-full
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                text-white
                font-semibold text-sm
                flex items-center justify-center gap-2
                shadow-lg shadow-green-500/20
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <Download className="w-4 h-4" />
              Download
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