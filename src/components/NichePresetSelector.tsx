import React from 'react';
import { KDPBook } from '../types';
import { 
  createColoringBookPreset, 
  createSurvivalGuidePreset, 
  createYearlyPlannerPreset,
  createCookbookPreset,
  createAssortedBookPreset,
} from '../data/presets';
import { BookOpen, Sparkles, Check, ArrowRight, Shield, Layers, DollarSign } from 'lucide-react';

interface NichePresetSelectorProps {
  currentBook: KDPBook;
  onSelectPreset: (book: KDPBook) => void;
}

export const NichePresetSelector: React.FC<NichePresetSelectorProps> = ({
  currentBook,
  onSelectPreset,
}) => {
  const presets = [
    {
      id: 'preset-coloring',
      title: 'Coloring Book',
      headline: '100-Page Magical Animal Kingdom',
      badge: 'Bleed ON',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: '🎨',
      pages: 100,
      bleed: true,
      price: '$9.99',
      royalty: '$3.74',
      target: 'Ages 4-8, Toddlers & Preschoolers',
      description: 'Single-sided vector line art illustrations with bleed protection and clean margins preventing bleed-through.',
      factory: createColoringBookPreset,
    },
    {
      id: 'preset-survival',
      title: 'Survival Manual',
      headline: '25 Tactics to Stay Alive Stranded in Car',
      badge: 'Bleed OFF',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: '🚗',
      pages: 32,
      bleed: false,
      price: '$7.99',
      royalty: '$2.64',
      target: 'Commuters, Winter Drivers & Outdoor Enthusiasts',
      description: 'Field-tested automotive breakdown tactics, hypothermia prevention, emergency signaling, and survival checklists.',
      factory: createSurvivalGuidePreset,
    },
    {
      id: 'preset-planner',
      title: 'Master Planner',
      headline: 'The Ultimate 52-Week Executive Planner',
      badge: 'Bleed OFF',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: '📅',
      pages: 60,
      bleed: false,
      price: '$8.99',
      royalty: '$3.17',
      target: 'Entrepreneurs, Executives & High Performers',
      description: 'Quarterly OKRs, Eisenhower priority quadrants, weekly spreads, dot-grid note matrices, and habit streaks.',
      factory: createYearlyPlannerPreset,
    },
    {
      id: 'preset-cookbook',
      title: 'Gourmet Cookbook',
      headline: 'The Weeknight Gourmet (40 Spreads)',
      badge: 'Bleed OFF',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: '🍳',
      pages: 40,
      bleed: false,
      price: '$7.99',
      royalty: '$2.54',
      target: 'Home Cooks, Busy Families & Foodies',
      description: '30-minute elevated meals, prep & cook time badges, structured ingredient bullet lists, and pro culinary secrets.',
      factory: createCookbookPreset,
    },
    {
      id: 'preset-assorted',
      title: 'Non-Fiction Masterclass',
      headline: 'The Asymmetric Mind: Mental Models',
      badge: 'Bleed OFF',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: '📚',
      pages: 48,
      bleed: false,
      price: '$7.99',
      royalty: '$2.44',
      target: 'Founders, Investors & Strategy Practitioners',
      description: 'Mental model deconstructions, first-principles decision frameworks, case study sidebars, and cognitive logs.',
      factory: createAssortedBookPreset,
    },
  ];

  return (
    <div className="space-y-6" id="kdp-niche-preset-selector">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">5 High-Converting Niche Presets</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                ⭐ Smart Addition 5
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Instant 1-click loading for Amazon's most profitable low-content & medium-content publishing categories. Fully formatted with exact page counts, margins, bleed, and 300-word SEO metadata.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {presets.map((preset) => {
          const isCurrentActive = currentBook.id === preset.id || currentBook.metadata.title.includes(preset.title);

          return (
            <div
              key={preset.id}
              className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                isCurrentActive ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{preset.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{preset.title}</div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{preset.headline}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {preset.description}
                </p>

                {/* Specs Pill Matrix */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div className="bg-slate-50 p-1.5 rounded text-center">
                    <span className="block text-slate-400 text-[10px]">Pages</span>
                    <span className="font-bold text-slate-800">{preset.pages}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded text-center">
                    <span className="block text-slate-400 text-[10px]">Retail</span>
                    <span className="font-bold text-slate-800">{preset.price}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded text-center">
                    <span className="block text-slate-400 text-[10px]">Royalty</span>
                    <span className="font-bold text-emerald-600">{preset.royalty}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => onSelectPreset(preset.factory())}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isCurrentActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                  }`}
                >
                  {isCurrentActive ? (
                    <>
                      <Check className="w-4 h-4" />
                      Currently Loaded
                    </>
                  ) : (
                    <>
                      <span>Load This Preset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
