export interface PdfItem {
  id: string;
  filename: string;
  title: string;
  author?: string;
  size: number;
  addedAt: string;
  url: string;
  pageCount?: number;
  isSample?: boolean;
}

export interface Bookmark {
  id: string;
  pdfId: string;
  pageNumber: number;
  title: string;
  note?: string;
  createdAt: string;
}

export type ReadingTheme = 'light' | 'sepia' | 'dark' | 'night' | 'emerald';

export interface ReadingProgress {
  pdfId: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  theme: ReadingTheme;
  lastReadAt: string;
}

export interface ReadingSettings {
  theme: ReadingTheme;
  fontSizeScale: number; // 0.8 to 2.0
  viewMode: 'single' | 'scroll';
  autoSavePosition: boolean;
  brightness: number; // 50 to 100
}

export interface PdfOutlineItem {
  title: string;
  pageNumber: number;
  children?: PdfOutlineItem[];
}

export interface SearchResult {
  pageNumber: number;
  textSnippet: string;
  matchIndex: number;
}
