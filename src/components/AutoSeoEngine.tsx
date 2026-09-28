import React, { useState } from 'react';
import { KDPBook, KDPMetadata } from '../types';
import { analyzeSeoPackage } from '../utils/kdpSpecs';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  Tag,
  BookOpen
} from 'lucide-react';

interface AutoSeoEngineProps {
  book: KDPBook;
  onUpdateMetadata: (updated: Partial<KDPMetadata>) => void;
}

export const AutoSeoEngine: React.FC<AutoSeoEngineProps> = ({ book, onUpdateMetadata }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const seoAnalysis = analyzeSeoPackage(book.metadata);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleKeywordChange = (index: number, val: string) => {
    const updated = [...book.metadata.keywords];
    updated[index] = val;
    onUpdateMetadata({ keywords: updated });
  };

  const handleCategoryChange = (index: 0 | 1, val: string) => {
    const updated: [string, string] = [book.metadata.categories[0] || '', book.metadata.categories[1] || ''];
    updated[index] = val;
    onUpdateMetadata({ categories: updated });
  };

  return (
    <div className="space-y-6" id="kdp-auto-seo-engine">
      {/* Top Banner: SEO Health Score */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/40 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-emerald-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Auto-SEO Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Traffic Magnet Active
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Optimized Amazon search metadata designed to capture high-intent buyer traffic, maximize click-through rate (CTR), and convert browsing shoppers into buyers.
              </p>
            </div>
          </div>

          {/* SEO Score Meter */}
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-700/60 rounded-xl p-4 min-w-[220px]">
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-16 h-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="176"
                  strokeDashoffset={176 - (176 * seoAnalysis.score) / 100}
                  strokeLinecap="round"
                  className="text-emerald-400 transition-all duration-700"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-lg font-bold text-white">{seoAnalysis.score}%</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Amazon SEO Score</div>
              <div className="text-sm font-bold text-emerald-400">
                {seoAnalysis.score >= 90 ? 'Top 1% Optimized' : 'Good Optimization'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{seoAnalysis.wordCount} words / 7 keywords</div>
            </div>
          </div>
        </div>

        {/* Actionable recommendations */}
        {seoAnalysis.recommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-3">
            {seoAnalysis.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: SEO Title & Subtitle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title & SEO Title */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Amazon SEO Title</span>
            </div>
            <button
              onClick={() => handleCopy(book.metadata.seoTitle || book.metadata.title, 'title')}
              className="text-xs flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <input
            type="text"
            value={book.metadata.seoTitle || book.metadata.title}
            onChange={(e) => onUpdateMetadata({ seoTitle: e.target.value, title: e.target.value })}
            className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Keyword-rich, high-CTR book title"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Must match cover title exactly. Avoid prohibited terms (e.g. "bestseller").</span>
            <span className={`font-medium ${(book.metadata.seoTitle || book.metadata.title).length > 100 ? 'text-amber-600' : 'text-slate-400'}`}>
              {(book.metadata.seoTitle || book.metadata.title).length} / 200 chars
            </span>
          </div>
        </div>

        {/* Subtitle & SEO Subtitle */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Amazon SEO Subtitle (Benefit & Niche Hook)</span>
            </div>
            <button
              onClick={() => handleCopy(book.metadata.seoSubtitle || book.metadata.subtitle, 'subtitle')}
              className="text-xs flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              {copiedKey === 'subtitle' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'subtitle' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <input
            type="text"
            value={book.metadata.seoSubtitle || book.metadata.subtitle}
            onChange={(e) => onUpdateMetadata({ seoSubtitle: e.target.value, subtitle: e.target.value })}
            className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Benefit-driven descriptive subtitle"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Communicates immediate value and features to searchers.</span>
            <span className="text-slate-400 font-medium">
              {(book.metadata.seoSubtitle || book.metadata.subtitle).length} chars
            </span>
          </div>
        </div>
      </div>

      {/* 300-Word Description Block */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">300-Word Persuasive Description (Amazon HTML)</h3>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
              seoAnalysis.wordCount >= 250 && seoAnalysis.wordCount <= 350
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {seoAnalysis.wordCount} words (Target: ~300)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(book.metadata.descriptionHtml, 'desc')}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              {copiedKey === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'desc' ? 'Copied HTML' : 'Copy Description'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Formatted with Amazon approved HTML tags (&lt;b&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;p&gt;). Safe for direct copy-paste into KDP.
        </p>

        <textarea
          rows={7}
          value={book.metadata.descriptionHtml}
          onChange={(e) => onUpdateMetadata({ descriptionHtml: e.target.value })}
          className="w-full font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-3 leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* HTML Live Preview Box */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Live Amazon Listing Preview</div>
          <div 
            className="prose prose-sm max-w-none text-slate-800 text-sm"
            dangerouslySetInnerHTML={{ __html: book.metadata.descriptionHtml }}
          />
        </div>
      </div>

      {/* 7 Backend Keywords */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">7 Backend Search Keywords</h3>
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-indigo-50 text-indigo-700">
              Exactly 7 Slots
            </span>
          </div>
          <button
            onClick={() => handleCopy(book.metadata.keywords.join(', '), 'keywords')}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            {copiedKey === 'keywords' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'keywords' ? 'Copied All' : 'Copy All 7'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Max 50 characters per slot. Do NOT repeat words from your title or subtitle (Amazon already indexes them).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {book.metadata.keywords.map((kw, idx) => {
            const isOver50 = kw.length > 50;
            return (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={kw}
                  onChange={(e) => handleKeywordChange(idx, e.target.value)}
                  className="w-full text-xs font-medium text-slate-900 bg-transparent outline-none"
                  placeholder={`Search Keyword phrase #${idx + 1}`}
                />
                <span className={`text-[10px] font-mono shrink-0 ${isOver50 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                  {kw.length}/50
                </span>
                <button
                  onClick={() => handleCopy(kw, `kw-${idx}`)}
                  className="text-slate-400 hover:text-slate-700 shrink-0"
                >
                  {copiedKey === `kw-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 BISAC Categories */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">2 Official BISAC / Amazon Categories</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category #1 (Primary)</div>
            <input
              type="text"
              value={book.metadata.categories[0] || ''}
              onChange={(e) => handleCategoryChange(0, e.target.value)}
              className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded p-2 outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category #2 (Secondary)</div>
            <input
              type="text"
              value={book.metadata.categories[1] || ''}
              onChange={(e) => handleCategoryChange(1, e.target.value)}
              className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded p-2 outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
