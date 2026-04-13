"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { frames } from "@/lib/framesConfig";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/Betopia Group.svg"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <p className="text-slate-600 text-sm">
              Create Beautiful Greeting Cards
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Frame
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select a frame for any occasion and create a personalized greeting
            card. Add your photo, name, and message to make it special.
          </p>
        </div>

        {/* Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {frames.map((frame) => (
            <Link href={`/frames/${frame.id}`} key={frame.id}>
              <div className="h-full group cursor-pointer">
                <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-slate-200 hover:border-blue-500 flex flex-col h-full">
                  {/* Image Area */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
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
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${frame.color} 0%, ${frame.color}80 100%)`,
                      }}
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col justify-between p-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {frame.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
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
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-slate-900 font-semibold mb-4">About</h4>
              <p className="text-slate-600 text-sm">
                Create personalized greeting cards for any occasion with
                beautiful frames and templates.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Features</h4>
              <ul className="text-slate-600 text-sm space-y-2">
                <li>✓ Easy photo upload</li>
                <li>✓ Custom text options</li>
                <li>✓ High-resolution download</li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Share</h4>
              <p className="text-slate-600 text-sm">
                Create, download, and share your greeting cards instantly.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 Betopia Greetings. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
