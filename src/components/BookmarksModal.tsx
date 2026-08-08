import React, { useState } from 'react';
import { Bookmark, PdfItem } from '../types';
import { Bookmark as BookmarkIcon, Trash2, ArrowRight, X, Clock, FileText, Plus } from 'lucide-react';

interface Props {
  bookmarks: Bookmark[];
  currentPdf?: PdfItem | null;
  currentPageNumber?: number;
  onSelectBookmark: (pdfId: string, pageNumber: number) => void;
  onRemoveBookmark: (id: string) => void;
  onAddCurrentBookmark?: (note?: string) => void;
  onClose: () => void;
}

export const BookmarksModal: React.FC<Props> = ({
  bookmarks,
  currentPdf,
  currentPageNumber,
  onSelectBookmark,
  onRemoveBookmark,
  onAddCurrentBookmark,
  onClose,
}) => {
  const [filterCurrentOnly, setFilterCurrentOnly] = useState(!!currentPdf);
  const [newNote, setNewNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const displayedBookmarks = filterCurrentOnly && currentPdf
    ? bookmarks.filter(b => b.pdfId === currentPdf.id)
    : bookmarks;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddCurrentBookmark) {
      onAddCurrentBookmark(newNote.trim() || undefined);
      setNewNote('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <BookmarkIcon size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                Segnalibri Salvati
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {displayedBookmarks.length} {displayedBookmarks.length === 1 ? 'segnalibro' : 'segnalibri'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action: Add Bookmark for Current Page */}
        {currentPdf && currentPageNumber && onAddCurrentBookmark && (
          <div className="p-3 bg-amber-50/60 border-b border-amber-100">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Plus size={16} /> Aggiungi Segnalibro • Pagina {currentPageNumber}
              </button>
            ) : (
              <form onSubmit={handleAdd} className="space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Nuovo Segnalibro — Pagina {currentPageNumber}
                </div>
                <input
                  type="text"
                  placeholder="Annotazione opzionale (es. Capitolo importante)..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs uppercase tracking-wider font-bold rounded-lg shadow-sm"
                  >
                    Salva
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filter Toggle */}
        {currentPdf && (
          <div className="p-2 border-b border-slate-200 flex gap-1 bg-slate-50 text-xs">
            <button
              onClick={() => setFilterCurrentOnly(true)}
              className={`flex-1 py-1.5 px-2 rounded-lg uppercase tracking-wider font-bold text-center transition-all ${
                filterCurrentOnly
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Questo Documento
            </button>
            <button
              onClick={() => setFilterCurrentOnly(false)}
              className={`flex-1 py-1.5 px-2 rounded-lg uppercase tracking-wider font-bold text-center transition-all ${
                !filterCurrentOnly
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tutti ({bookmarks.length})
            </button>
          </div>
        )}

        {/* List of Bookmarks */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {displayedBookmarks.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 border border-amber-200 mx-auto flex items-center justify-center mb-3">
                <BookmarkIcon size={22} />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Nessun segnalibro salvato
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tocca l'icona del segnalibro durante la lettura per conservare le pagine salienti.
              </p>
            </div>
          ) : (
            displayedBookmarks.map(b => (
              <div
                key={b.id}
                className="group p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-all flex items-start justify-between gap-3 shadow-xs"
              >
                <button
                  onClick={() => {
                    onSelectBookmark(b.pdfId, b.pageNumber);
                    onClose();
                  }}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-mono text-xs font-bold">
                      Pag. {b.pageNumber}
                    </span>
                    <span className="font-medium text-sm text-slate-900 line-clamp-1">
                      {b.title}
                    </span>
                  </div>

                  {b.note && (
                    <p className="text-xs text-slate-700 mt-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      "{b.note}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2">
                    <Clock size={11} />
                    <span>{new Date(b.createdAt).toLocaleDateString('it-IT')}</span>
                    {!filterCurrentOnly && (
                      <>
                        <span>•</span>
                        <FileText size={11} />
                        <span className="truncate max-w-[140px]">{b.pdfId}</span>
                      </>
                    )}
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onSelectBookmark(b.pdfId, b.pageNumber);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Vai alla pagina"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                    title="Elimina segnalibro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
