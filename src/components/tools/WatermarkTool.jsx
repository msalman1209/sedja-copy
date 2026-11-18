import React, { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { Stamp, Download, Upload, Loader2, CheckCircle } from 'lucide-react';

export default function WatermarkTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [angle, setAngle] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleApplyWatermark = async () => {
    if (!file || !text.trim()) return;

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = helvetica.widthOfTextAtSize(text, fontSize);
        const textHeight = helvetica.heightAtSize(fontSize);

        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font: helvetica,
          color: rgb(0.8, 0.2, 0.2),
          opacity: opacity,
          rotate: degrees(angle)
        });
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
      console.error('Watermark error:', err);
      alert('Error applying watermark: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Watermark PDF</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add custom text watermarks across all pages of your PDF document.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="watermark-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="watermark-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="btn-sejda-primary px-6 py-3 rounded-lg text-base font-semibold shadow">
              Select PDF file
            </span>
            <span className="text-xs text-slate-400 mt-3">or drag and drop your file here</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Watermark Text:
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setDownloadUrl(null);
                  }}
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Opacity:</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(Number(e.target.value));
                    setDownloadUrl(null);
                  }}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Font Size:
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(Number(e.target.value));
                      setDownloadUrl(null);
                    }}
                    className="w-full text-xs p-2 border border-gray-300 rounded bg-white"
                  >
                    <option value={24}>24 pt</option>
                    <option value={36}>36 pt</option>
                    <option value={48}>48 pt</option>
                    <option value={64}>64 pt</option>
                    <option value={80}>80 pt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rotation Angle:
                  </label>
                  <select
                    value={angle}
                    onChange={(e) => {
                      setAngle(Number(e.target.value));
                      setDownloadUrl(null);
                    }}
                    className="w-full text-xs p-2 border border-gray-300 rounded bg-white"
                  >
                    <option value={0}>Horizontal (0°)</option>
                    <option value={45}>Diagonal (45°)</option>
                    <option value={-45}>Reverse Diagonal (-45°)</option>
                    <option value={90}>Vertical (90°)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="border border-gray-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400 absolute top-3 left-3">
                Live Preview
              </span>
              <div
                style={{
                  transform: `rotate(${angle}deg)`,
                  opacity: opacity,
                  fontSize: `${fontSize * 0.6}px`
                }}
                className="font-bold text-red-600 select-none text-center tracking-wider transition-all"
              >
                {text || 'WATERMARK'}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`watermarked_${file.name}`}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download Watermarked PDF</span>
              </a>
            ) : (
              <button
                onClick={handleApplyWatermark}
                disabled={isProcessing || !text.trim()}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying Watermark...</span>
                  </>
                ) : (
                  <>
                    <Stamp className="w-4 h-4" />
                    <span>Apply Watermark</span>
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

