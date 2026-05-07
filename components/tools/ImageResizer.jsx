"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import ImageUploader from "./ImageUploader";

import {
  Loader2,
  CheckCircle2,
  Shield,
  Download,
  RotateCcw,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function ImageResizer() {
  const [preview, setPreview] =
    useState(null);

  const [resized, setResized] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [fileData, setFileData] =
    useState(null);

  const [width, setWidth] =
    useState("");

  const [height, setHeight] =
    useState("");

  const [percent, setPercent] =
    useState(100);

  const [lockRatio, setLockRatio] =
    useState(true);

  const [format, setFormat] =
    useState("image/jpeg");

  const [quality, setQuality] =
    useState(0.8);

  const [original, setOriginal] =
    useState({
      w: 0,
      h: 0,
    });

  const [estimatedSize, setEstimatedSize] =
    useState(null);

  const imageRef = useRef(null);

  /* CLEAN OBJECT URL */
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* HANDLE FILE */
  const handleChange = (e) => {
    const selected =
      e.target.files?.[0];

    if (
      !selected ||
      !selected.type.startsWith(
        "image/"
      )
    ) {
      return;
    }

    if (
      selected.size >
      20 * 1024 * 1024
    ) {
      alert(
        "Maximum image size is 20MB"
      );

      return;
    }

    const url =
      URL.createObjectURL(
        selected
      );

    const img = new Image();

    img.onload = () => {
      imageRef.current = img;

      setPreview(url);

      setResized(null);

      setOriginal({
        w: img.width,
        h: img.height,
      });

      setWidth(img.width);

      setHeight(img.height);

      setPercent(100);

      setFileData({
        name: selected.name,

        size:
          (
            selected.size / 1024
          ).toFixed(1) +
          " KB",

        width: img.width,

        height: img.height,
      });
    };

    img.src = url;
  };

  /* DROP */
  const handleDrop = (e) => {
    e.preventDefault();

    const selected =
      e.dataTransfer.files?.[0];

    if (!selected) return;

    const fakeEvent = {
      target: {
        files: [selected],
      },
    };

    handleChange(fakeEvent);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /* RESET */
  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    setResized(null);

    setFileData(null);

    setEstimatedSize(null);

    setLoading(false);
  };

  /* WIDTH */
  const handleWidth = (val) => {
    setWidth(val);

    setPercent(
      Math.round(
        (val / original.w) * 100
      )
    );

    if (lockRatio) {
      const ratio =
        original.h / original.w;

      setHeight(
        Math.round(val * ratio)
      );
    }
  };

  /* HEIGHT */
  const handleHeight = (val) => {
    setHeight(val);

    setPercent(
      Math.round(
        (val / original.h) * 100
      )
    );

    if (lockRatio) {
      const ratio =
        original.w / original.h;

      setWidth(
        Math.round(val * ratio)
      );
    }
  };

  /* PERCENT */
  const handlePercent = (val) => {
    setPercent(val);

    const w =
      (original.w * val) / 100;

    const h =
      (original.h * val) / 100;

    setWidth(Math.round(w));

    setHeight(Math.round(h));
  };

  /* LIVE ESTIMATE */
  useEffect(() => {
    if (
      !preview ||
      !width ||
      !height
    ) {
      return;
    }

    const timeout = setTimeout(
      () => {
        const img =
          imageRef.current;

        if (!img) return;

        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width = width;

        canvas.height = height;

        const ctx =
          canvas.getContext("2d");

        ctx.imageSmoothingEnabled =
          true;

        ctx.imageSmoothingQuality =
          "high";

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        const data =
          format ===
            "image/jpeg" ||
          format ===
            "image/webp"
            ? canvas.toDataURL(
                format,
                quality
              )
            : canvas.toDataURL(
                format
              );

        const size =
          Math.round(
            (data.length * 3) /
              4 /
              1024
          );

        setEstimatedSize(size);
      },
      200
    );

    return () =>
      clearTimeout(timeout);
  }, [
    width,
    height,
    quality,
    format,
    preview,
  ]);

  /* RESIZE */
  const handleResize = async () => {
    if (
      width < 1 ||
      height < 1
    ) {
      alert(
        "Invalid dimensions"
      );

      return;
    }

    try {
      setLoading(true);

      const img =
        imageRef.current;

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width = width;

      canvas.height = height;

      const ctx =
        canvas.getContext("2d");

      ctx.imageSmoothingEnabled =
        true;

      ctx.imageSmoothingQuality =
        "high";

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const result =
        format ===
          "image/jpeg" ||
        format ===
          "image/webp"
          ? canvas.toDataURL(
              format,
              quality
            )
          : canvas.toDataURL(
              format
            );

      const finalSize =
        Math.round(
          (result.length * 3) /
            4 /
            1024
        );

      setEstimatedSize(
        finalSize
      );

      setResized(result);
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */
  const handleDownload = () => {
    if (!resized) return;

    const ext =
      format.split("/")[1];

    const link =
      document.createElement(
        "a"
      );

    link.href = resized;

    link.download = `resized-image.${ext}`;

    link.click();
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-8">

        {/* UPLOADER */}
        <ImageUploader
          preview={preview}
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

        {/* ORIGINAL */}
        {preview && !resized && (
          <div
            className="
              bg-white
              rounded-[28px]
              border border-gray-100
              shadow-[0_10px_40px_rgba(0,0,0,0.05)]
              p-4
            "
          >

            <div className="flex items-center justify-between mb-4">

              <div>

                <h3 className="font-bold text-gray-800">
                  Original Image
                </h3>

                <p className="text-xs text-gray-400">
                  Preview before resizing
                </p>
              </div>

              <div
                className="
                  px-3 py-1 rounded-full
                  bg-blue-50 text-blue-600
                  text-xs font-semibold
                "
              >
                {original.w} ×{" "}
                {original.h}
              </div>
            </div>

            <div
              className="
                bg-gradient-to-br
                from-gray-50
                to-gray-100
                rounded-2xl
                overflow-hidden
                flex items-center justify-center
                min-h-[220px]
              "
            >
              <img
                src={preview}
                className="
                  max-h-[240px]
                  object-contain
                  rounded-xl
                "
              />
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {preview && !resized && (
          <div
            className="
              bg-white
              rounded-[28px]
              border border-gray-100
              shadow-[0_10px_40px_rgba(0,0,0,0.05)]
              p-6
              space-y-7
            "
          >

            {/* HEADER */}
            <div className="text-center">

              <h2 className="text-xl font-black text-gray-800">
                Resize Settings
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Customize dimensions
                and output quality
              </p>
            </div>

            {/* DIMENSIONS */}
            <div>

              <div className="flex items-center justify-between mb-3">

                <p className="font-semibold text-gray-700">
                  Dimensions
                </p>

                <button
                  onClick={() =>
                    setLockRatio(
                      !lockRatio
                    )
                  }
                  className="
                    px-3 py-1 rounded-full
                    bg-gray-100
                    text-sm
                    hover:bg-gray-200
                    transition-all
                  "
                >
                  {lockRatio
                    ? "🔒 Locked"
                    : "🔓 Free"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-xs text-gray-400 mb-2">
                    Width
                  </p>

                  <input
                    type="number"
                    value={width}
                    onChange={(e) =>
                      handleWidth(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      w-full h-12
                      rounded-2xl
                      border border-gray-200
                      px-4
                      outline-none
                      focus:ring-4
                      focus:ring-blue-100
                      focus:border-blue-400
                    "
                  />
                </div>

                <div>

                  <p className="text-xs text-gray-400 mb-2">
                    Height
                  </p>

                  <input
                    type="number"
                    value={height}
                    onChange={(e) =>
                      handleHeight(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      w-full h-12
                      rounded-2xl
                      border border-gray-200
                      px-4
                      outline-none
                      focus:ring-4
                      focus:ring-blue-100
                      focus:border-blue-400
                    "
                  />
                </div>
              </div>
            </div>

            {/* SCALE */}
            <div>

              <div className="flex justify-between mb-2">

                <p className="font-semibold text-gray-700">
                  Resize Scale
                </p>

                <p className="text-blue-600 font-bold">
                  {percent}%
                </p>
              </div>

              <input
                type="range"
                min="10"
                max="200"
                value={percent}
                onChange={(e) =>
                  handlePercent(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="
                  w-full
                  accent-blue-600
                "
              />
            </div>

            {/* FORMAT */}
            <div>

              <p className="font-semibold text-gray-700 mb-3">
                Output Format
              </p>

              <select
                value={format}
                onChange={(e) =>
                  setFormat(
                    e.target.value
                  )
                }
                className="
                  w-full h-12
                  rounded-2xl
                  border border-gray-200
                  px-4
                  outline-none
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-blue-400
                "
              >
                <option value="image/jpeg">
                  JPG
                </option>

                <option value="image/png">
                  PNG
                </option>

                <option value="image/webp">
                  WEBP
                </option>
              </select>
            </div>

            {/* QUALITY */}
            <div>

              <div className="flex justify-between mb-2">

                <p className="font-semibold text-gray-700">
                  Quality
                </p>

                <p className="text-blue-600 font-bold">
                  {Math.round(
                    quality * 100
                  )}
                  %
                </p>
              </div>

              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) =>
                  setQuality(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="
                  w-full
                  accent-blue-600
                "
              />
            </div>

            {/* STATS */}
            <div
              className="
                grid grid-cols-3 gap-3
              "
            >

              <div
                className="
                  bg-gray-50
                  rounded-2xl
                  p-3 text-center
                "
              >

                <p className="text-xs text-gray-400">
                  Original
                </p>

                <p className="font-bold text-sm mt-1">
                  {fileData?.size}
                </p>
              </div>

              <div
                className="
                  bg-blue-50
                  rounded-2xl
                  p-3 text-center
                "
              >

                <p className="text-xs text-blue-400">
                  Estimated
                </p>

                <p className="font-bold text-sm text-blue-600 mt-1">
                  {estimatedSize ??
                    "-"}{" "}
                  KB
                </p>
              </div>

              <div
                className="
                  bg-gray-50
                  rounded-2xl
                  p-3 text-center
                "
              >

                <p className="text-xs text-gray-400">
                  Resolution
                </p>

                <p className="font-bold text-sm mt-1">
                  {width}×
                  {height}
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={
                handleResize
              }
              disabled={loading}
              className="
                w-full h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-bold
                shadow-xl shadow-blue-500/20
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-300
                disabled:opacity-50
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resizing...
                </>
              ) : (
                "Resize Image"
              )}
            </button>
          </div>
        )}

        {/* RESULT */}
        {resized && (
          <div className="space-y-6">

            {/* SUCCESS */}
            <div
              className="
                flex items-center justify-center gap-2
                text-green-600
                font-bold text-lg
              "
            >
              <CheckCircle2 className="w-5 h-5 animate-bounce" />
              Image Resized
            </div>

            {/* BEFORE AFTER */}
            <div className="grid grid-cols-1 gap-5">

              {/* BEFORE */}
              <div
                className="
                  bg-white
                  rounded-[28px]
                  p-4
                  border border-gray-100
                  shadow-[0_10px_40px_rgba(0,0,0,0.05)]
                "
              >

                <div className="flex items-center justify-between mb-3">

                  <p className="font-semibold text-gray-700">
                    Before
                  </p>

                  <div
                    className="
                      px-3 py-1 rounded-full
                      bg-gray-100
                      text-xs font-semibold
                      text-gray-600
                    "
                  >
                    Original
                  </div>
                </div>

                <div
                  className="
                    bg-gray-50
                    rounded-2xl
                    overflow-hidden
                    flex items-center justify-center
                    min-h-[200px]
                  "
                >
                  <img
                    src={preview}
                    className="
                      max-h-[260px]
                      object-contain
                    "
                  />
                </div>
              </div>

              {/* AFTER */}
              <div
                className="
                  bg-white
                  rounded-[28px]
                  p-4
                  border-2 border-blue-500
                  shadow-[0_10px_40px_rgba(59,130,246,0.12)]
                "
              >

                <div className="flex items-center justify-between mb-3">

                  <p className="font-semibold text-blue-600">
                    After
                  </p>

                  <div
                    className="
                      px-3 py-1 rounded-full
                      bg-blue-50
                      text-xs font-semibold
                      text-blue-600
                    "
                  >
                    Resized
                  </div>
                </div>

                <div
                  className="
                    bg-blue-50/40
                    rounded-2xl
                    overflow-hidden
                    flex items-center justify-center
                    min-h-[200px]
                  "
                >
                  <img
                    src={resized}
                    className="
                      max-h-[260px]
                      object-contain
                    "
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">

              {/* RESET */}
              <button
                onClick={
                  handleRemove
                }
                className="
                  w-full
                  h-12
                  rounded-2xl
                  border border-gray-300
                  bg-white
                  text-gray-700
                  font-semibold
                  hover:bg-gray-50
                  transition-all
                  flex items-center justify-center gap-2
                "
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              {/* DOWNLOAD */}
              <button
                onClick={
                  handleDownload
                }
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-green-600
                  text-white
                  font-semibold
                  shadow-lg shadow-green-500/20
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all
                  flex items-center justify-center gap-2
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
          Your images remain private
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