import React, { useState } from 'react';
import { Copy, Check, Tag, DollarSign, BookText, Globe, Key, FileText, CheckCircle2 } from 'lucide-react';
import { KDPBook } from '../types';

interface MetadataPackageProps {
  book: KDPBook;
}

export const MetadataPackage: React.FC<MetadataPackageProps> = ({ book }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center">
            <BookText className="w-4 h-4 mr-1.5 text-amber-600" />
            Amazon KDP Direct Upload Metadata Package
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimized for Amazon SEO algorithms. Click any field to copy directly into your KDP portal tabs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const allText = `TITLE: ${book.metadata.title}\nSUBTITLE: ${book.metadata.subtitle}\nAUTHOR: ${book.metadata.author}\nDESCRIPTION:\n${book.metadata.descriptionHtml}\nKEYWORDS:\n${book.metadata.keywords.join(', ')}\nCATEGORIES:\n${book.metadata.categories.join('\n')}\nPRICE: $${book.metadata.listPriceUSD}`;
            copyToClipboard(allText, 'all_meta');
          }}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 cursor-pointer transition-colors"
        >
          {copiedKey === 'all_meta' ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Copied All Fields!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy Full Metadata
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        
        {/* Title, Subtitle, Author Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Title */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Book Title (Tab 1)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(book.metadata.title, 'title')}
                  className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center cursor-pointer"
                >
                  {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-sm font-bold text-slate-900">{book.metadata.title}</div>
            </div>
          </div>

          {/* Subtitle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Subtitle</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(book.metadata.subtitle, 'subtitle')}
                  className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center cursor-pointer"
                >
                  {copiedKey === 'subtitle' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-xs font-medium text-slate-700">{book.metadata.subtitle}</div>
            </div>
          </div>

          {/* Author */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Primary Author / Pen Name</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(book.metadata.author, 'author')}
                  className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center cursor-pointer"
                >
                  {copiedKey === 'author' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-sm font-bold text-slate-900">{book.metadata.author}</div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>2 KDP BISAC Categories</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(book.metadata.categories.join(', '), 'categories')}
                  className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center cursor-pointer"
                >
                  {copiedKey === 'categories' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="space-y-1 text-xs text-slate-800">
                <div>1. {book.metadata.categories[0]}</div>
                <div>2. {book.metadata.categories[1]}</div>
              </div>
            </div>
          </div>

        </div>

        {/* 7 Backend Keywords */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                7 Backend Search Keywords (Amazon Tab 1)
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(book.metadata.keywords.join(', '), 'all_keywords')}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold inline-flex items-center cursor-pointer"
            >
              {copiedKey === 'all_keywords' ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy All 7
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {book.metadata.keywords.map((kw, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => copyToClipboard(kw, `kw_${idx}`)}
                className="group inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium hover:border-amber-400 hover:bg-amber-50/50 transition-colors cursor-pointer"
                title="Click to copy keyword"
              >
                <span className="text-slate-400 font-mono text-[10px] mr-1.5">#{idx + 1}</span>
                <span>{kw}</span>
                <span className="ml-1.5 text-slate-300 group-hover:text-amber-600">
                  {copiedKey === `kw_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </span>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Keyword terms exclude words already in title, targeting real Amazon shopper intent up to 50 characters each.
          </div>
        </div>

        {/* Amazon HTML Description */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Amazon KDP HTML Book Description
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(book.metadata.descriptionHtml, 'desc')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 inline-flex items-center cursor-pointer"
            >
              {copiedKey === 'desc' ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Copied HTML
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy HTML for KDP
                </>
              )}
            </button>
          </div>

          <div
            className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto space-y-2 font-sans"
            dangerouslySetInnerHTML={{ __html: book.metadata.descriptionHtml }}
          />
          <div className="text-[11px] text-slate-500 mt-2">
            Amazon allows &lt;b&gt;, &lt;i&gt;, &lt;h3&gt;, &lt;ul&gt;, and &lt;li&gt; formatting tags for high customer conversion.
          </div>
        </div>

        {/* Pricing & Royalty Breakdown */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-1.5 mb-3">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Amazon KDP Pricing & Royalty Calculation (US Marketplace)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[11px]">Suggested Retail Price</div>
              <div className="text-base font-bold text-slate-900">${book.metadata.listPriceUSD}</div>
              <div className="text-[10px] text-slate-400">Competitive Amazon sweetspot</div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[11px]">KDP Print Cost</div>
              <div className="text-base font-bold text-slate-700 font-mono">${book.metadata.estimatedPrintCostUSD}</div>
              <div className="text-[10px] text-slate-400">Fixed + ${0.012}/page standard</div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[11px]">KDP Royalty Rate</div>
              <div className="text-base font-bold text-slate-700 font-mono">60%</div>
              <div className="text-[10px] text-slate-400">Standard paperback distribution</div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="text-emerald-800 font-semibold text-[11px]">Net Profit / Royalty</div>
              <div className="text-base font-extrabold text-emerald-700 font-mono">
                +${book.metadata.estimatedRoyaltyUSD}
              </div>
              <div className="text-[10px] text-emerald-600">Per book sold on Amazon</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
