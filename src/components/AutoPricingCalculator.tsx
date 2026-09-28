import React, { useState } from 'react';
import { KDPBook, KDPMetadata } from '../types';
import { calculateAutoPricing } from '../utils/kdpSpecs';
import { 
  DollarSign, 
  Globe, 
  Calculator, 
  TrendingUp, 
  CheckCircle, 
  Shield, 
  Info,
  Search,
  ExternalLink,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface AutoPricingCalculatorProps {
  book: KDPBook;
  onUpdateMetadata: (updated: Partial<KDPMetadata>) => void;
}

export const AutoPricingCalculator: React.FC<AutoPricingCalculatorProps> = ({
  book,
  onUpdateMetadata,
}) => {
  const pageCount = book.pages.length;
  const colorMode = book.interiorSpec.colorMode;
  const autoPricing = calculateAutoPricing(pageCount, colorMode);

  // Live Grounded Pricing State
  const [isSearchingMarket, setIsSearchingMarket] = useState(false);
  const [marketIntelligence, setMarketIntelligence] = useState<{
    content: string;
    sources: Array<{ title: string; url: string }>;
    searchQueries?: string[];
    suggestedPrice?: number;
    printCost?: number;
    royalty?: number;
  } | null>(null);
  const [appliedAlert, setAppliedAlert] = useState<string | null>(null);

  const handleApplyPricing = () => {
    onUpdateMetadata({
      listPriceUSD: autoPricing.retailUS,
      estimatedPrintCostUSD: autoPricing.printCostUSD,
      estimatedRoyaltyUSD: autoPricing.royaltyUS,
      internationalPricing: autoPricing,
    });
    setAppliedAlert(`Applied Formula Price $${autoPricing.retailUS.toFixed(2)} to listing!`);
    setTimeout(() => setAppliedAlert(null), 3500);
  };

  const handleFetchLiveMarketPricing = async () => {
    setIsSearchingMarket(true);
    setAppliedAlert(null);
    try {
      const res = await fetch('/api/kdp-pricing-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: book.bookType || book.metadata.categories?.[0] || 'kids coloring book',
          pageCount,
          colorMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMarketIntelligence(data);
      }
    } catch (e) {
      console.warn('Failed to fetch market pricing intelligence:', e);
    } finally {
      setIsSearchingMarket(false);
    }
  };

  const handleApplyGroundedPrice = (price: number) => {
    const printCost = autoPricing.printCostUSD;
    const royalty = +((price * 0.60) - printCost).toFixed(2);
    onUpdateMetadata({
      listPriceUSD: price,
      estimatedPrintCostUSD: printCost,
      estimatedRoyaltyUSD: Math.max(0, royalty),
    });
    setAppliedAlert(`Applied Live Grounded Price $${price.toFixed(2)} to listing metadata!`);
    setTimeout(() => setAppliedAlert(null), 3500);
  };

  return (
    <div className="space-y-6" id="kdp-auto-pricing-calculator">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-500/40 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Auto-Pricing Calculator</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  ⭐ Smart Addition 3
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Enforces the golden rule: <b>Print cost × 3 = retail price</b>, rounded to <b>.99</b>. Automatically suggests US, UK, Canada, and EU prices with standard 60% Amazon royalty projections.
              </p>
            </div>
          </div>

          <button
            onClick={handleApplyPricing}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg shadow-md transition-all shrink-0 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Formula to Listing
          </button>
        </div>

        {/* Formula Explainer Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span><b>Formula:</b> Print Cost (${autoPricing.printCostUSD}) × 3</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span><b>Rounding:</b> Auto-rounded to nearest $.99</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span><b>Distribution:</b> 60% Standard KDP Royalty</span>
          </div>
        </div>
      </div>

      {/* Multi-Currency Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* US Market */}
        <div className="bg-white border-2 border-blue-500/60 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
            PRIMARY
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3">
            <span className="text-xl">🇺🇸</span>
            <span>United States (USD)</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ${autoPricing.retailUS}
          </div>
          <div className="text-xs text-slate-500 mt-1">Amazon.com Marketplace</div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Print Cost:</span>
              <span className="font-semibold text-slate-800">${autoPricing.printCostUSD}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Royalty (60%):</span>
              <span className="font-bold text-emerald-600 text-sm">+${autoPricing.royaltyUS} / sale</span>
            </div>
          </div>
        </div>

        {/* UK Market */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3">
            <span className="text-xl">🇬🇧</span>
            <span>United Kingdom (GBP)</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            £{autoPricing.retailUK}
          </div>
          <div className="text-xs text-slate-500 mt-1">Amazon.co.uk Marketplace</div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Print Cost:</span>
              <span className="font-semibold text-slate-800">£{(autoPricing.printCostUSD * 0.80).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Royalty (60%):</span>
              <span className="font-bold text-emerald-600 text-sm">+£{autoPricing.royaltyUK} / sale</span>
            </div>
          </div>
        </div>

        {/* Canada Market */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3">
            <span className="text-xl">🇨🇦</span>
            <span>Canada (CAD)</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            C${autoPricing.retailCA}
          </div>
          <div className="text-xs text-slate-500 mt-1">Amazon.ca Marketplace</div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Print Cost:</span>
              <span className="font-semibold text-slate-800">C${(autoPricing.printCostUSD * 1.30).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Royalty (60%):</span>
              <span className="font-bold text-emerald-600 text-sm">+C${autoPricing.royaltyCA} / sale</span>
            </div>
          </div>
        </div>

        {/* EU Market */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3">
            <span className="text-xl">🇪🇺</span>
            <span>European Union (EUR)</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            €{autoPricing.retailEU}
          </div>
          <div className="text-xs text-slate-500 mt-1">Amazon.de, fr, it, es</div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Print Cost:</span>
              <span className="font-semibold text-slate-800">€{(autoPricing.printCostUSD * 0.92).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Royalty (60%):</span>
              <span className="font-bold text-emerald-600 text-sm">+€{autoPricing.royaltyEU} / sale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Consistency & Royalty Simulator */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Catalog Earnings Projection (Based on Auto-Pricing Rule)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">100 Copies Sold</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              ${(autoPricing.royaltyUS * 100).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Net profit deposited into your bank</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">500 Copies Sold</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              ${(autoPricing.royaltyUS * 500).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Consistent passive income</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">1,000 Copies Sold</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              ${(autoPricing.royaltyUS * 1000).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Niche bestseller milestone</div>
          </div>
        </div>
      </div>

      {/* Real-Time Amazon Marketplace Pricing Radar (Search Grounding) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                Live Amazon Market Pricing Radar
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Google Search Grounding
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify your pricing against current Amazon competitor listings, live bestseller price bands, and the latest print-on-demand cost updates for <b>{book.bookType || "this niche"}</b>.
            </p>
          </div>

          <button
            onClick={handleFetchLiveMarketPricing}
            disabled={isSearchingMarket}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            {isSearchingMarket ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Searching Live Market...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Search Live Amazon Prices
              </>
            )}
          </button>
        </div>

        {appliedAlert && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{appliedAlert}</span>
          </div>
        )}

        {marketIntelligence ? (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-2">
                {marketIntelligence.content.split('\n\n').map((block, idx) => (
                  <p key={idx} className="text-slate-700 whitespace-pre-line">
                    {block}
                  </p>
                ))}
              </div>

              {marketIntelligence.suggestedPrice && (
                <div className="mt-4 pt-3 border-t border-indigo-200/60 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs">
                    <span className="text-slate-600">Grounded Sweet Spot Price:</span>{' '}
                    <strong className="text-slate-900 text-sm">${marketIntelligence.suggestedPrice.toFixed(2)}</strong>
                    <span className="text-emerald-700 ml-2 font-semibold">
                      (+${(marketIntelligence.royalty || ((marketIntelligence.suggestedPrice * 0.6) - (marketIntelligence.printCost || 2.30))).toFixed(2)} royalty)
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyGroundedPrice(marketIntelligence.suggestedPrice!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Apply ${marketIntelligence.suggestedPrice.toFixed(2)} to Book
                  </button>
                </div>
              )}
            </div>

            {/* Citations */}
            {marketIntelligence.sources && marketIntelligence.sources.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-500" />
                  Verified Web Sources:
                </div>
                <div className="flex flex-wrap gap-2">
                  {marketIntelligence.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-600">
              Click <b>"Search Live Amazon Prices"</b> to benchmark against real-time competitor prices, current print-on-demand fee schedules, and recommended 60% royalty targets.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
