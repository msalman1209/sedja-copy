import React, { useRef, useState } from 'react';
import { Upload, ChevronDown, FileText, Sparkles, Shield, Lock, FilePlus, Cloud, Link2 } from 'lucide-react';

export default function HeroSection({ onUploadFile, onSelectTool }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUploadFile(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      onUploadFile(files);
    }
  };

  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Decorative polka dots like Sejda */}
      <div className="absolute top-10 right-4 w-48 h-48 opacity-20 pointer-events-none hidden md:block bg-[radial-gradient(#2c8a77_2px,transparent_2px)] [background-size:16px_16px]" />
      <div className="absolute top-8 left-4 w-48 h-48 opacity-20 pointer-events-none hidden md:block bg-[radial-gradient(#2c8a77_2px,transparent_2px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          We help with your PDF tasks
        </h1>

        {/* Subtitle in Sejda's signature emerald color */}
        <h2 className="text-xl sm:text-2xl font-medium text-[#00bb88] mb-8">
          Easy, pleasant and productive PDF editor
        </h2>

        {/* Big Upload Area matching Sejda's signature UI */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative max-w-xl mx-auto p-8 rounded-2xl border-2 border-dashed transition-all duration-200 bg-white shadow-xl ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]'
              : 'border-emerald-200 hover:border-emerald-400'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,application/pdf,image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center">
            {/* Split CTA button matching Sejda style */}
            <div className="inline-flex rounded-lg shadow-lg relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-sejda-primary px-8 py-4 rounded-l-lg text-base sm:text-lg font-bold flex items-center space-x-3 tracking-wide"
              >
                <Upload className="w-5 h-5" />
                <span>Upload PDF files</span>
              </button>
              
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="btn-sejda-primary px-3 py-4 rounded-r-lg border-l border-emerald-600/50 flex items-center justify-center hover:bg-emerald-800"
                title="More upload options"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              {/* Cloud dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-30 text-left">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center space-x-2.5"
                  >
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    <span>Choose from Device</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onSelectTool('pdf-editor');
                    }}
                    className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center space-x-2.5"
                  >
                    <FilePlus className="w-4 h-4 text-emerald-600" />
                    <span>Start with blank PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center space-x-2.5"
                  >
                    <Link2 className="w-4 h-4 text-emerald-600" />
                    <span>Google Drive / Dropbox</span>
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-slate-500 font-medium">
              or drop files anywhere here
            </p>

            {/* Quick popular tool pills */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Popular:</span>
              {[
                { id: 'compress-pdf', label: 'Compress' },
                { id: 'pdf-editor', label: 'Edit' },
                { id: 'sign-pdf', label: 'Fill & Sign' },
                { id: 'merge-pdf', label: 'Merge' },
                { id: 'delete-pdf-pages', label: 'Delete Pages' },
                { id: 'crop-pdf', label: 'Crop' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectTool(p.id)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy & Free Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Files stay private & processed securely on your computer</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Free for everyone — No paywall, no limits</span>
          </div>
        </div>
      </div>
    </section>
  );
}

