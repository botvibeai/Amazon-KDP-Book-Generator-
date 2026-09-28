import React, { useState } from 'react';
import { KDPBook, KDPMetadata, KDPCoverSpec } from '../types';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  DollarSign, 
  Palette, 
  RefreshCw, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  TrendingUp,
  Tag,
  ArrowRight,
  Info,
  Clock,
  Radio
} from 'lucide-react';

interface KdpIntelligenceRadarProps {
  book: KDPBook;
  onUpdateMetadata: (updated: Partial<KDPMetadata>) => void;
  onUpdateCover: (updated: Partial<KDPCoverSpec>) => void;
  onNavigateTab?: (tab: string) => void;
}

interface SearchResult {
  query: string;
  category: string;
  content: string;
  sources: Array<{ title: string; url: string }>;
  searchQueries?: string[];
  grounded: boolean;
  model: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  {
    label: '🚨 2025/2026 AI Content & Title Rules',
    query: 'Latest Amazon KDP 2025 2026 AI content disclosure policies and title subtitle keyword stuffing regulations',
    category: 'regulations',
    icon: ShieldAlert,
    badge: 'Compliance',
  },
  {
    label: '💰 Current Printing Costs & Minimum Prices',
    query: 'Amazon KDP official printing costs calculation formula and minimum list price rules 2025 2026 for 8.5x11 paperbacks',
    category: 'pricing',
    icon: DollarSign,
    badge: 'Royalties',
  },
  {
    label: '🎨 Bestseller Cover Design & Contrast Trends',
    query: 'Amazon KDP bestselling book cover design trends typography color palettes and thumbnail readability rules',
    category: 'design',
    icon: Palette,
    badge: 'Design',
  },
  {
    label: '📐 Spine Width & Barcode Safe Zone Rules',
    query: 'Amazon KDP cover spine calculation formula page threshold for spine text and back cover barcode safe zone 2x1.2',
    category: 'regulations',
    icon: Layers,
    badge: 'Geometry',
  },
  {
    label: '🎯 Optimal Pricing for My Genre',
    query: 'Amazon KDP paperback pricing sweet spot and competitor prices for 8.5x11 kids coloring book or guide',
    category: 'pricing',
    icon: TrendingUp,
    badge: 'Market',
  },
  {
    label: '🏷️ Low-Content vs Standard Book Rules',
    query: 'Amazon KDP low content book policy free ISBN rules and categories updates 2025 2026',
    category: 'regulations',
    icon: Tag,
    badge: 'Category',
  },
];

export const KdpIntelligenceRadar: React.FC<KdpIntelligenceRadarProps> = ({
  book,
  onUpdateMetadata,
  onUpdateCover,
  onNavigateTab,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'regulations' | 'pricing' | 'design'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [appliedPriceNotice, setAppliedPriceNotice] = useState<string | null>(null);
  const [appliedColorNotice, setAppliedColorNotice] = useState<string | null>(null);

  const executeSearch = async (queryText: string, category: string = 'general') => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setAppliedPriceNotice(null);
    setAppliedColorNotice(null);

    try {
      const res = await fetch('/api/kdp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          category,
          bookContext: {
            title: book.metadata.title || book.coverSpec.frontTitle,
            bookType: book.bookType,
            pages: book.pages.length,
            listPrice: book.metadata.listPriceUSD,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to search KDP regulations.');
      }
    } catch (e: any) {
      console.warn('Search grounding error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      executeSearch(searchInput, selectedCategory === 'all' ? 'regulations' : selectedCategory);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_QUERIES[0]) => {
    let customQ = preset.query;
    if (preset.category === 'pricing' && book.metadata.title) {
      customQ = `Amazon KDP paperback pricing and competitor price range for 8.5x11 "${book.bookType}" ${book.pages.length} pages 2025 2026`;
    }
    setSearchInput(customQ);
    executeSearch(customQ, preset.category);
  };

  // Helper to extract suggested price from markdown or text
  const extractPriceRecommendation = (text: string): number | null => {
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : null;
  };

  const detectedPrice = searchResult ? extractPriceRecommendation(searchResult.content) : null;

  const handleApplyDetectedPrice = (price: number) => {
    const printCost = book.metadata.estimatedPrintCostUSD || 2.30;
    const royalty = +((price * 0.60) - printCost).toFixed(2);
    onUpdateMetadata({
      listPriceUSD: price,
      estimatedRoyaltyUSD: Math.max(0, royalty),
    });
    setAppliedPriceNotice(`Applied $${price.toFixed(2)} to book metadata list price!`);
    setTimeout(() => setAppliedPriceNotice(null), 4000);
  };

  const handleApplyHighImpactPalette = () => {
    onUpdateCover({
      backgroundColor: '#0F172A',
      titleColor: '#F59E0B',
      subtitleColor: '#FFFFFF',
    });
    setAppliedColorNotice('Applied Bestseller High-Contrast Palette: Obsidian Dark (#0F172A) + Electric Gold (#F59E0B)!');
    setTimeout(() => setAppliedColorNotice(null), 4000);
  };

  return (
    <div className="space-y-6" id="kdp-intelligence-radar">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 border border-indigo-400/40 rounded-xl text-indigo-300 shrink-0">
              <Radio className="w-8 h-8 animate-pulse text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight text-white">
                  KDP Live Regulations & Market Radar
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  Google Search Grounded
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Stay up to the minute with the freshest Amazon KDP regulations, policy updates (AI disclosures, margin tolerances, barcode rules), optimal pricing benchmarks, and bestseller design aesthetics verified against real-time web data.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-3 text-xs shrink-0 flex flex-col justify-center">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Live KDP Radar Status
            </div>
            <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
              Real-Time Search Active
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">Grounding: KDP Official & Web Sources</div>
          </div>
        </div>

        {/* Live Search Input Form */}
        <form onSubmit={handleCustomSubmit} className="mt-5 relative z-10">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ask any Amazon KDP question (e.g., 'What are the 2026 AI disclosure rules?', 'Best price for 100p coloring book', 'Cover contrast rules')..."
                className="w-full pl-11 pr-4 py-3 bg-slate-800/90 border border-indigo-400/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Searching Web...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search KDP Radar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preset Fast-Query Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Instant Intelligence Queries
          </h3>
          <span className="text-xs text-slate-400">Click any topic to run live Google Search</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_QUERIES.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="flex items-center justify-between p-3 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-slate-400 group-hover:text-slate-600 truncate">
                      Category: {preset.category}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-indigo-200 text-slate-600 group-hover:text-indigo-800 shrink-0 ml-2">
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Action Notifications */}
      {appliedPriceNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{appliedPriceNotice}</span>
          </div>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('pricing')}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            View in Pricing Calculator →
          </button>
        </div>
      )}

      {appliedColorNotice && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-bold">{appliedColorNotice}</span>
          </div>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('coverStudio')}
            className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
          >
            View in Cover Studio →
          </button>
        </div>
      )}

      {/* Search Results Display Area */}
      {searchResult ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Result Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                  {searchResult.category}
                </span>
                <span className="text-xs text-slate-500">
                  Queried: <strong className="text-slate-800">"{searchResult.query}"</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span>Model: {searchResult.model}</span>
                <span>•</span>
                <span>Grounded with Google Search: {searchResult.grounded ? 'Yes (Live)' : 'Knowledge Base'}</span>
                <span>•</span>
                <span>{new Date(searchResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Quick Action Buttons for the User */}
            <div className="flex items-center gap-2 flex-wrap">
              {detectedPrice && (
                <button
                  onClick={() => handleApplyDetectedPrice(detectedPrice)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Apply ${detectedPrice.toFixed(2)} to Book
                </button>
              )}

              <button
                onClick={handleApplyHighImpactPalette}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Apply Bestseller Palette
              </button>
            </div>
          </div>

          {/* Formatted Content Body */}
          <div className="p-6">
            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
              {searchResult.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h4 key={pIdx} className="text-sm font-bold text-indigo-950 mt-3">
                      {paragraph.replace('#### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-slate-700">
                      {items.map((it, iIdx) => (
                        <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it.replace(/^[*-]\s*/, '')) }} />
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={pIdx} className="text-slate-700" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(paragraph) }} />
                );
              })}
            </div>

            {/* Google Search Queries Executed */}
            {searchResult.searchQueries && searchResult.searchQueries.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  Search Queries Executed by Grounding Engine:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {searchResult.searchQueries.map((q, qIdx) => (
                    <span key={qIdx} className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      "{q}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grounding Web Citations & Sources */}
            {searchResult.sources && searchResult.sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Verified Web Citations & Direct Sources:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {searchResult.sources.map((src, sIdx) => {
                    const hostname = getHostname(src.url);
                    return (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                            {src.title}
                          </div>
                          <div className="text-[10px] text-slate-400 group-hover:text-slate-500 font-mono truncate">
                            {hostname}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State Showcase */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
            <Radio className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Ready to Inspect Live Amazon KDP Regulations & Trends
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Click any instant intelligence query above or type your own question to retrieve fresh guidelines, competitor price bands, and cover design trends grounded in real-time Google Search data.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => handleApplyPreset(PRESET_QUERIES[0])}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Check 2025/2026 AI & Title Rules Now
            </button>
            <button
              onClick={() => handleApplyPreset(PRESET_QUERIES[1])}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Check Current Printing Costs
            </button>
          </div>
        </div>
      )}

      {/* 3 Pillars of KDP Success Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Regulations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            1. Compliance Guardrails
          </div>
          <div className="text-sm font-bold text-slate-900">Zero-Rejection Submission</div>
          <ul className="text-xs text-slate-600 mt-2 space-y-1.5">
            <li>• Disclose AI-generated content in metadata</li>
            <li>• Spine text permitted only on 79+ page books</li>
            <li>• 0.375" minimum safe margin inside trim</li>
            <li>• 2" × 1.2" barcode clear zone on back cover</li>
          </ul>
        </div>

        {/* Pillar 2: Pricing */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            2. Strategic Pricing
          </div>
          <div className="text-sm font-bold text-slate-900">Print Cost × 3 Rule</div>
          <ul className="text-xs text-slate-600 mt-2 space-y-1.5">
            <li>• Standard B&W 24-108 pages: $2.30 print cost</li>
            <li>• Recommended retail: $7.99 to $9.99 for coloring</li>
            <li>• Yields 40-45% net profit margin per sale</li>
            <li>• Ends in .99 for optimal psychological pricing</li>
          </ul>
        </div>

        {/* Pillar 3: Design */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Palette className="w-4 h-4" />
            3. Aesthetic Psychology
          </div>
          <div className="text-sm font-bold text-slate-900">3-Second Mobile Thumbnail</div>
          <ul className="text-xs text-slate-600 mt-2 space-y-1.5">
            <li>• Title takes 25-35% of front cover height</li>
            <li>• High-contrast ratios (4.5:1+) for dark themes</li>
            <li>• Authority ribbon badges for credibility</li>
            <li>• 300 DPI high-resolution CMYK/RGB vectors</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Simple helper to format inline markdown bold & code
function formatInlineMarkdown(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
}

// Simple helper to safely extract hostname
function getHostname(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname;
  } catch {
    return 'kdp.amazon.com';
  }
}
