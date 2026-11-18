import React, { useState, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { pdfjsLib } from '../../utils/pdfWorker';
import { RotateCw, RotateCcw, Download, Upload, Loader2, CheckCircle } from 'lucide-react';

export default function RotatePdfTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [pages, setPages] = useState([]);
  const [rotations, setRotations] = useState({}); // { [pageNumber]: angle (0, 90, 180, 270) }
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (file) {
      loadPages(file);
    }
  }, [file]);

  const loadPages = async (pdfFile) => {
    try {
      setIsLoadingPages(true);
      setRotations({});
      setDownloadUrl(null);

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const renderedPages = [];
      const initRotations = {};

      for (let i = 1; i <= pdf.numPages; i++) {
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
        initRotations[i] = 0;
      }

      setPages(renderedPages);
      setRotations(initRotations);
      setIsLoadingPages(false);
    } catch (err) {
      console.error('Error loading pages for rotation:', err);
      alert('Could not render pages: ' + err.message);
      setIsLoadingPages(false);
    }
  };

  const rotatePage = (pageNum, delta) => {
    setRotations((prev) => ({
      ...prev,
      [pageNum]: ((prev[pageNum] || 0) + delta + 360) % 360
    }));
    setDownloadUrl(null);
  };

  const rotateAll = (delta) => {
    setRotations((prev) => {
      const next = {};
      pages.forEach((p) => {
        next[p.pageNumber] = ((prev[p.pageNumber] || 0) + delta + 360) % 360;
      });
      return next;
    });
    setDownloadUrl(null);
  };

  const handleApplyRotation = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      pages.forEach((p) => {
        const angle = rotations[p.pageNumber] || 0;
        if (angle !== 0) {
          const page = pdfDoc.getPage(p.pageNumber - 1);
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + angle) % 360));
        }
      });

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
      console.error('Error rotating PDF:', err);
      alert('Error applying rotation: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Rotate PDF Pages</h1>
        <p className="text-sm text-slate-500 mt-1">
          Rotate all pages or specific pages permanently and save.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="rotate-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="rotate-upload" className="cursor-pointer flex flex-col items-center">
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
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-2">Rotate All:</span>
              <button
                onClick={() => rotateAll(90)}
                className="btn-sejda-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Right 90°</span>
              </button>
              <button
                onClick={() => rotateAll(-90)}
                className="btn-sejda-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Left 90°</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={`rotated_${file.name}`}
                  className="btn-sejda-primary px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rotated PDF</span>
                </a>
              ) : (
                <button
                  onClick={handleApplyRotation}
                  disabled={isProcessing}
                  className="btn-sejda-primary px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save Changes</span>
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
              <p className="text-sm">Rendering pages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pages.map((p) => {
                const angle = rotations[p.pageNumber] || 0;
                return (
                  <div
                    key={p.pageNumber}
                    className="rounded-xl border border-gray-200 bg-white p-2.5 flex flex-col items-center shadow-sm"
                  >
                    <div className="w-full aspect-[3/4] bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={p.thumbnail}
                        alt={`Page ${p.pageNumber}`}
                        style={{
                          transform: `rotate(${angle}deg)`,
                          transition: 'transform 0.25s ease'
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mt-2 w-full flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-700">P. {p.pageNumber}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => rotatePage(p.pageNumber, -90)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-gray-100"
                          title="Rotate Left"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => rotatePage(p.pageNumber, 90)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-gray-100"
                          title="Rotate Right"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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

