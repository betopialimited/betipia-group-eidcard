"use client";

import Link from "next/link";
<<<<<<< HEAD
import Cropper from "react-easy-crop";
import {
  Download,
  Upload,
  Type,
  Move,
  Image as ImageIcon,
  Check,
  Share2,
} from "lucide-react";

const TEMPLATE_WIDTH = 2160;
const TEMPLATE_HEIGHT = 2160;
const TEMPLATE_SRC = "/Template bg.jpg";

const CONFIG = {
  ovalX: 529,
  ovalY: 985,
  ovalRadiusX: 296,
  ovalRadiusY: 395,
  nameX: 200,
  nameY: 1520,
  nameSize: 55,
  nameColor: "#FFFFFF",
  desigX: 200,
  desigY: 1580,
  desigSize: 45,
  desigColor: "#FFFFFF",
};

export default function EidCardGenerator() {
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
    // Reset input value so same file can be re-selected
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
      templateImg.src = TEMPLATE_SRC;
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
        const sh = ry - rx; // straight height half

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy - sh, rx, Math.PI, 0, false);
        ctx.lineTo(cx + rx, cy + sh);
        ctx.arc(cx, cy + sh, rx, 0, Math.PI, false);
        ctx.lineTo(cx - rx, cy - sh);
        ctx.closePath();
        ctx.clip();

        // Map the cropped 1:1 area to fill the bounding box of the ellipse
        // Since croppedAreaPixels is square and ellipse is portrait, drawing it
        // into the ellipse's bounding box will stretch it.
        // We will adjust the aspect ratio in the cropper UI.
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
        // Draw Border
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 8; // Border width for high-res output
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
  }, [photoSrc, croppedAreaPixels, name, designation]);

  // View tracking removed - only downloads are tracked for accurate stats

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track download first
    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "download", name, designation }),
      });
    } catch (err) {
      console.error("Failed to track download:", err);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.download = `Eid-Greetings-${name.replace(/\s+/g, "-")}.jpg`;
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
            `Eid-Greetings-${name.replace(/\s+/g, "-")}.jpg`,
            { type: "image/jpeg" },
          );

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: "Eid Greetings",
                text: "Wishing you a blessed Eid-ul-Fitr!",
              });
            } catch (err) {
              if (err.name === "AbortError") {
                console.log("Share canceled");
              } else {
                console.error("Share failed:", err);
              }
            }
          } else {
            alert(
              "Your browser doesn't support sharing this image directly. Please download it first.",
            );
          }
        },
        "image/jpeg",
        0.95,
      );
    } else {
      alert(
        "Your browser doesn't support direct sharing. Please download the image first.",
      );
    }
  };
=======
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { frames } from "@/lib/framesConfig";
>>>>>>> 33a4f01 (feat: implement dynamic frame configuration system for custom photo and text positioning)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">
                Betopia Greetings
              </h1>
            </div>
            <p className="text-slate-300 text-sm">
              Create beautiful greeting cards
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your Frame
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Select a frame for any occasion and create a personalized greeting
            card. Add your photo, name, and message to make it special.
          </p>
        </div>

        {/* Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {frames.map((frame) => (
            <Link href={`/frames/${frame.id}`} key={frame.id}>
              <div className="h-full group cursor-pointer">
                <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-slate-800 border border-slate-700 hover:border-blue-400 flex flex-col h-full">
                  {/* Image Area */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                    <Image
                      src={frame.previewImage}
                      alt={frame.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={false}
                    />
                    {/* Fallback gradient */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${frame.color} 0%, ${frame.color}80 100%)`,
                      }}
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col justify-between p-5">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {frame.name}
                      </h3>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {frame.description}
                      </p>
                    </div>
                    <button className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors group/btn">
                      Create Card
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <p className="text-slate-400 text-sm">
                Create personalized greeting cards for any occasion with
                beautiful frames and templates.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>✓ Easy photo upload</li>
                <li>✓ Custom text options</li>
                <li>✓ High-resolution download</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Share</h4>
              <p className="text-slate-400 text-sm">
                Create, download, and share your greeting cards instantly.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Betopia Greetings. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
