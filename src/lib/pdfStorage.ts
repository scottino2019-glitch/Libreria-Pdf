import { PdfItem } from '../types';
import { generateSamplePdfsClient } from './samplePdfs';

const DB_NAME = 'PDFReaderLibraryDB_v1';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB non è supportato in questo browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Impossibile aprire il database locale'));
  });
}

export async function getAllStoredPdfs(): Promise<PdfItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const items: PdfItem[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const rawList = req.result || [];
        const pdfs: PdfItem[] = rawList.map((item: any) => ({
          id: item.id,
          filename: item.filename,
          title: item.title,
          size: item.size,
          addedAt: item.addedAt,
          url: item.url, // Data URL or Blob URL
          isSample: item.isSample || false,
        }));
        resolve(pdfs);
      };
      req.onerror = () => reject(req.error);
    });

    if (items.length === 0) {
      // Initialize with default sample PDFs on first load
      const samples = await generateSamplePdfsClient();
      for (const sample of samples) {
        await savePdfItem(sample);
      }
      return samples;
    }

    return items;
  } catch (err) {
    console.error('Errore durante la lettura dal database locale IndexedDB:', err);
    // Fallback if IndexedDB fails: return client-side generated samples
    return await generateSamplePdfsClient();
  }
}

export async function savePdfItem(pdf: PdfItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(pdf);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deletePdfItem(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Impossibile leggere il file selezionato'));
    reader.readAsDataURL(file);
  });
}

export async function uploadPdfClient(file: File): Promise<PdfItem> {
  const dataUrl = await readFileAsDataUrl(file);
  const cleanTitle = file.name.replace(/\.pdf$/i, '').replace(/_/g, ' ');
  const safeFilename = file.name.replace(/[^a-zA-Z0-9_\-\.\ ]/g, '_');

  const newPdf: PdfItem = {
    id: 'pdf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    filename: safeFilename.endsWith('.pdf') ? safeFilename : `${safeFilename}.pdf`,
    title: cleanTitle,
    size: file.size,
    addedAt: new Date().toISOString(),
    url: dataUrl,
    isSample: false,
  };

  await savePdfItem(newPdf);
  return newPdf;
}
