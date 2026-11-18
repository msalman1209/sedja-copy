import React, { useState } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { pdfjsLib } from '../../utils/pdfWorker';
import { Image, Download, Upload, Loader2, Sparkles, Archive } from 'lucide-react';

export default function PdfToJpgTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setImages([]);
      setProgress(0);

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const total = pdf.numPages;

      const converted = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // High resolution 1.5x
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        converted.push({
          pageNumber: i,
          dataUrl
        });

        setProgress(Math.round((i / total) * 100));
      }

      setImages(converted);
      setIsProcessing(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('PDF to JPG conversion error:', err);
      alert('Error converting PDF to images: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();

    images.forEach((img) => {
      const base64Data = img.dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      zip.file(`page_${img.pageNumber}.jpg`, base64Data, { base64: true });
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace('.pdf', '') || 'pdf'}_images.zip`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">PDF to JPG Converter</h1>
        <p className="text-sm text-slate-500 mt-1">
          Convert all pages of your PDF into high-quality JPG images for free.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="pdf-to-jpg-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="pdf-to-jpg-upload" className="cursor-pointer flex flex-col items-center">
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
                setImages([]);
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Change file
            </button>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-slate-600">
                Click convert to extract every page as a high-resolution JPG image.
              </p>
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="btn-sejda-primary px-8 py-3 rounded-lg text-sm font-bold inline-flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Converting pages ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    <span>Convert Entire PDF to JPG</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Successfully converted {images.length} pages!</span>
                </div>
                <button
                  onClick={handleDownloadZip}
                  className="btn-sejda-primary px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 shadow"
                >
                  <Archive className="w-4 h-4" />
                  <span>Download All as ZIP</span>
                </button>
              </div>

              {/* Grid of image results */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.pageNumber}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col group shadow-sm"
                  >
                    <div className="aspect-[3/4] bg-white overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={img.dataUrl}
                        alt={`Page ${img.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Page {img.pageNumber}</span>
                      <a
                        href={img.dataUrl}
                        download={`page_${img.pageNumber}.jpg`}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JPG</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

