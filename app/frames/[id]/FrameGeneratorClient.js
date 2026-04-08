"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Cropper from "react-easy-crop";
import {
  Download,
  Upload,
  Type,
  Move,
  Image as ImageIcon,
  Check,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { getFrameConfig } from "@/lib/framesConfig";

export default function FrameGeneratorClient({ frame, frameId }) {
  // Get frame-specific configuration
  const CONFIG = getFrameConfig(frameId);
  const TEMPLATE_WIDTH = CONFIG.templateWidth || 2000;
  const TEMPLATE_HEIGHT = CONFIG.templateHeight || 2000;
  const templateSrc = frame?.templateImage || "/Template bg.jpg";

  const [photoSrc, setPhotoSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [name, setName] = useState("Your Name");
  const [designation, setDesignation] = useState("Your Designation");
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setPhotoSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Debounced render
  useEffect(() => {
    let timeoutId;
    const renderCard = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      // Load template
      const templateImg = new window.Image();
      templateImg.src = templateSrc;
      await new Promise((resolve) => {
        templateImg.onload = resolve;
      });

      ctx.clearRect(0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);
      ctx.drawImage(templateImg, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

      // Draw photo if cropped
      if (photoSrc && croppedAreaPixels) {
        const photoImg = new window.Image();
        photoImg.src = photoSrc;
        await new Promise((resolve) => {
          photoImg.onload = resolve;
        });

        const { x, y, width, height } = croppedAreaPixels;

        const rx = CONFIG.ovalRadiusX;
        const ry = CONFIG.ovalRadiusY;
        const cx = CONFIG.ovalX;
        const cy = CONFIG.ovalY;
        const sh = ry - rx;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy - sh, rx, Math.PI, 0, false);
        ctx.lineTo(cx + rx, cy + sh);
        ctx.arc(cx, cy + sh, rx, 0, Math.PI, false);
        ctx.lineTo(cx - rx, cy - sh);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          photoImg,
          x,
          y,
          width,
          height,
          CONFIG.ovalX - CONFIG.ovalRadiusX,
          CONFIG.ovalY - CONFIG.ovalRadiusY,
          CONFIG.ovalRadiusX * 2,
          CONFIG.ovalRadiusY * 2,
        );
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.restore();
      }

      // Draw Name
      ctx.fillStyle = CONFIG.nameColor;
      ctx.font = `bold ${CONFIG.nameSize}px Inter, "Segoe UI", sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (name) ctx.fillText(name, CONFIG.nameX, CONFIG.nameY);

      // Draw Designation
      ctx.fillStyle = CONFIG.desigColor;
      ctx.font = `500 ${CONFIG.desigSize}px Inter, "Segoe UI", sans-serif`;
      if (designation) ctx.fillText(designation, CONFIG.desigX, CONFIG.desigY);
    };

    timeoutId = setTimeout(() => {
      renderCard();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [photoSrc, croppedAreaPixels, name, designation, templateSrc, CONFIG]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "download",
          name,
          designation,
          frame: frameId,
        }),
      });
    } catch (err) {
      console.error("Failed to track download:", err);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.download = `${frame?.name}-${name.replace(/\s+/g, "-")}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share) {
      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          const file = new File(
            [blob],
            `${frame?.name}-${name.replace(/\s+/g, "-")}.jpg`,
            { type: "image/jpeg" },
          );

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: frame?.name || "Greeting Card",
                text: `Check out this ${frame?.name} card!`,
              });
            } catch (err) {
              if (err.name !== "AbortError") {
                console.error("Share failed:", err);
              }
            }
          } else {
            alert("Please download the image first to share it.");
          }
        },
        "image/jpeg",
        0.95,
      );
    } else {
      alert("Your browser doesn't support direct sharing.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col h-fit md:h-screen">
        <div className="p-6 border-b border-neutral-100 bg-white sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            {frame.name}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">{frame.description}</p>
        </div>

        <div className="p-6 space-y-6 flex-grow overflow-y-auto">
          {/* Main Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-neutral-900"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-neutral-900"
                placeholder="Your Designation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Photo Upload
              </label>
              {!photoSrc ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-neutral-50">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-neutral-400" />
                    <div className="flex text-sm text-neutral-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-neutral-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
            </div>
          </div>

          {/* Photo Cropper UI */}
          {photoSrc && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Move className="w-4 h-4" /> Adjust Photo
              </h2>
              <div className="relative w-full h-64 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <Cropper
                  image={photoSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={CONFIG.ovalRadiusX / CONFIG.ovalRadiusY}
                  cropShape="rect"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2 flex justify-between">
                  <span>Zoom Level</span>
                  <span>{Number(zoom).toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg accent-blue-500"
                />
              </div>
              <button
                onClick={handleChangePhoto}
                className="w-full py-2 px-4 border-2 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                Change Photo
              </button>
            </div>
          )}
        </div>

        {/* Back Button — pinned to sidebar bottom */}
        <div className="p-4 border-t border-neutral-100 bg-white sticky bottom-0 mt-auto hidden md:block">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
            <span className="text-neutral-700 font-medium">Back</span>
          </Link>
        </div>
      </div>

      {/* Preview Canvas Area */}
      <div className="flex-1 relative bg-neutral-100 flex items-center justify-center p-8">
        <div className="relative w-full max-w-2xl flex flex-col items-center justify-center">
          <div className="relative mx-auto w-full aspect-square bg-white shadow-sm rounded-xl overflow-hidden ring-1 ring-neutral-200">
            <canvas
              ref={canvasRef}
              width={TEMPLATE_WIDTH}
              height={TEMPLATE_HEIGHT}
              className="w-full h-full object-contain"
            />
            {!photoSrc && (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: `${(CONFIG.ovalX / TEMPLATE_WIDTH) * 100}%`,
                  top: `${(CONFIG.ovalY / TEMPLATE_HEIGHT) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg text-sm font-medium text-neutral-700 animate-pulse">
                  Upload Your Photo...
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 w-full max-w-lg flex items-center justify-between gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
