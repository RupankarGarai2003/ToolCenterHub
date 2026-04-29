"use client";
import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

import About from "@/components/tool-content/About";
import HowToUse from "@/components/tool-content/HowToUse";
import Features from "@/components/tool-content/Features";
import Benefits from "@/components/tool-content/Benefits";
import FAQ from "@/components/tool-content/FAQ";
import CustomButton from "../tools/CustomButton";


import {
  Lock,
  Unlock,
  Sparkles,
  Download,
  RotateCcw,
  Zap,
  TrendingDown,
  Settings,
  ChevronDown,
} from 'lucide-react';

export default function ImageCompressor() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [resized, setResized] = useState(null);

  const [width, setWidth] = useState(70);
  const [height, setHeight] = useState(70);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState('image/jpeg');
  const [unit, setUnit] = useState('percent');

  const [openUnit, setOpenUnit] = useState(false);
  const [openFormat, setOpenFormat] = useState(false);

  const [originalSize, setOriginalSize] = useState(null);
  const [originalDim, setOriginalDim] = useState({});
  const [resizedSize, setResizedSize] = useState(null);

  const [lock, setLock] = useState(true);
  const [background, setBackground] = useState('white');
  const [compressionRatio, setCompressionRatio] = useState(0);

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    setResized(null);
    setOriginalSize(parseFloat((file.size / 1024).toFixed(2)));

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        setPreview(reader.result);
        setImage(file);
        setOriginalDim({
          width: img.width,
          height: img.height,
        });

        if (unit === 'pixels') {
          setWidth(img.width);
          setHeight(img.height);
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = () => { };

  const handleRemove = () => {
    setPreview(null);
    setImage(null);
    setResized(null);
    setCompressionRatio(0);
  };

  const handleWidthChange = (val) => {
    setWidth(val);
    if (lock && originalDim.width && originalDim.height) {
      if (unit === 'percent') {
        setHeight(val);
      } else {
        const ratio = originalDim.height / originalDim.width;
        setHeight(Math.round(val * ratio));
      }
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    if (lock && originalDim.height && originalDim.width) {
      if (unit === 'percent') {
        setWidth(val);
      } else {
        const ratio = originalDim.width / originalDim.height;
        setWidth(Math.round(val * ratio));
      }
    }
  };

  useEffect(() => {
    if (unit === 'pixels' && originalDim.width && originalDim.height) {
      setWidth(originalDim.width);
      setHeight(originalDim.height);
    } else if (unit === 'percent') {
      setWidth(70);
      setHeight(70);
    }
  }, [unit]);

  const handleResize = () => {
    if (!preview || !originalDim.width || !originalDim.height) return;

    const img = new Image();
    img.src = preview;

    img.onload = () => {
      const canvas = document.createElement('canvas');

      let newWidth, newHeight;

      if (unit === 'percent') {
        newWidth = (img.width * width) / 100;
        newHeight = (img.height * height) / 100;
      } else {
        newWidth = width;
        newHeight = height;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (background === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, newWidth, newHeight);
      } else if (background === 'black') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, newWidth, newHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const result = canvas.toDataURL(format, quality / 100);

      const byteString = atob(result.split(',')[1]);
      const sizeKB = parseFloat((byteString.length / 1024).toFixed(2));

      setResized(result);
      setResizedSize(sizeKB);

      if (originalSize) {
        const ratio = ((originalSize - sizeKB) / originalSize) * 100;
        setCompressionRatio(Math.max(0, ratio));
      }
    };
  };

  const handleDownload = () => {
    if (!resized) return;

    const link = document.createElement('a');

    const ext =
      format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';

    link.href = resized;
    link.download = `compressed-image-${Date.now()}.${ext}`;
    link.click();
  };

  const resetSettings = () => {
    setWidth(70);
    setHeight(70);
    setQuality(90);
    setFormat('image/jpeg');
    setUnit('percent');
    setLock(true);
    setBackground('white');
  };

  return (
    <>
      <div className="container">

        <ImageUploader
          preview={preview}
          fileData={
            image
              ? {
                name: image.name,
                size: originalSize ? `${originalSize} KB` : undefined,
                width: originalDim.width,
                height: originalDim.height,
              }
              : null
          }
          onChange={handleChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
        />

        {preview && !resized && (
          <div className="space-y-6 animate-slideUp mt-4">
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-6 h-6 text-blue-500 animate-spin-slow" />
              <h2 className="text-2xl font-bold text-gray-600 [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
                Customize Your Image
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100 ">


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 relative">
                  <label className="text-sm font-semibold text-gray-700 flex items-center flex-row gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Format
                  </label>

                  {/* Wrapper (IMPORTANT) */}
                  <div className="relative">
                    {/* Trigger */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenFormat(!openFormat);
                      }}
                      className="w-full border-2 border-gray-300 rounded-lg px-5 py-1 font-bold 
                 bg-white cursor-pointer relative text-sm
                 hover:border-blue-400 transition-all duration-300"
                    >
                      {format === "image/jpeg"
                        ? "JPG"
                        : format === "image/png"
                          ? "PNG"
                          : "WEBP"}

                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>

                    {/* Dropdown (FLOATING) */}
                    {openFormat && (
                      <div className="absolute top-full left-0 mt-1 w-half bg-white border border-gray-200 
                      rounded-lg shadow-lg z-50 overflow-hidden">

                        <div
                          onClick={() => {
                            setFormat("image/jpeg");
                            setOpenFormat(false);
                          }}
                          className={`px-2 py-2 cursor-pointer font-semibold text-sm
            ${format === "image/jpeg"
                              ? "bg-gray-300 text-black"
                              : "hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                          JPG
                        </div>

                        <div
                          onClick={() => {
                            setFormat("image/png");
                            setOpenFormat(false);
                          }}
                          className={`px-2 py-2 cursor-pointer font-semibold text-sm
            ${format === "image/png"
                              ? "bg-gray-300 text-black"
                              : "hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                          PNG
                        </div>

                        <div
                          onClick={() => {
                            setFormat("image/webp");
                            setOpenFormat(false);
                          }}
                          className={`px-2 py-2 cursor-pointer font-semibold text-sm
            ${format === "image/webp"
                              ? "bg-gray-300 text-black"
                              : "hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                          WEBP
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 items-center justify-center">
                    {/* <TrendingDown className="w-4 h-4 text-red-500" /> */}
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full mt-5 h-3 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>


              </div>

              <div className="flex justify-center items-center gap-4 flex-wrap">
                <div className="space-y-2 text-center">
                  <label className="text-sm font-bold text-gray-700 block text-center [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
                    Width
                  </label>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() => handleWidthChange(Math.max(1, width - 1))}
                      className="w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-10 text-center border-2 border-blue-300 rounded-lg font-semibold text-sm focus:outline-none focus:ring-0 focus:border-blue-500"
                    />

                    <button
                      onClick={() => handleWidthChange(width + 1)}
                      className="w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold text-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => setLock(!lock)}
                    className={`p-2 mt-6 rounded-full transition-all duration-300 transform hover:scale-110 ${lock
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50'
                      : 'bg-gray-300 shadow-md'
                      }`}
                  >
                    {lock ? (
                      <Lock className="w-3 h-3 text-white" />
                    ) : (
                      <Unlock className="w-3 h-3 text-gray-700" />
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-center">
                  <label className="text-sm font-bold text-gray-700 block text-center [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
                    Height
                  </label>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() => handleWidthChange(Math.max(1, width - 1))}
                      className="w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-10 text-center border-2 border-blue-300 rounded-lg font-semibold text-sm focus:outline-none focus:ring-0 focus:border-blue-500"
                    />

                    <button
                      onClick={() => handleWidthChange(width + 1)}
                      className="w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold text-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block text-center [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
                    Unit
                  </label>

                  {/* Wrapper */}
                  <div className="relative w-12 mx-auto">

                    {/* Trigger */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenUnit(!openUnit);
                      }}
                      className="w-full text-center border-2 border-blue-300 rounded-lg font-semibold text-sm 
                 bg-white cursor-pointer relative py-[2px]"
                    >
                      {unit === "percent" ? "%" : "px"}

                      {/* Arrow */}
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>

                    {/* Dropdown (FLOATING FIX) */}
                    {openUnit && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-full 
                      bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">

                        <div
                          onClick={() => {
                            setUnit("percent");
                            setOpenUnit(false);
                          }}
                          className={`py-[2px] text-center cursor-pointer text-sm font-semibold
            ${unit === "percent"
                              ? "bg-gray-300 text-black"
                              : "hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                          %
                        </div>

                        <div
                          onClick={() => {
                            setUnit("pixels");
                            setOpenUnit(false);
                          }}
                          className={`py-[2px] text-center cursor-pointer text-sm font-semibold
            ${unit === "pixels"
                              ? "bg-gray-300 text-black"
                              : "hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                          px
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 items-center">
                <CustomButton

                  onClick={resetSettings}
                  leftIcon={<RotateCcw size={14} strokeWidth={2.5} />}
                  animation="ripple"
                  btnSize="md"
                >
                  Reset
                </CustomButton>

                <CustomButton

                  onClick={handleResize}
                  leftIcon={<Zap size={14} strokeWidth={2.5} />}
                  animation="ripple"
                  btnSize="md"
                  variant="success"
                >
                  Compress
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        {resized && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center mt-5 gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce-once">
                <Sparkles className="w-6 h-6" />
                <span className="font-bold text-lg">Compression Complete!</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    Original
                  </h3>
                  <img
                    src={preview || ''}
                    alt="Original"
                    className="w-full rounded-xl shadow-lg"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {originalDim.width} × {originalDim.height} px
                    </span>
                    <span className="font-bold text-red-600">{originalSize} KB</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    Compressed
                  </h3>
                  <img
                    src={resized}
                    alt="Compressed"
                    className="w-full rounded-xl shadow-lg"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {unit === 'percent'
                        ? `${Math.round((originalDim.width * width) / 100)} × ${Math.round(
                          (originalDim.height * height) / 100
                        )} px`
                        : `${width} × ${height} px`}
                    </span>
                    <span className="font-bold text-green-600">{resizedSize} KB</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Saved</p>
                    <p className="text-3xl font-black text-blue-600">
                      {compressionRatio.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Size Reduced</p>
                    <p className="text-3xl font-black text-green-600">
                      {originalSize && resizedSize
                        ? `${(originalSize - resizedSize).toFixed(2)} KB`
                        : '0 KB'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">

                <CustomButton

                  onClick={handleRemove}
                  leftIcon={<RotateCcw size={18} strokeWidth={2.5} />}
                  animation="ripple"
                  btnSize="md"
                >
                  Reset
                </CustomButton>

                <CustomButton variant="download" onClick={handleDownload} animation="bounce"/>

              </div>
            </div>
          </div>
        )}
      </div>
      {/* 🔹 CONTENT SECTION */}
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
