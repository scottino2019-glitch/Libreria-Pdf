import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs-dist
const PDFJS_VERSION = pdfjsLib.version || '4.0.379';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  // Use unpkg / cdnjs worker corresponding to pdfjs version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
}

export { pdfjsLib };
