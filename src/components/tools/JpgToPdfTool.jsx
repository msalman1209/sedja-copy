import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { Upload, FileImage, Download, Plus, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

export default function JpgToPdfTool() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newItems = files.map((f) => ({
        file: f,
        previewUrl: URL.createObjectURL(f)
      }));
      setImages((prev) => [...prev, ...newItems]);
      setDownloadUrl(null);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setImages(updated);
    setDownloadUrl(null);
  };

  const moveDown = (index) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setImages(updated);
    setDownloadUrl(null);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setDownloadUrl(null);
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;

    try {
      setIsProcessing(true);
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let pdfImage;
        const isPng = item.file.type === 'image/png' || item.file.name.toLowerCase().endsWith('.png');

        if (isPng) {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const imgDims = pdfImage.scale(1);
        // Create page with matching image dimensions
        const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: imgDims.width,
          height: imgDims.height
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
      console.error('Image to PDF error:', err);
      alert('Error creating PDF: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">JPG to PDF Converter</h1>
        <p className="text-sm text-slate-500 mt-1">
          Convert JPG and PNG photos into a clean unified PDF document for free.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="jpg-to-pdf-upload"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAddImages}
            className="hidden"
          />
          <label htmlFor="jpg-to-pdf-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="btn-sejda-primary px-6 py-3 rounded-lg text-base font-semibold shadow">
              Select image files
            </span>
            <span className="text-xs text-slate-400 mt-3">or drag and drop JPG or PNG images</span>
          </label>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              Images to convert ({images.length})
            </span>
            <label className="cursor-pointer btn-sejda-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add more images</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAddImages}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto">
            {images.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-gray-200 p-2 bg-white flex flex-col shadow-sm group"
              >
                <div className="w-full aspect-[4/3] bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Page {idx + 1}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Arrange images in the order you want them in the PDF.
            </span>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                download="converted_document.pdf"
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download Generated PDF</span>
              </a>
            ) : (
              <button
                onClick={handleConvertToPdf}
                disabled={isProcessing}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4" />
                    <span>Convert to PDF</span>
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

