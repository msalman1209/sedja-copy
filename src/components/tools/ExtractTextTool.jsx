import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { pdfjsLib } from '../../utils/pdfWorker';
import { FileText, Copy, Download, Upload, Loader2, Check } from 'lucide-react';

export default function ExtractTextTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setExtractedText('');

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const total = pdf.numPages;

      let fullText = '';
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += `--- PAGE ${i} ---\n\n${pageText}\n\n`;
      }

      setExtractedText(fullText.trim());
      setIsProcessing(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Text extract error:', err);
      alert('Error extracting text: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace('.pdf', '') || 'extracted'}.txt`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">PDF to Text Extractor</h1>
        <p className="text-sm text-slate-500 mt-1">
          Extract all text from your PDF document for easy reading and editing.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="text-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="text-upload" className="cursor-pointer flex flex-col items-center">
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
                setExtractedText('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Change file
            </button>
          </div>

          {!extractedText ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-slate-600">
                Click extract to pull all text content from the PDF pages.
              </p>
              <button
                onClick={handleExtract}
                disabled={isProcessing}
                className="btn-sejda-primary px-8 py-3 rounded-lg text-sm font-bold inline-flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Text...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Extract Text from PDF</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Extracted Document Text:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="btn-sejda-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="btn-sejda-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save .TXT</span>
                  </button>
                </div>
              </div>

              <textarea
                value={extractedText}
                readOnly
                rows={16}
                className="w-full p-4 border border-gray-200 rounded-xl bg-slate-50 font-mono text-xs text-slate-800 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

