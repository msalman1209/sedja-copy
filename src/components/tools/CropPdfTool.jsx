import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { Crop, Download, Upload, Loader2 } from 'lucide-react';

export default function CropPdfTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [cropMargin, setCropMargin] = useState(36); // in points (36pt = 0.5 inch)
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleCrop = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        // Adjust crop box
        const newX = cropMargin;
        const newY = cropMargin;
        const newWidth = Math.max(100, width - cropMargin * 2);
        const newHeight = Math.max(100, height - cropMargin * 2);

        page.setCropBox(newX, newY, newWidth, newHeight);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsProcessing(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Crop error:', err);
      alert('Error cropping PDF: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Crop PDF Margins</h1>
        <p className="text-sm text-slate-500 mt-1">
          Trim margins or adjust PDF page dimensions easily.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="crop-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="crop-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="btn-sejda-primary px-6 py-3 rounded-lg text-base font-semibold shadow">
              Select PDF file
            </span>
            <span className="text-xs text-slate-400 mt-3">or drag and drop your PDF here</span>
          </label>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="text-base font-bold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setDownloadUrl(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Change file
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Margin Trim Amount:
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cropMargin}
                    onChange={(e) => {
                      setCropMargin(Number(e.target.value));
                      setDownloadUrl(null);
                    }}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="text-sm font-bold text-slate-800 w-16 text-right">
                    {cropMargin} pt
                  </span>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                {[
                  { label: 'Minimal (18pt)', val: 18 },
                  { label: 'Standard (36pt)', val: 36 },
                  { label: 'Wide (72pt)', val: 72 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => {
                      setCropMargin(preset.val);
                      setDownloadUrl(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      cropMargin === preset.val
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-slate-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Box Preview */}
            <div className="flex justify-center p-6 bg-slate-100 rounded-xl">
              <div className="w-40 h-52 bg-white border border-gray-300 shadow relative flex items-center justify-center">
                <div
                  style={{
                    inset: `${cropMargin * 0.25}px`
                  }}
                  className="absolute border-2 border-dashed border-emerald-500 bg-emerald-500/10 transition-all flex items-center justify-center text-[10px] text-emerald-800 font-bold"
                >
                  Cropped Area
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`cropped_${file.name}`}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download Cropped PDF</span>
              </a>
            ) : (
              <button
                onClick={handleCrop}
                disabled={isProcessing}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cropping...</span>
                  </>
                ) : (
                  <>
                    <Crop className="w-4 h-4" />
                    <span>Apply Crop</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

