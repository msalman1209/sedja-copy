import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { Hash, Download, Upload, Loader2, CheckCircle } from 'lucide-react';

export default function PageNumbersTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [format, setFormat] = useState('page_of_total'); // 'page_only', 'page_of_total', 'bare_number'
  const [position, setPosition] = useState('bottom_center'); // 'bottom_center', 'bottom_right', 'top_right'
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleApplyNumbers = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const pageNum = i + 1;

        let label = `${pageNum}`;
        if (format === 'page_only') label = `Page ${pageNum}`;
        if (format === 'page_of_total') label = `Page ${pageNum} of ${totalPages}`;

        const textWidth = font.widthOfTextAtSize(label, 10);
        let x = width / 2 - textWidth / 2;
        let y = 25; // bottom

        if (position === 'bottom_right') {
          x = width - textWidth - 36;
          y = 25;
        } else if (position === 'top_right') {
          x = width - textWidth - 36;
          y = height - 30;
        }

        page.drawText(label, {
          x,
          y,
          size: 10,
          font,
          color: rgb(0.3, 0.3, 0.3)
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
      console.error('Page numbers error:', err);
      alert('Error applying page numbers: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Add Page Numbers to PDF</h1>
        <p className="text-sm text-slate-500 mt-1">
          Apply sequential page numbers or headers to your document.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="numbers-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="numbers-upload" className="cursor-pointer flex flex-col items-center">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Numbering Format:
              </label>
              <select
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                  setDownloadUrl(null);
                }}
                className="w-full text-sm p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="page_of_total">Page 1 of N</option>
                <option value="page_only">Page 1</option>
                <option value="bare_number">Just Number (1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Position on Page:
              </label>
              <select
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  setDownloadUrl(null);
                }}
                className="w-full text-sm p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="bottom_center">Bottom Center</option>
                <option value="bottom_right">Bottom Right</option>
                <option value="top_right">Top Right</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`numbered_${file.name}`}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download Numbered PDF</span>
              </a>
            ) : (
              <button
                onClick={handleApplyNumbers}
                disabled={isProcessing}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding Page Numbers...</span>
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4" />
                    <span>Apply Page Numbers</span>
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

