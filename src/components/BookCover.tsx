import React from 'react';
import { Bookmark as BookmarkIcon, BookOpen, CheckCircle2 } from 'lucide-react';

interface BookCoverProps {
  title: string;
  progress?: { currentPage: number; totalPages: number };
  bookmarksCount?: number;
  isSample?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'shelf';
  onClick?: () => void;
}

// Deterministic color generator based on book title
const BOOK_PALETTES = [
  { bg: 'from-amber-900 via-amber-950 to-stone-900', accent: '#D4AF37', text: '#FCE7D0', spine: 'bg-amber-950', border: 'border-amber-700/50' },
  { bg: 'from-emerald-900 via-emerald-950 to-stone-900', accent: '#34D399', text: '#ECFDF5', spine: 'bg-emerald-950', border: 'border-emerald-700/50' },
  { bg: 'from-slate-900 via-blue-950 to-stone-900', accent: '#60A5FA', text: '#EFF6FF', spine: 'bg-slate-950', border: 'border-blue-700/50' },
  { bg: 'from-rose-950 via-red-950 to-stone-900', accent: '#F87171', text: '#FEF2F2', spine: 'bg-rose-950', border: 'border-rose-700/50' },
  { bg: 'from-purple-950 via-indigo-950 to-stone-900', accent: '#C084FC', text: '#F3E8FF', spine: 'bg-purple-950', border: 'border-purple-700/50' },
  { bg: 'from-stone-900 via-stone-800 to-stone-950', accent: '#E7E5E4', text: '#FAF9F6', spine: 'bg-stone-950', border: 'border-stone-700/50' },
];

function getPalette(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BOOK_PALETTES.length;
  return BOOK_PALETTES[index];
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  progress,
  bookmarksCount = 0,
  isSample = false,
  size = 'md',
  onClick,
}) => {
  const palette = getPalette(title);
  const isFinished = progress && progress.currentPage >= progress.totalPages;
  const percent = progress && progress.totalPages > 0
    ? Math.min(100, Math.round((progress.currentPage / progress.totalPages) * 100))
    : 0;

  // Cleanup title for cover display (remove .pdf extension if present)
  const displayTitle = title.replace(/\.pdf$/i, '');

  if (size === 'shelf') {
    return (
      <div
        onClick={onClick}
        className="group relative cursor-pointer flex flex-col items-center justify-end h-44 w-28 sm:h-52 sm:w-32 transition-transform duration-300 hover:-translate-y-2 hover:scale-105"
      >
        {/* Ribbon Bookmark Hanging Down */}
        {bookmarksCount > 0 && (
          <div className="absolute -top-1 right-3 z-30 w-3.5 h-10 bg-amber-500 shadow-md flex items-end justify-center pb-1 clip-ribbon">
            <BookmarkIcon size={10} className="text-amber-950 fill-amber-950" />
          </div>
        )}

        {/* 3D Book Volume Container */}
        <div className={`relative w-full h-full rounded-r-md rounded-l-xs bg-gradient-to-tr ${palette.bg} p-3 flex flex-col justify-between shadow-2xl border ${palette.border} overflow-hidden group-hover:shadow-amber-900/20 transition-all`}>
          {/* Left Spine Shadow / Fold Line */}
          <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-black/40 border-r border-white/10" />
          <div className="absolute top-0 left-2.5 bottom-0 w-1 bg-white/10" />

          {/* Right Paper Edge Texture */}
          <div className="absolute top-1 right-0 bottom-1 w-1.5 bg-[#E8E3D9] border-l border-stone-400/50 opacity-80" />

          {/* Gold Decorative Border Frame */}
          <div className="relative z-10 h-full border border-[#D4AF37]/30 rounded-xs p-2.5 flex flex-col justify-between bg-black/10">
            {/* Top Badge */}
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">
              <span>VOL.</span>
              {isSample && <span className="px-1 bg-amber-400/20 rounded text-[8px]">EX</span>}
            </div>

            {/* Book Title Stamped */}
            <div className="my-auto text-center px-1">
              <h4 className="font-serif text-xs sm:text-sm font-normal leading-snug line-clamp-3 text-[#FCE7D0] drop-shadow-xs">
                {displayTitle}
              </h4>
            </div>

            {/* Progress / Pages Footer */}
            {progress && progress.currentPage > 1 ? (
              <div className="w-full">
                <div className="flex items-center justify-between text-[9px] text-stone-300 font-mono mb-1">
                  <span>{percent}%</span>
                  <span>P.{progress.currentPage}</span>
                </div>
                <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-center text-amber-200/60 font-serif italic">
                Sfoglia
              </div>
            )}
          </div>
        </div>

        {/* Book Reflection / Base Shadow on Shelf */}
        <div className="w-full h-2 bg-black/40 rounded-full blur-xs mt-1 transform scale-x-90" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer group flex flex-col rounded-r-lg rounded-l-xs bg-gradient-to-br ${palette.bg} p-4 shadow-lg hover:shadow-2xl border ${palette.border} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
    >
      {/* Ribbon Bookmark */}
      {bookmarksCount > 0 && (
        <div className="absolute top-0 right-4 z-20 w-4 h-10 bg-amber-500 shadow-md flex items-end justify-center pb-1">
          <BookmarkIcon size={11} className="text-amber-950 fill-amber-950" />
        </div>
      )}

      {/* Book 3D Spine Crease */}
      <div className="absolute top-0 left-0 bottom-0 w-3 bg-black/40 border-r border-white/10" />
      <div className="absolute top-0 left-3 bottom-0 w-1 bg-white/10" />

      {/* Book Inner Frame */}
      <div className="relative z-10 pl-2 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-semibold">
            DOCUMENTO PDF
          </span>
          {isFinished && (
            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} /> Letto
            </span>
          )}
        </div>

        <div>
          <h3 className="font-serif text-lg sm:text-xl text-[#FAF9F6] font-normal leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors">
            {displayTitle}
          </h3>
        </div>

        {/* Progress bar */}
        {progress && progress.currentPage > 1 && (
          <div className="pt-2 border-t border-white/10">
            <div className="flex justify-between text-[11px] font-mono text-stone-300 mb-1">
              <span>Lettura: {percent}%</span>
              <span>Pag. {progress.currentPage} / {progress.totalPages}</span>
            </div>
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
