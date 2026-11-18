import * as pdfjsLib from 'pdfjs-dist';

// Use bundled worker or unpkg CDN worker to ensure reliable PDF rendering in any environment
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export { pdfjsLib };

