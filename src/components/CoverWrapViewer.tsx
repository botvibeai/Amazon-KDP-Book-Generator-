import React, { useState } from 'react';
import { Layers, ShieldCheck, Box, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { KDPBook } from '../types';
import { calculateCoverWrapDimensions } from '../utils/kdpSpecs';

interface CoverWrapViewerProps {
  book: KDPBook;
}

export const CoverWrapViewer: React.FC<CoverWrapViewerProps> = ({ book }) => {
  const [viewMode, setViewMode] = useState<'wrap' | '3d'>('wrap');
  const [showGuides, setShowGuides] = useState(true);

  const pageCount = book.pages.length;
  const wrap = calculateCoverWrapDimensions(pageCount, book.interiorSpec.paperType);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              KDP Full-Wrap Cover Blueprint
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-semibold">
              Width: {wrap.totalWidthInches}" × Height: {wrap.totalHeightInches}"
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full wrap includes Front Cover, Calculated Spine, Back Cover, and 0.125" Bleed
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setShowGuides(!showGuides)}
            className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer ${
              showGuides
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {showGuides ? 'Safe Guides: ON' : 'Safe Guides: OFF'}
          </button>

          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('wrap')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                viewMode === 'wrap' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D Flat Wrap
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                viewMode === '3d' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D Perspective
            </button>
          </div>
        </div>
      </div>

      {/* Spine Spec Callout Banner */}
      <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200/60 flex flex-wrap items-center justify-between text-xs text-amber-950 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Spine Formula:</span>
          <code className="bg-amber-100/80 px-2 py-0.5 rounded text-[11px] font-mono text-amber-900">
            0.002252 × {pageCount} pages = {wrap.spineWidthInches}" ({wrap.spineWidthPt.toFixed(1)} pt)
          </code>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px]">
          {wrap.spineTextAllowed ? (
            <span className="inline-flex items-center text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Spine text eligible ({pageCount} ≥ 80 pages)
            </span>
          ) : (
            <span className="inline-flex items-center text-amber-800 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Spine text blank per Amazon rule ({pageCount} &lt; 80 pages)
            </span>
          )}
        </div>
      </div>

      {/* Cover Canvas Area */}
      {viewMode === 'wrap' ? (
        <div className="p-4 sm:p-8 bg-slate-200/80 flex flex-col items-center justify-center overflow-x-auto">
          
          {/* Flat 2D Full Wrap Container */}
          <div
            className="relative shadow-xl rounded-xs flex overflow-hidden select-none border border-slate-400"
            style={{
              width: '100%',
              maxWidth: '820px',
              aspectRatio: `${wrap.totalWidthInches} / ${wrap.totalHeightInches}`,
              backgroundColor: book.coverSpec.primaryColor || '#0f172a',
            }}
          >
            {/* Guide Overlays if ON */}
            {showGuides && (
              <>
                {/* 0.125" Bleed Rim (Red dashed line) */}
                <div className="absolute inset-[1.5%] border border-dashed border-rose-400/80 pointer-events-none z-20" />
                
                {/* Dimension Rulers Banner inside top */}
                <div className="absolute top-2 left-3 right-3 flex justify-between text-[8px] font-mono text-slate-400/90 pointer-events-none z-20">
                  <span>BACK COVER (8.5")</span>
                  <span className="text-amber-400 font-bold">SPINE ({wrap.spineWidthInches}")</span>
                  <span>FRONT COVER (8.5")</span>
                </div>
              </>
            )}

            {/* BACK COVER (Left side ~48%) */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between border-r border-slate-700/50 text-slate-200 relative z-10">
              
              {/* Back Cover Headline & Blurb */}
              <div>
                <div 
                  className="text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: book.coverSpec.accentColor || '#f59e0b' }}
                >
                  WHY THIS BOOK IS ESSENTIAL
                </div>
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-300 leading-relaxed font-sans line-clamp-6">
                  {book.coverSpec.backCoverBlurb}
                </p>

                {/* Back Cover Bullets */}
                <div className="mt-3 space-y-1.5">
                  {book.coverSpec.backCoverBullets.slice(0, 3).map((bullet, idx) => (
                    <div key={idx} className="flex items-start text-[9px] sm:text-[10px] text-slate-300">
                      <span 
                        className="w-1.5 h-1.5 rounded-full mt-1 mr-2 shrink-0" 
                        style={{ backgroundColor: book.coverSpec.accentColor || '#f59e0b' }}
                      />
                      <span className="line-clamp-2">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom section of back cover: Barcode safe clearance box */}
              <div className="flex items-end justify-between pt-4">
                <div className="text-[8px] text-slate-400 font-mono">
                  {book.interiorSpec.trimWidthInches}" × {book.interiorSpec.trimHeightInches}" Trim
                </div>

                {/* Mandatory Amazon KDP Barcode Zone (2" x 1.2") */}
                <div
                  className="bg-white border-2 border-slate-400 rounded-xs p-1.5 text-center flex flex-col items-center justify-center shadow-xs"
                  style={{ width: '100px', height: '56px' }}
                  title="Amazon KDP Barcode Safe Zone (Mandatory 2x1.2 inch clearance)"
                >
                  <div className="text-[6.5px] font-bold text-slate-700 uppercase">
                    Amazon Barcode Zone
                  </div>
                  <div className="w-16 h-4 bg-slate-800 my-0.5 flex items-center justify-center">
                    <span className="text-[5px] text-white font-mono">|||||||||||||||</span>
                  </div>
                  <div className="text-[5.5px] text-slate-500">
                    Auto-placed by KDP
                  </div>
                </div>
              </div>
            </div>

            {/* SPINE (Center strip) */}
            <div
              className="bg-black/70 flex flex-col items-center justify-center relative border-x border-slate-700/60 shadow-inner z-10"
              style={{
                width: Math.max(wrap.spineWidthPt * 0.9, 24),
              }}
            >
              {wrap.spineTextAllowed ? (
                <div
                  className="text-white font-bold text-[8px] sm:text-[9px] tracking-wider whitespace-nowrap rotate-90 select-none opacity-90"
                >
                  {(book.coverSpec.frontTitle || book.metadata.title).slice(0, 32)} • {book.metadata.author}
                </div>
              ) : (
                <div className="text-[6px] text-slate-500 rotate-90 whitespace-nowrap">
                  No text (&lt;80 pgs)
                </div>
              )}
            </div>

            {/* FRONT COVER (Right side ~48%) */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between text-center relative border-l border-slate-700/50 overflow-hidden">
              
              {/* Optional Focal Hero Art Background */}
              {book.coverSpec.coverImageUrl && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={book.coverSpec.coverImageUrl}
                    alt="Cover Hero"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/90" />
                </div>
              )}

              {/* Inner Decorative Accent Border */}
              <div 
                className="absolute inset-4 border-2 rounded-xs pointer-events-none z-10" 
                style={{ borderColor: `${book.coverSpec.accentColor || '#f59e0b'}80` }}
              />

              {/* Top Edition Tag or Authority Trust Badge */}
              <div className="pt-2 relative z-20">
                <span 
                  className="text-[8px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded shadow-sm"
                  style={{
                    backgroundColor: book.coverSpec.accentColor || '#f59e0b',
                    color: '#000000',
                  }}
                >
                  {book.coverSpec.psychologyBadge || 'Amazon KDP Certified Edition'}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="my-auto py-3 relative z-20">
                <h1 
                  className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight uppercase leading-tight mb-2 drop-shadow-md"
                  style={{ color: book.coverSpec.secondaryColor || '#ffffff' }}
                >
                  {book.coverSpec.frontTitle || book.metadata.title}
                </h1>
                {(book.coverSpec.frontSubtitle || book.metadata.subtitle) && (
                  <p className="text-[9px] sm:text-[10px] text-white/90 font-sans italic max-w-[240px] mx-auto line-clamp-2 drop-shadow-xs">
                    {book.coverSpec.frontSubtitle || book.metadata.subtitle}
                  </p>
                )}

                {/* Central Motif or Pill */}
                {!book.coverSpec.coverImageUrl && (
                  <div 
                    className="w-12 h-12 rounded-full border-2 mx-auto my-3 flex items-center justify-center"
                    style={{ borderColor: book.coverSpec.accentColor || '#f59e0b' }}
                  >
                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                      <span className="text-[9px] text-amber-300 font-serif">KDP</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Author & Specs */}
              <div className="pb-2 relative z-20">
                <div className="text-xs font-semibold text-white tracking-wide drop-shadow-xs">
                  {book.coverSpec.authorName || book.metadata.author}
                </div>
                <div className="text-[8px] text-white/75 mt-0.5">
                  Complete {pageCount}-Page Print Edition
                </div>
              </div>

            </div>

          </div>

          <div className="mt-4 text-center text-xs text-slate-600 max-w-lg">
            <strong>Amazon KDP Cover Engine:</strong> Automatically builds full wrap with calculated bleed and spine width. Upload this single PDF directly to the Amazon KDP cover upload section!
          </div>

        </div>
      ) : (
        /* 3D Perspective View */
        <div className="p-8 sm:p-14 bg-slate-900 flex items-center justify-center min-h-[460px]">
          
          <div className="relative perspective-[1200px] flex items-center justify-center">
            
            {/* 3D Book Object */}
            <div
              className="relative shadow-2xl flex rounded-xs transition-transform duration-500 hover:rotate-y-[-10deg]"
              style={{
                width: '280px',
                height: '380px',
                transform: 'rotateY(-25deg) rotateX(10deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Spine edge (3D Left face) */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-slate-950 border-r border-slate-700 flex items-center justify-center shadow-lg"
                style={{
                  width: '32px',
                  transform: 'rotateY(-90deg) translateZ(16px)',
                }}
              >
                <span 
                  className="text-[8px] font-bold rotate-90 whitespace-nowrap"
                  style={{ color: book.coverSpec.accentColor || '#fbbf24' }}
                >
                  {(book.coverSpec.frontTitle || book.metadata.title).slice(0, 24)}
                </span>
              </div>

              {/* Front Cover (3D Front face) */}
              <div
                className="w-full h-full border-2 p-6 flex flex-col justify-between text-center rounded-xs shadow-2xl relative overflow-hidden"
                style={{
                  transform: 'translateZ(16px)',
                  backgroundColor: book.coverSpec.primaryColor || '#0f172a',
                  borderColor: `${book.coverSpec.accentColor || '#f59e0b'}90`,
                }}
              >
                {/* 3D Focal Hero Image Background */}
                {book.coverSpec.coverImageUrl && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      src={book.coverSpec.coverImageUrl}
                      alt="Cover Hero 3D"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/90" />
                  </div>
                )}

                <div className="relative z-10">
                  <span 
                    className="text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm"
                    style={{ 
                      backgroundColor: book.coverSpec.accentColor || '#f59e0b',
                      color: '#000000',
                    }}
                  >
                    {book.coverSpec.psychologyBadge || 'Amazon KDP Edition'}
                  </span>
                </div>

                <div className="my-auto relative z-10">
                  <h2 
                    className="text-base font-bold uppercase leading-snug drop-shadow-md"
                    style={{ color: book.coverSpec.secondaryColor || '#ffffff' }}
                  >
                    {book.coverSpec.frontTitle || book.metadata.title}
                  </h2>
                  <p className="text-[9px] text-white/90 mt-1 italic line-clamp-2 drop-shadow-xs">
                    {book.coverSpec.frontSubtitle || book.metadata.subtitle}
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="text-xs font-semibold text-white drop-shadow-xs">
                    {book.coverSpec.authorName || book.metadata.author}
                  </div>
                  <div className="text-[8px] text-white/80">8.5" × 11.0" • {pageCount} Pages</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
