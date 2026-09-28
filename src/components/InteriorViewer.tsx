import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Grid, ShieldCheck, Maximize2, AlertTriangle, Lightbulb, CheckSquare, Sparkles } from 'lucide-react';
import { KDPBook, KDPPage } from '../types';

interface InteriorViewerProps {
  book: KDPBook;
}

export const InteriorViewer: React.FC<InteriorViewerProps> = ({ book }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showGuides, setShowGuides] = useState(true);
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);

  const totalPages = book.pages.length;
  const currentPage = book.pages[currentPageIndex] || book.pages[0];
  const pageNum = currentPageIndex + 1;
  const isOdd = pageNum % 2 !== 0;

  const handlePrev = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Top Controls Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Interior Inspection
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono font-medium">
            Page {pageNum} of {totalPages}
          </span>
          {currentPage.isBleedBarrier && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
              Bleed Barrier
            </span>
          )}
        </div>

        {/* Guides Toggle & View Mode */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setShowGuides(!showGuides)}
            className={`inline-flex items-center px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showGuides
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {showGuides ? 'KDP Margin Guides: ON' : 'Guides: OFF'}
          </button>

          <button
            type="button"
            onClick={() => setShowThumbnailGrid(!showThumbnailGrid)}
            className={`inline-flex items-center px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showThumbnailGrid
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {showThumbnailGrid ? 'Single Page' : 'Grid View'}
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center space-x-1 pl-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              className="p-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPageIndex === totalPages - 1}
              className="p-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Legend if enabled */}
      {showGuides && !showThumbnailGrid && (
        <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-amber-500 inline-block" />
            <span>0.375" Inside Gutter ({isOdd ? 'Left edge' : 'Right edge'})</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-cyan-500 inline-block" />
            <span>0.25" Safe Outer Margin</span>
          </div>
          {book.interiorSpec.bleed && (
            <div className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-rose-400 inline-block" />
              <span>0.125" Bleed Boundary (8.625" × 11.25")</span>
            </div>
          )}
          <span className="ml-auto text-[10px] text-slate-400">
            {isOdd ? 'ODD PAGE (Right-hand)' : 'EVEN PAGE (Left-hand)'}
          </span>
        </div>
      )}

      {/* Main Page Canvas Stage or Thumbnail Grid */}
      {showThumbnailGrid ? (
        <div className="p-4 max-h-[600px] overflow-y-auto grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 bg-slate-100">
          {book.pages.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentPageIndex(idx);
                setShowThumbnailGrid(false);
              }}
              className={`aspect-[8.5/11] p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer shadow-2xs ${
                idx === currentPageIndex
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400'
                  : 'bg-white border-slate-300 hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              <div className="text-[9px] font-mono font-bold text-slate-500">#{p.pageNumber}</div>
              <div className="text-[10px] font-semibold text-slate-800 line-clamp-2 leading-tight">
                {p.title}
              </div>
              <div className="text-[8px] text-slate-400 capitalize">{p.pageType.replace('_', ' ')}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 sm:p-8 bg-slate-100/90 flex items-center justify-center min-h-[560px]">
          
          {/* Virtual 8.5" x 11" Paper Sheet */}
          <div
            className="relative bg-white shadow-lg rounded-xs border border-slate-300 flex flex-col overflow-hidden transition-all select-none"
            style={{
              width: '100%',
              maxWidth: '460px',
              aspectRatio: '8.5 / 11',
            }}
          >
            {/* Guide Overlays */}
            {showGuides && (
              <>
                {/* Outer Safe Margin Box (0.25" / ~3%) */}
                <div
                  className="absolute inset-[3%] border border-dashed border-cyan-400 pointer-events-none z-10"
                  title="KDP 0.25-inch outer safe margin boundary"
                />
                
                {/* Alternating Inside Gutter Margin (0.375" / ~4.4%) */}
                {isOdd ? (
                  // Odd page: Gutter is on the LEFT
                  <div
                    className="absolute top-0 bottom-0 left-0 w-[4.4%] bg-amber-400/15 border-r border-dashed border-amber-500 pointer-events-none z-10"
                    title="0.375-inch inside gutter margin (binding side)"
                  />
                ) : (
                  // Even page: Gutter is on the RIGHT
                  <div
                    className="absolute top-0 bottom-0 right-0 w-[4.4%] bg-amber-400/15 border-l border-dashed border-amber-500 pointer-events-none z-10"
                    title="0.375-inch inside gutter margin (binding side)"
                  />
                )}
              </>
            )}

            {/* Page Content Rendering */}
            <div className={`p-6 sm:p-8 flex-1 flex flex-col justify-between ${isOdd ? 'pl-8' : 'pr-8'}`}>
              
              {/* Header Bar */}
              <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
                <span>{book.metadata.title}</span>
                {currentPage.chapterNumber && (
                  <span className="font-semibold text-slate-700">Tactic #{currentPage.chapterNumber}</span>
                )}
              </div>

              {/* Body Content depending on Page Type */}
              <div className="flex-1 flex flex-col justify-center">
                
                {currentPage.pageType === 'half_title' && (
                  <div className="text-center py-8">
                    <h2 className="text-base font-bold text-slate-900 mb-1">{currentPage.title}</h2>
                    <p className="text-xs text-slate-500 mb-8">{currentPage.subtitle}</p>
                    <div className="w-56 mx-auto p-4 border border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                      <div className="text-[10px] font-bold text-slate-500 mb-4">THIS BOOK BELONGS TO:</div>
                      <div className="border-b border-slate-400 w-40 mx-auto" />
                    </div>
                  </div>
                )}

                {currentPage.pageType === 'title' && (
                  <div className="text-center py-6">
                    <h1 className="text-xl font-serif font-bold text-slate-900 mb-2 leading-snug">
                      {book.metadata.title}
                    </h1>
                    <p className="text-xs text-slate-600 mb-6 italic max-w-xs mx-auto">
                      {book.metadata.subtitle}
                    </p>
                    <div className="w-10 h-10 rounded-full border border-slate-300 mx-auto mb-8 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border border-slate-400" />
                    </div>
                    <div className="text-sm font-serif font-medium text-slate-800">
                      By {book.metadata.author}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">
                      Kindle Direct Publishing Edition
                    </div>
                  </div>
                )}

                {currentPage.pageType === 'copyright' && (
                  <div className="text-[9.5px] text-slate-600 space-y-2 py-4 font-mono leading-relaxed">
                    <div className="font-bold text-slate-800">{book.metadata.title}</div>
                    <div>Copyright © {new Date().getFullYear()} {book.metadata.author}</div>
                    <div>All rights reserved. Published via Amazon KDP.</div>
                    <div className="text-[8.5px] text-slate-500 pt-3">
                      This book is manufactured to Amazon KDP 8.5" × 11.0" specifications. No unauthorized reproduction permitted.
                    </div>
                  </div>
                )}

                {currentPage.pageType === 'coloring' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-xs font-bold text-slate-900 mb-0.5">{currentPage.title}</div>
                    {currentPage.subtitle && (
                      <div className="text-[10px] text-slate-500 mb-2">{currentPage.subtitle}</div>
                    )}
                    {/* Visual Vector Artwork Frame */}
                    <div className="w-full max-w-[280px] aspect-[4/5] border-2 border-slate-800 rounded-lg p-3 bg-white flex flex-col items-center justify-between shadow-xs">
                      <div className="w-full flex-1 flex items-center justify-center">
                        {/* Dynamic Vector Artwork Mockup */}
                        <svg className="w-40 h-40 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {currentPage.illustrationSvgType === 'coloring_dino' ? (
                            <>
                              <path d="M20 70 Q 30 40 60 40 Q 80 40 85 55 Q 90 70 70 75 Z" />
                              <circle cx="75" cy="50" r="3" fill="currentColor" />
                              <path d="M35 40 L 40 30 L 45 40 M 50 40 L 55 28 L 60 40" />
                              <line x1="10" y1="78" x2="90" y2="78" strokeWidth="2" />
                            </>
                          ) : currentPage.illustrationSvgType === 'coloring_rocket' ? (
                            <>
                              <ellipse cx="50" cy="45" rx="18" ry="32" />
                              <circle cx="50" cy="38" r="6" strokeWidth="2" />
                              <path d="M32 60 L 22 75 L 35 70 M 68 60 L 78 75 L 65 70" />
                              <path d="M44 77 Q 50 92 56 77 Z" />
                              <circle cx="80" cy="20" r="5" />
                            </>
                          ) : currentPage.illustrationSvgType === 'coloring_underwater' ? (
                            <>
                              <ellipse cx="50" cy="50" rx="28" ry="18" />
                              <path d="M22 50 L 10 40 L 10 60 Z" />
                              <circle cx="68" cy="46" r="3" fill="currentColor" />
                              <circle cx="80" cy="25" r="4" />
                              <circle cx="86" cy="15" r="3" />
                            </>
                          ) : (
                            <>
                              {/* Lion face outline */}
                              <circle cx="50" cy="50" r="32" strokeWidth="3" />
                              <circle cx="50" cy="50" r="22" strokeWidth="2" />
                              <circle cx="42" cy="45" r="3" fill="currentColor" />
                              <circle cx="58" cy="45" r="3" fill="currentColor" />
                              <polygon points="50,52 46,58 54,58" fill="currentColor" />
                              <path d="M35 55 L 20 54 M 65 55 L 80 54" />
                            </>
                          )}
                        </svg>
                      </div>
                      
                      {/* Color Test Palette at bottom of coloring page */}
                      <div className="w-full pt-2 border-t border-slate-200 flex items-center justify-around">
                        {[0, 1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="w-3.5 h-3.5 rounded-full border border-slate-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentPage.pageType === 'blank_bleed_barrier' && (
                  <div className="text-center py-16 text-slate-400">
                    <div className="w-12 h-12 rounded-full border border-slate-200 mx-auto mb-3 flex items-center justify-center text-slate-300">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Protective Blank Page
                    </div>
                    <div className="text-[9.5px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                      Intentionally left unprinted to stop marker and crayon bleed-through.
                    </div>
                  </div>
                )}

                {(currentPage.pageType === 'content' || currentPage.pageType === 'intro' || currentPage.pageType === 'checklist') && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      {currentPage.title}
                    </h2>
                    {currentPage.subtitle && (
                      <p className="text-[11px] text-slate-500 font-medium">{currentPage.subtitle}</p>
                    )}
                    {currentPage.content && (
                      <p className="text-[10.5px] text-slate-700 leading-relaxed font-serif line-clamp-6">
                        {currentPage.content}
                      </p>
                    )}

                    {/* Action bullets */}
                    {currentPage.bullets && currentPage.bullets.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                        <div className="text-[9px] font-bold text-slate-700 uppercase tracking-wider flex items-center">
                          <CheckSquare className="w-3 h-3 mr-1 text-slate-500" />
                          Protocol Checklist:
                        </div>
                        {currentPage.bullets.slice(0, 3).map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start text-[9.5px] text-slate-700">
                            <span className="w-2 h-2 rounded-xs border border-slate-400 mt-0.5 mr-1.5 shrink-0" />
                            <span className="line-clamp-2">{b}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Warning Callout Box */}
                    {currentPage.warning && (
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[9.5px] flex items-start">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{currentPage.warning}</span>
                      </div>
                    )}

                    {/* Pro Tip Box */}
                    {currentPage.proTip && (
                      <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-[9.5px] flex items-start">
                        <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-sky-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{currentPage.proTip}</span>
                      </div>
                    )}
                  </div>
                )}

                {(currentPage.pageType === 'planner_month' || currentPage.pageType === 'planner_week' || currentPage.pageType === 'habit_tracker') && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900">{currentPage.title}</h2>
                    <p className="text-[11px] text-slate-500">{currentPage.subtitle}</p>
                    
                    {/* Virtual Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 border border-slate-200 p-2 rounded-lg bg-slate-50 text-center">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, dIdx) => (
                        <div key={dIdx} className="text-[8.5px] font-bold text-slate-500">{d}</div>
                      ))}
                      {Array.from({ length: 28 }).map((_, cIdx) => (
                        <div key={cIdx} className="aspect-square border border-slate-200 rounded-xs bg-white text-[8px] flex items-center justify-center text-slate-400">
                          {cIdx + 1}
                        </div>
                      ))}
                    </div>

                    {/* Habit Streak rows */}
                    <div className="space-y-1">
                      {['Hydration (2L)', 'Deep Work Focus', '30m Exercise'].map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center justify-between text-[9px] text-slate-600 border-b border-slate-100 pb-0.5">
                          <span>{h}</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((dot) => (
                              <div key={dot} className="w-2 h-2 rounded-full border border-slate-300" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Page Number in outside corner */}
              <div className={`text-[10px] text-slate-400 font-mono ${isOdd ? 'text-right' : 'text-left'}`}>
                Page {pageNum}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPageIndex === totalPages - 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-slate-400">Jump to:</span>
          <select
            value={currentPageIndex}
            onChange={(e) => setCurrentPageIndex(parseInt(e.target.value))}
            className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
          >
            {book.pages.map((p, idx) => (
              <option key={idx} value={idx}>
                Page {p.pageNumber}: {p.title.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};
