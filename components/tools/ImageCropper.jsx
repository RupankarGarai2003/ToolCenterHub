"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import Cropper from "react-easy-crop";

import ImageUploader from "./ImageUploader";

import {
  Download,
  RotateCcw,
  ZoomIn,
  Crop,
  CheckCircle2,
  Shield,
  RotateCw,
} from "lucide-react";

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";

export default function ImageCropper() {
  const [preview, setPreview] =
    useState(null);

  const [cropped, setCropped] =
    useState(null);

  const [fileData, setFileData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [rotation, setRotation] =
    useState(0);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);

  const [ratio, setRatio] =
    useState(1);

  const canvasRef = useRef(null);

  /* CLEANUP */
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* PRESETS */
  const presets = [
    {
      label: "1:1",
      value: 1,
    },
    {
      label: "16:9",
      value: 16 / 9,
    },
    {
      label: "4:3",
      value: 4 / 3,
    },
    {
      label: "9:16",
      value: 9 / 16,
    },
  ];

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
      alert(
        "Please upload an image"
      );

      return;
    }

    // 20MB LIMIT
    if (
      selected.size >
      20 * 1024 * 1024
    ) {
      alert(
        "Maximum file size is 20MB"
      );

      return;
    }

    const objectUrl =
      URL.createObjectURL(
        selected
      );

    const img = new Image();

    img.onload = () => {
      setPreview(objectUrl);

      setCropped(null);

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

    img.src = objectUrl;
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

  /* REMOVE */
  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    setCropped(null);

    setFileData(null);

    setZoom(1);

    setRotation(0);

    setCrop({
      x: 0,
      y: 0,
    });
  };

  /* CROP COMPLETE */
  const onCropComplete =
    useCallback(
      (
        croppedArea,
        croppedPixels
      ) => {
        setCroppedAreaPixels(
          croppedPixels
        );
      },
      []
    );

  /* CREATE CROPPED IMAGE */
  const handleCrop = async () => {
    try {
      setLoading(true);

      const image =
        new Image();

      image.src = preview;

      image.onload = async () => {
        const canvas =
          canvasRef.current;

        const ctx =
          canvas.getContext("2d");

        const safeArea =
          Math.max(
            image.width,
            image.height
          ) * 2;

        canvas.width =
          safeArea;

        canvas.height =
          safeArea;

        ctx.translate(
          safeArea / 2,
          safeArea / 2
        );

        ctx.rotate(
          (rotation *
            Math.PI) /
            180
        );

        ctx.translate(
          -safeArea / 2,
          -safeArea / 2
        );

        ctx.drawImage(
          image,
          safeArea / 2 -
            image.width / 2,
          safeArea / 2 -
            image.height / 2
        );

        const data =
          ctx.getImageData(
            0,
            0,
            safeArea,
            safeArea
          );

        canvas.width =
          croppedAreaPixels.width;

        canvas.height =
          croppedAreaPixels.height;

        ctx.putImageData(
          data,
          Math.round(
            0 -
              safeArea / 2 +
              image.width / 2 -
              croppedAreaPixels.x
          ),
          Math.round(
            0 -
              safeArea / 2 +
              image.height / 2 -
              croppedAreaPixels.y
          )
        );

        ctx.imageSmoothingEnabled =
          true;

        ctx.imageSmoothingQuality =
          "high";

        const result =
          canvas.toDataURL(
            "image/png"
          );

        setCropped(result);

        setLoading(false);
      };
    } catch (err) {
      console.error(err);

      alert(
        "Failed to crop image"
      );

      setLoading(false);
    }
  };

  /* DOWNLOAD */
  const handleDownload = () => {
    const link =
      document.createElement(
        "a"
      );

    link.href = cropped;

    link.download =
      "cropped-image.png";

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

        {/* CROPPER */}
        {preview && !cropped && (
          <div
            className="
              bg-white
              rounded-[32px]
              border border-gray-100
              shadow-[0_20px_60px_rgba(0,0,0,0.06)]
              p-5
              space-y-6
            "
          >

            {/* HEADER */}
            <div className="text-center">

              <h2 className="text-2xl font-black text-gray-800">
                Crop Image
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Drag, zoom and
                rotate image
              </p>
            </div>

            {/* CROPPER AREA */}
            <div
              className="
                relative
                h-[340px]
                rounded-3xl
                overflow-hidden
                bg-black
              "
            >
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                rotation={
                  rotation
                }
                aspect={ratio}
                onCropChange={
                  setCrop
                }
                onZoomChange={
                  setZoom
                }
                onRotationChange={
                  setRotation
                }
                onCropComplete={
                  onCropComplete
                }
              />
            </div>

            {/* RATIO */}
            <div>

              <p className="font-semibold text-gray-700 mb-3">
                Aspect Ratio
              </p>

              <div className="grid grid-cols-4 gap-3">

                {presets.map(
                  (item) => (
                    <button
                      key={
                        item.label
                      }
                      onClick={() =>
                        setRatio(
                          item.value
                        )
                      }
                      className={`
                        h-12
                        rounded-2xl
                        text-sm font-semibold
                        transition-all duration-300
                        ${
                          ratio ===
                          item.value
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105"
                            : "bg-white border border-gray-200 hover:border-blue-300"
                        }
                      `}
                    >
                      {
                        item.label
                      }
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ZOOM */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <p className="font-semibold text-gray-700">
                  Zoom
                </p>

                <p className="text-blue-600 font-bold">
                  {zoom.toFixed(
                    1
                  )}
                  x
                </p>
              </div>

              <div className="flex items-center gap-3">

                <ZoomIn className="w-4 h-4 text-gray-500" />

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) =>
                    setZoom(
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
            </div>

            {/* ROTATE */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <p className="font-semibold text-gray-700">
                  Rotation
                </p>

                <p className="text-blue-600 font-bold">
                  {rotation}°
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setRotation(
                      rotation -
                        90
                    )
                  }
                  className="
                    w-full h-12
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    hover:bg-gray-50
                    flex items-center justify-center gap-2
                    font-semibold
                  "
                >
                  <RotateCcw className="w-4 h-4" />
                  Left
                </button>

                <button
                  onClick={() =>
                    setRotation(
                      rotation +
                        90
                    )
                  }
                  className="
                    w-full h-12
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    hover:bg-gray-50
                    flex items-center justify-center gap-2
                    font-semibold
                  "
                >
                  <RotateCw className="w-4 h-4" />
                  Right
                </button>
              </div>
            </div>

            {/* INFO */}
            {fileData && (
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
                    Size
                  </p>

                  <p className="font-bold text-sm mt-1">
                    {
                      fileData.size
                    }
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
                    Width
                  </p>

                  <p className="font-bold text-sm mt-1">
                    {
                      fileData.width
                    }
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
                    Height
                  </p>

                  <p className="font-bold text-sm mt-1">
                    {
                      fileData.height
                    }
                  </p>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={
                handleCrop
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
                  Cropping...
                </>
              ) : (
                <>
                  <Crop className="w-5 h-5" />
                  Crop Image
                </>
              )}
            </button>
          </div>
        )}

        {/* RESULT */}
        {cropped && (
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
              Image Cropped
            </div>

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
                  Cropped
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
                  src={cropped}
                  className="
                    max-h-[260px]
                    object-contain
                  "
                />
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

        {/* HIDDEN CANVAS */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
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