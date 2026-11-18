import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { pdfjsLib } from '../../utils/pdfWorker';
import {
  Type,
  PenTool,
  Highlighter,
  Eraser,
  Square,
  FileCheck,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Trash2,
  Check,
  X,
  Palette,
  Loader2,
  FilePlus,
  Stamp
} from 'lucide-react';

export default function PdfEditorTool({ initialFile = null }) {
  const [file, setFile] = useState(initialFile);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [activeTool, setActiveTool] = useState('text'); // 'text', 'draw', 'highlight', 'whiteout', 'sign'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Styling options
  const [textColor, setTextColor] = useState('#1e293b');
  const [fontSize, setFontSize] = useState(16);
  const [strokeWidth, setStrokeWidth] = useState(3);

  // Annotations state per page
  // { [pageNumber]: { texts: [], drawings: [], whiteouts: [] } }
  const [annotations, setAnnotations] = useState({});

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);

  // Signature modal state
  const [showSignModal, setShowSignModal] = useState(false);
  const sigCanvasRef = useRef(null);
  const [isSigDrawing, setIsSigDrawing] = useState(false);

  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  // Load PDF when file changes
  useEffect(() => {
    if (file) {
      loadPdf(file);
    }
  }, [file]);

  // Re-render canvas when page or zoom changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, zoom]);

  const loadPdf = async (pdfFile) => {
    try {
      setIsLoadingPdf(true);
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setAnnotations({});
      setIsLoadingPdf(false);
    } catch (err) {
      console.error('Error loading PDF in editor:', err);
      alert('Could not load PDF: ' + err.message);
      setIsLoadingPdf(false);
    }
  };

  const createBlankPdf = async () => {
    const newDoc = await PDFDocument.create();
    newDoc.addPage([595, 842]); // A4 dimensions
    const pdfBytes = await newDoc.save();
    const blankBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blankFile = new File([blankBlob], 'blank_document.pdf', { type: 'application/pdf' });
    setFile(blankFile);
  };

  const renderPage = async (pageNumber) => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: zoom });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err) {
      console.error('Page render error:', err);
    }
  };

  // Click on overlay to add text or start element
  const handleOverlayClick = (e) => {
    if (activeTool !== 'text') return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newText = {
      id: Date.now(),
      x,
      y,
      text: 'Click to edit text',
      fontSize,
      color: textColor
    };

    setAnnotations((prev) => {
      const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
      return {
        ...prev,
        [currentPage]: {
          ...pageAnns,
          texts: [...pageAnns.texts, newText]
        }
      };
    });
  };

  // Freehand drawing handlers
  const handleMouseDown = (e) => {
    if (activeTool !== 'draw' && activeTool !== 'highlight' && activeTool !== 'whiteout') return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStroke((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 0) {
      if (activeTool === 'whiteout') {
        const start = currentStroke[0];
        const end = currentStroke[currentStroke.length - 1];
        const box = {
          id: Date.now(),
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x) || 80,
          height: Math.abs(end.y - start.y) || 24
        };

        setAnnotations((prev) => {
          const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
          return {
            ...prev,
            [currentPage]: {
              ...pageAnns,
              whiteouts: [...pageAnns.whiteouts, box]
            }
          };
        });
      } else {
        const strokeData = {
          id: Date.now(),
          points: currentStroke,
          color: activeTool === 'highlight' ? 'rgba(250, 204, 21, 0.45)' : textColor,
          width: activeTool === 'highlight' ? 18 : strokeWidth
        };

        setAnnotations((prev) => {
          const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
          return {
            ...prev,
            [currentPage]: {
              ...pageAnns,
              drawings: [...pageAnns.drawings, strokeData]
            }
          };
        });
      }
    }
    setCurrentStroke([]);
  };

  // Update text content
  const handleUpdateText = (id, newText) => {
    setAnnotations((prev) => {
      const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
      return {
        ...prev,
        [currentPage]: {
          ...pageAnns,
          texts: pageAnns.texts.map((t) => (t.id === id ? { ...t, text: newText } : t))
        }
      };
    });
  };

  const handleDeleteText = (id) => {
    setAnnotations((prev) => {
      const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
      return {
        ...prev,
        [currentPage]: {
          ...pageAnns,
          texts: pageAnns.texts.filter((t) => t.id !== id)
        }
      };
    });
  };

  const handleDeleteWhiteout = (id) => {
    setAnnotations((prev) => {
      const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
      return {
        ...prev,
        [currentPage]: {
          ...pageAnns,
          whiteouts: pageAnns.whiteouts.filter((w) => w.id !== id)
        }
      };
    });
  };

  // Signature canvas drawing
  const handleSigMouseDown = (e) => {
    const rect = sigCanvasRef.current.getBoundingClientRect();
    const ctx = sigCanvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    setIsSigDrawing(true);
  };

  const handleSigMouseMove = (e) => {
    if (!isSigDrawing) return;
    const rect = sigCanvasRef.current.getBoundingClientRect();
    const ctx = sigCanvasRef.current.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleSigMouseUp = () => {
    setIsSigDrawing(false);
  };

  const handleSaveSignature = () => {
    const dataUrl = sigCanvasRef.current.toDataURL();
    // Add signature as an image/stamp
    const newStamp = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: 140,
      height: 60,
      imageSrc: dataUrl
    };

    setAnnotations((prev) => {
      const pageAnns = prev[currentPage] || { texts: [], drawings: [], whiteouts: [] };
      return {
        ...prev,
        [currentPage]: {
          ...pageAnns,
          texts: [
            ...pageAnns.texts,
            { id: Date.now(), x: 100, y: 150, text: '✍️ Signature', fontSize: 16, color: '#0f172a' }
          ]
        }
      };
    });

    setShowSignModal(false);
  };

  // Export / Save PDF with annotations
  const handleExportPdf = async () => {
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);

      // Iterate through annotated pages
      for (const [pageNumStr, pageData] of Object.entries(annotations)) {
        const pageIdx = parseInt(pageNumStr, 10) - 1;
        if (pageIdx < 0 || pageIdx >= doc.getPageCount()) continue;
        const page = doc.getPage(pageIdx);
        const { width, height } = page.getSize();
        const canvasW = canvasRef.current.width;
        const canvasH = canvasRef.current.height;
        const scaleX = width / canvasW;
        const scaleY = height / canvasH;

        // Draw whiteouts
        pageData.whiteouts?.forEach((w) => {
          page.drawRectangle({
            x: w.x * scaleX,
            y: height - (w.y + w.height) * scaleY,
            width: w.width * scaleX,
            height: w.height * scaleY,
            color: rgb(1, 1, 1)
          });
        });

        // Draw texts
        pageData.texts?.forEach((t) => {
          page.drawText(t.text, {
            x: t.x * scaleX,
            y: height - (t.y + t.fontSize) * scaleY,
            size: t.fontSize * scaleX,
            font: helvetica,
            color: rgb(0.1, 0.1, 0.1)
          });
        });
      }

      const pdfBytes = await doc.save();
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
      console.error('Error saving PDF:', err);
      alert('Error saving modified PDF: ' + err.message);
      setIsProcessing(false);
    }
  };

  const currentPageData = annotations[currentPage] || { texts: [], drawings: [], whiteouts: [] };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">PDF Editor & Form Filler</h1>
          <p className="text-sm text-slate-500">
            Edit text, draw, fill & sign, whiteout, and annotate completely free.
          </p>
        </div>

        {file && (
          <div className="flex items-center space-x-3">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`edited_${file.name}`}
                className="btn-sejda-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Download Edited PDF</span>
              </a>
            ) : (
              <button
                onClick={handleExportPdf}
                disabled={isProcessing}
                className="btn-sejda-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center space-x-2 shadow disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply Changes & Download</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors max-w-xl mx-auto space-y-4">
          <input
            type="file"
            id="editor-upload"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <label
              htmlFor="editor-upload"
              className="cursor-pointer btn-sejda-primary px-6 py-3 rounded-lg text-base font-semibold shadow inline-block"
            >
              Upload PDF to Edit
            </label>
            <p className="text-xs text-slate-400 mt-2">or drag and drop your file here</p>
          </div>

          <div className="pt-4 border-t border-emerald-100">
            <button
              onClick={createBlankPdf}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center space-x-1 mx-auto"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Or start with a blank document</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {/* Editor Toolbar matching Sejda */}
          <div className="bg-slate-100 p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            {/* Tool Mode Buttons */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTool('text')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  activeTool === 'text'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Text</span>
              </button>

              <button
                onClick={() => setActiveTool('draw')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  activeTool === 'draw'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Draw</span>
              </button>

              <button
                onClick={() => setActiveTool('highlight')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  activeTool === 'highlight'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>Highlight</span>
              </button>

              <button
                onClick={() => setActiveTool('whiteout')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  activeTool === 'whiteout'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Whiteout</span>
              </button>

              <button
                onClick={() => setShowSignModal(true)}
                className="px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 text-slate-700 hover:bg-gray-100"
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>Signature</span>
              </button>
            </div>

            {/* Formatting controls (Color, Font Size) */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-medium">Color:</span>
                {['#1e293b', '#2563eb', '#dc2626', '#16a34a'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border ${
                      textColor === c ? 'ring-2 ring-emerald-500 scale-110' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-medium">Size:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="bg-white border border-gray-300 rounded px-1.5 py-1 text-xs"
                >
                  <option value={12}>12 px</option>
                  <option value={16}>16 px</option>
                  <option value={20}>20 px</option>
                  <option value={24}>24 px</option>
                  <option value={32}>32 px</option>
                </select>
              </div>
            </div>

            {/* Pagination & Zoom */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded bg-white border border-gray-200 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-700">
                {currentPage} / {numPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage >= numPages}
                className="p-1 rounded bg-white border border-gray-200 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="border-l border-gray-300 pl-2 flex items-center space-x-1">
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                  className="p-1 rounded bg-white border border-gray-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
                  className="p-1 rounded bg-white border border-gray-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas & Overlay Work Area */}
          <div className="p-8 bg-slate-200/60 overflow-auto flex justify-center min-h-[600px]">
            {isLoadingPdf ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="text-sm">Loading document...</p>
              </div>
            ) : (
              <div className="relative shadow-2xl bg-white rounded inline-block">
                {/* Background PDF render canvas */}
                <canvas ref={canvasRef} className="block" />

                {/* Interactive Annotation Overlay */}
                <div
                  ref={overlayRef}
                  onClick={handleOverlayClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className={`absolute inset-0 select-none ${
                    activeTool === 'text'
                      ? 'cursor-text'
                      : activeTool === 'draw' || activeTool === 'highlight'
                      ? 'cursor-crosshair'
                      : activeTool === 'whiteout'
                      ? 'cursor-cell'
                      : 'cursor-default'
                  }`}
                >
                  {/* SVG for freehand drawings and highlights */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {currentPageData.drawings?.map((drw) => (
                      <polyline
                        key={drw.id}
                        points={drw.points.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                        fill="none"
                        stroke={drw.color}
                        strokeWidth={drw.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}

                    {/* Current active stroke preview */}
                    {isDrawing && currentStroke.length > 1 && (
                      <polyline
                        points={currentStroke.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                        fill="none"
                        stroke={
                          activeTool === 'highlight'
                            ? 'rgba(250, 204, 21, 0.45)'
                            : activeTool === 'whiteout'
                            ? 'rgba(200, 200, 200, 0.5)'
                            : textColor
                        }
                        strokeWidth={activeTool === 'highlight' ? 18 : strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>

                  {/* Whiteout rectangles */}
                  {currentPageData.whiteouts?.map((w) => (
                    <div
                      key={w.id}
                      style={{
                        left: `${w.x}px`,
                        top: `${w.y}px`,
                        width: `${w.width}px`,
                        height: `${w.height}px`
                      }}
                      className="absolute bg-white border border-gray-300 shadow-sm group cursor-move"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWhiteout(w.id);
                        }}
                        className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove whiteout"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Text Elements */}
                  {currentPageData.texts?.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        left: `${t.x}px`,
                        top: `${t.y}px`,
                        color: t.color,
                        fontSize: `${t.fontSize}px`
                      }}
                      className="absolute group border border-dashed border-transparent hover:border-emerald-500 rounded p-1 bg-white/40"
                    >
                      <input
                        type="text"
                        value={t.text}
                        onChange={(e) => handleUpdateText(t.id, e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white/90 rounded px-1 font-sans"
                        style={{ color: t.color, fontSize: `${t.fontSize}px` }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteText(t.id);
                        }}
                        className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete text"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Signature</h3>
            <p className="text-xs text-slate-500 mb-4">
              Draw your signature below using mouse or finger.
            </p>

            <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden mb-4">
              <canvas
                ref={sigCanvasRef}
                width={380}
                height={160}
                onMouseDown={handleSigMouseDown}
                onMouseMove={handleSigMouseMove}
                onMouseUp={handleSigMouseUp}
                className="w-full bg-white cursor-crosshair block"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const ctx = sigCanvasRef.current.getContext('2d');
                  ctx.clearRect(0, 0, 380, 160);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Clear
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSignature}
                  className="btn-sejda-primary px-4 py-1.5 rounded-lg text-xs font-bold"
                >
                  Save & Place Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

