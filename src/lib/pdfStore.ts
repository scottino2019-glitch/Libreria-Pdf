import { PdfItem } from '../types';

const DB_NAME = 'pdf_reader_db';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_pdfs';

export interface StoredPdfRecord {
  id: string;
  filename: string;
  title: string;
  size: number;
  addedAt: string;
  blob: Blob;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB non supportata in questo ambiente'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Active Object URLs cache to prevent memory leaks and reuse URLs
const activeObjectUrls: Record<string, string> = {};

export async function saveUploadedPdf(file: File): Promise<PdfItem> {
  const db = await openDb();
  const id = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const cleanTitle = file.name.replace(/\.pdf$/i, '').replace(/_/g, ' ');

  const record: StoredPdfRecord = {
    id,
    filename: file.name,
    title: cleanTitle,
    size: file.size,
    addedAt: new Date().toISOString(),
    blob: file, // File is a Blob subclass
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  const url = URL.createObjectURL(file);
  activeObjectUrls[id] = url;

  return {
    id,
    filename: file.name,
    title: cleanTitle,
    size: file.size,
    addedAt: record.addedAt,
    url,
    isSample: false,
  };
}

export async function loadStoredPdfs(): Promise<PdfItem[]> {
  try {
    const db = await openDb();
    const records = await new Promise<StoredPdfRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    return records.map((record) => {
      if (!activeObjectUrls[record.id]) {
        activeObjectUrls[record.id] = URL.createObjectURL(record.blob);
      }
      return {
        id: record.id,
        filename: record.filename,
        title: record.title,
        size: record.size,
        addedAt: record.addedAt,
        url: activeObjectUrls[record.id],
        isSample: false,
      };
    });
  } catch (err) {
    console.warn('Impossibile caricare i PDF salvati da IndexedDB:', err);
    return [];
  }
}

export async function deleteStoredPdf(id: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    if (activeObjectUrls[id]) {
      URL.revokeObjectURL(activeObjectUrls[id]);
      delete activeObjectUrls[id];
    }
  } catch (err) {
    console.error('Errore durante l\'eliminazione del PDF da IndexedDB:', err);
  }
}
