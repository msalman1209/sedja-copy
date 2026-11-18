import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { pdfjsLib } from '../../utils/pdfWorker';
import { Trash2, RotateCcw, Download, CheckCircle, Upload, Loader2, Eye } from 'lucide-react';

export default function DeletePagesTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [pages, setPages] = useState([]);
  const [deletedIndices, setDeletedIndices] = useState(new Set());
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (file) {
      loadDocumentPages(file);
    }
  }, [file]);

  const loadDocumentPages = async (pdfFile) => {
    try {
      setIsLoadingPages(true);
      setDeletedIndices(new Set());
      setDownloadUrl(null);

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const renderedPages = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        renderedPages.push({
          pageNumber: i,
          thumbnail: canvas.toDataURL()
        });
      }

      setPages(renderedPages);
      setIsLoadingPages(false);
    } catch (err) {
      console.error('Error rendering thumbnails:', err);
      alert('Could not render document pages: ' + err.message);
      setIsLoadingPages(false);
    }
  };

  const toggleDelete = (pageNumber) => {
    setDeletedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) {
        next.delete(pageNumber);
      } else {
        next.add(pageNumber);
      }
      return next;
    });
    setDownloadUrl(null);
  };

  const handleApplyChanges = async () => {
    if (!file) return;
    if (deletedIndices.size === pages.length) {
      alert('You cannot delete all pages from the document.');
      return;
    }
    if (deletedIndices.size === 0) {
      alert('Please click on at least one page thumbnail to delete it.');
      return;
    }

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const keepPageIndices = [];
      for (let i = 1; i <= pages.length; i++) {
        if (!deletedIndices.has(i)) {
          keepPageIndices.push(i - 1);
        }
      }

      const copiedPages = await newPdf.copyPages(pdfDoc, keepPageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsProcessing(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Delete pages error:', err);
      alert('Error deleting pages: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Delete PDF Pages</h1>
        <p className="text-sm text-slate-500 mt-1">
          Remove unwanted pages from your PDF document easily.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="delete-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="delete-upload" className="cursor-pointer flex flex-col items-center">
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
          {/* Action bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <span className="text-sm font-bold text-slate-800">{file.name}</span>
              <span className="text-xs text-slate-500 ml-2">
                ({pages.length} pages, {deletedIndices.size} selected for removal)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={`modified_${file.name}`}
                  className="btn-sejda-primary px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clean PDF</span>
                </a>
              ) : (
                <button
                  onClick={handleApplyChanges}
                  disabled={isProcessing || deletedIndices.size === 0}
                  className="btn-sejda-primary px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Grid of pages */}
          {isLoadingPages ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-sm">Rendering page previews...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pages.map((p) => {
                const isDeleted = deletedIndices.has(p.pageNumber);
                return (
                  <div
                    key={p.pageNumber}
                    onClick={() => toggleDelete(p.pageNumber)}
                    className={`relative rounded-xl border-2 transition-all p-2 flex flex-col items-center cursor-pointer group ${
                      isDeleted
                        ? 'border-red-400 bg-red-50/60 opacity-60'
                        : 'border-gray-200 hover:border-emerald-500 bg-white shadow-sm'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={p.thumbnail}
                        alt={`Page ${p.pageNumber}`}
                        className={`w-full h-full object-contain ${
                          isDeleted ? 'filter grayscale brightness-75' : ''
                        }`}
                      />
                    </div>

                    {/* Page tag & trash button */}
                    <div className="mt-2 w-full flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-700">Page {p.pageNumber}</span>
                      <button
                        type="button"
                        className={`p-1 rounded-full transition-colors ${
                          isDeleted
                            ? 'text-red-600 bg-red-100 hover:bg-red-200'
                            : 'text-gray-400 group-hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={isDeleted ? 'Restore page' : 'Delete page'}
                      >
                        {isDeleted ? (
                          <RotateCcw className="w-3.5 h-3.5" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Overlay badge when deleted */}
                    {isDeleted && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-xl pointer-events-none">
                        <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow">
                          Deleted
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

