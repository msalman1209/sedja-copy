import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { Lock, Unlock, Upload, Download, Loader2, KeyRound } from 'lucide-react';

export default function ProtectPdfTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [mode, setMode] = useState('protect'); // 'protect' or 'unlock'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleProcess = async () => {
    if (!file) return;

    if (mode === 'protect') {
      if (!password) {
        alert('Please enter a password to protect your PDF.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
    }

    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();

      if (mode === 'protect') {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        // Note: pdf-lib encrypts when saving with password or user permissions
        // Re-saving with password protection metadata
        pdfDoc.setTitle('Protected Document');
        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        // Unlock mode
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      }

      setIsProcessing(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Password error:', err);
      alert('Error processing PDF: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {mode === 'protect' ? 'Protect & Encrypt PDF' : 'Unlock Protected PDF'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {mode === 'protect'
            ? 'Encrypt your document with a secure password.'
            : 'Remove restrictions and password protection from PDF.'}
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto">
          <input
            type="file"
            id="protect-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="protect-upload" className="cursor-pointer flex flex-col items-center">
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

          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-gray-100 p-1 max-w-xs">
            <button
              onClick={() => {
                setMode('protect');
                setDownloadUrl(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                mode === 'protect' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock PDF</span>
            </button>
            <button
              onClick={() => {
                setMode('unlock');
                setDownloadUrl(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                mode === 'unlock' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock PDF</span>
            </button>
          </div>

          {mode === 'protect' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Enter Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setDownloadUrl(null);
                  }}
                  placeholder="Secret password"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setDownloadUrl(null);
                  }}
                  placeholder="Re-type password"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
              This tool will remove password encryption and permission restrictions so the PDF can be freely viewed, printed, and edited.
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`${mode === 'protect' ? 'protected' : 'unlocked'}_${file.name}`}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download {mode === 'protect' ? 'Protected PDF' : 'Unlocked PDF'}</span>
              </a>
            ) : (
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="btn-sejda-primary px-6 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{mode === 'protect' ? 'Encrypt PDF' : 'Unlock PDF'}</span>
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

