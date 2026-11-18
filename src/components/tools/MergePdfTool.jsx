import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { Upload, ArrowUp, ArrowDown, Trash2, FileText, CheckCircle, Download, Plus, Loader2 } from 'lucide-react';

export default function MergePdfTool({ initialFiles = [] }) {
  const [files, setFiles] = useState(initialFiles);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFileName, setOutputFileName] = useState('merged_document.pdf');

  const handleAddFiles = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      setDownloadUrl(null);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...files];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setFiles(updated);
    setDownloadUrl(null);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setFiles(updated);
    setDownloadUrl(null);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setDownloadUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsProcessing(false);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Merge error:', err);
      alert('Error merging PDFs: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Merge PDF Files Online</h1>
        <p className="text-sm text-slate-500 mt-1">
          Combine multiple PDF files and images into one document for free.
        </p>
      </div>

      {/* Files list or upload area */}
      {files.length === 0 ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
          <input
            type="file"
            id="merge-upload"
            multiple
            accept=".pdf,application/pdf"
            onChange={handleAddFiles}
            className="hidden"
          />
          <label htmlFor="merge-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="btn-sejda-primary px-6 py-3 rounded-lg text-base font-semibold shadow">
              Select 2 or more PDF files
            </span>
            <span className="text-xs text-slate-400 mt-3">or drag and drop them here</span>
          </label>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              Files to merge ({files.length})
            </span>
            <label className="cursor-pointer btn-sejda-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add more files</span>
              <input
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={handleAddFiles}
                className="hidden"
              />
            </label>
          </div>

          <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${idx}`}
                className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-gray-100"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-gray-100"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50 ml-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Drag or use arrows to adjust page order before merging.
            </span>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={outputFileName}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </a>
            ) : (
              <button
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Merging PDFs...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Merge PDF</span>
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

