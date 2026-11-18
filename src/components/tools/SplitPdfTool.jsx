import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { Upload, Scissors, Download, Loader2, CheckCircle, Layers } from 'lucide-react';

export default function SplitPdfTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [splitMode, setSplitMode] = useState('range'); // 'range' or 'all'
  const [pageRange, setPageRange] = useState('1-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isZip, setIsZip] = useState(false);

  const handleSplit = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      if (splitMode === 'all') {
        // Split every page into separate PDF inside a ZIP
        const zip = new JSZip();

        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          zip.file(`page_${i + 1}.pdf`, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        setDownloadUrl(url);
        setIsZip(true);
      } else {
        // Parse page range e.g. "1-2, 4"
        const newDoc = await PDFDocument.create();
        const pagesToExtract = [];

        const parts = pageRange.split(',');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
                pagesToExtract.push(i - 1);
              }
            }
          } else {
            const single = Number(trimmed);
            if (!isNaN(single) && single >= 1 && single <= totalPages) {
              pagesToExtract.push(single - 1);
            }
          }
        }

        if (pagesToExtract.length === 0) {
          alert(`Please enter a valid page range between 1 and ${totalPages}.`);
          setIsProcessing(false);
          return;
        }

        const copied = await newDoc.copyPages(pdfDoc, pagesToExtract);
        copied.forEach((p) => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsZip(false);
      }

      setIsProcessing(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Split error:', err);
      alert('Error splitting PDF: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Split PDF by Pages</h1>
        <p className="text-sm text-slate-500 mt-1">
          Extract specific pages or save every page into separate PDF documents.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="split-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="split-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="btn-sejda-primary px-6 py-3 rounded-lg text-base font-semibold shadow">
              Select PDF file to split
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

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Split Method:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setSplitMode('range');
                  setDownloadUrl(null);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  splitMode === 'range'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Scissors className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">Extract Specific Pages</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Specify page numbers or ranges (e.g. 1-3, 5).
                </p>
                {splitMode === 'range' && (
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-2, 4"
                    className="w-full text-xs p-2 border border-emerald-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                )}
              </div>

              <div
                onClick={() => {
                  setSplitMode('all');
                  setDownloadUrl(null);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  splitMode === 'all'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">Split Every Single Page</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Extracts every page as an individual PDF inside a single ZIP download.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={isZip ? `split_pages.zip` : `extracted_${file.name}`}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download {isZip ? 'ZIP Archive' : 'Extracted PDF'}</span>
              </a>
            ) : (
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Splitting PDF...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Split PDF</span>
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

