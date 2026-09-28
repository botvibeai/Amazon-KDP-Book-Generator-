import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Palette, 
  ShieldAlert, 
  Calendar, 
  UtensilsCrossed, 
  BookMarked, 
  Settings2, 
  Loader2, 
  ArrowRight, 
  SlidersHorizontal,
  Cpu,
  Zap,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { BookType, FeaturedAIModel, AIProviderInfo } from '../types';

interface PromptDashboardProps {
  onGenerate: (prompt: string, pageCount: number, typeHint: BookType, bleed: boolean, selectedModel?: string) => Promise<void>;
  onSelectPreset: (presetType: 'coloring' | 'survival' | 'planner' | 'cookbook' | 'assorted') => void;
  isLoading: boolean;
  activePresetId?: string;
  lastGeneratedMeta?: { providerUsed?: string; modelUsed?: string; durationMs?: number };
}

export const PromptDashboard: React.FC<PromptDashboardProps> = ({
  onGenerate,
  onSelectPreset,
  isLoading,
  activePresetId,
  lastGeneratedMeta,
}) => {
  const [prompt, setPrompt] = useState('100 page coloring book for 4 to 7 year olds');
  const [pageCount, setPageCount] = useState(100);
  const [bookType, setBookType] = useState<BookType>('coloring');
  const [bleed, setBleed] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  
  // AI Multi-Model States
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [providers, setProviders] = useState<AIProviderInfo[]>([]);
  const [featuredModels, setFeaturedModels] = useState<FeaturedAIModel[]>([]);
  const [totalModelsCount, setTotalModelsCount] = useState<number>(1508);

  useEffect(() => {
    fetch('/api/providers')
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) {
          setProviders(data.providers);
          const total = data.providers.reduce((sum: number, p: any) => sum + (p.modelCount || 0), 0);
          if (total > 0) setTotalModelsCount(total);
        }
        if (data.featuredModels) {
          setFeaturedModels(data.featuredModels);
        }
      })
      .catch((err) => console.warn('Could not fetch providers catalog:', err));
  }, []);

  const handlePresetClick = (type: 'coloring' | 'survival' | 'planner' | 'cookbook' | 'assorted') => {
    if (type === 'coloring') {
      setPrompt('100 page coloring book for 4 to 7 year olds');
      setPageCount(100);
      setBookType('coloring');
      setBleed(true);
    } else if (type === 'survival') {
      setPrompt('A survival book of 25 tactics to stay alive Stranded in my car');
      setPageCount(32);
      setBookType('survival_guide');
      setBleed(false);
    } else if (type === 'planner') {
      setPrompt('Give me a yearly planner with 52-week goal setting, monthly overviews and habit trackers');
      setPageCount(60);
      setBookType('planner');
      setBleed(false);
    } else if (type === 'cookbook') {
      setPrompt('A 40-recipe weeknight gourmet cookbook with 30-minute meals, chef secrets, and timing badges');
      setPageCount(40);
      setBookType('cookbook');
      setBleed(false);
    } else if (type === 'assorted') {
      setPrompt('A 48-page mental models and first principles masterclass for high-output thinkers');
      setPageCount(48);
      setBookType('nonfiction');
      setBleed(false);
    }
    onSelectPreset(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    const activeModelName = featuredModels.find(m => m.id === selectedModel)?.name || 'Multi-Provider Cascade';
    setGenerationStep(`Routing through ${activeModelName}...`);
    setTimeout(() => setGenerationStep('Architecting 8.5×11 interior layouts & illustrations...'), 1200);
    setTimeout(() => setGenerationStep('Calculating 0.002252 KDP spine width & wrap cover...'), 2600);
    setTimeout(() => setGenerationStep('Formulating 7 backend keywords & 300-word HTML description...'), 4000);

    try {
      await onGenerate(prompt, pageCount, bookType, bleed, selectedModel);
    } finally {
      setGenerationStep('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-6" id="kdp-prompt-dashboard">
      
      {/* Top Banner / 5 Presets Quick-Picker */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-600" />
              5 High-Converting Amazon KDP Archetypes (⭐ Smart Addition 5)
            </h2>
            <p className="text-xs text-slate-500">
              Click any archetype to load full interior spreads, 300-word SEO description, and print-cost pricing:
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Standard: <span className="text-slate-800 font-semibold">8.5" × 11.0"</span>
          </div>
        </div>

        {/* 5 Archetype Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => handlePresetClick('coloring')}
            className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePresetId === 'kdp-preset-coloring-100'
                ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 mr-2 shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Coloring Book</div>
              <div className="text-[10px] text-slate-500">100 pgs • Bleed ON</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('survival')}
            className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePresetId === 'kdp-preset-survival-25'
                ? 'bg-red-50/80 border-red-300 ring-1 ring-red-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-red-300 hover:bg-slate-50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-red-100 text-red-800 mr-2 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Car Survival</div>
              <div className="text-[10px] text-slate-500">32 pgs • 25 Tactics</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('planner')}
            className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePresetId === 'kdp-preset-planner-60'
                ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800 mr-2 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Yearly Planner</div>
              <div className="text-[10px] text-slate-500">60 pgs • 52-Week</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('cookbook')}
            className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePresetId === 'kdp-preset-cookbook-40'
                ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-slate-50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800 mr-2 shrink-0">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Cookbook</div>
              <div className="text-[10px] text-slate-500">40 pgs • Chef Spreads</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('assorted')}
            className={`flex items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePresetId === 'kdp-preset-assorted-48'
                ? 'bg-purple-50/80 border-purple-300 ring-1 ring-purple-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800 mr-2 shrink-0">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Non-Fiction</div>
              <div className="text-[10px] text-slate-500">48 pgs • Masterclass</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Prompt Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="space-y-4">
          
          {/* AI Providers Live Connection Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900 text-white rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wide flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Multi-Model Engine Active
              </span>
              <span className="text-slate-400 hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-300">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  ⚡ <strong>CometAPI</strong> (566 models)
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  🚀 <strong>AI/ML API</strong> (938 models)
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  🔮 <strong>Gemini 3.8</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="ai-model-selector" className="text-slate-300 text-[11px] font-medium hidden sm:inline">
                Selected AI:
              </label>
              <div className="relative">
                <select
                  id="ai-model-selector"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border border-slate-700 hover:border-amber-400 text-white text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-amber-400 appearance-none"
                >
                  <option value="auto">⚡ Auto (Multi-Provider Cascade) - 100% Uptime</option>
                  <optgroup label="CometAPI (566+ Models)">
                    <option value="comet:gpt-4o-mini">GPT-4o Mini (CometAPI - Fast & Precise)</option>
                    <option value="comet:gpt-4o">GPT-4o Flagship (CometAPI - Deep Outline)</option>
                    <option value="comet:claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (CometAPI - Literary Nonfiction)</option>
                    <option value="comet:deepseek-chat">DeepSeek V3 (CometAPI - Tactical & Structured)</option>
                    <option value="comet:llama-3.3-70b-instruct">Llama 3.3 70B (CometAPI)</option>
                  </optgroup>
                  <optgroup label="AI/ML API (938+ Models)">
                    <option value="aiml:gpt-4o-mini">GPT-4o Mini (AI/ML API - High Speed)</option>
                    <option value="aiml:meta-llama/Llama-3.3-70B-Instruct-Turbo">Llama 3.3 70B Turbo (AI/ML API)</option>
                  </optgroup>
                  <optgroup label="Google Native">
                    <option value="gemini:gemini-3.8-flash">Gemini 3.8 Flash (Google DeepMind)</option>
                  </optgroup>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="kdp-prompt-input" className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Book Prompt / Custom Blueprint
              </label>
              <span className="text-[11px] text-slate-500">
                Enter 1 sentence or paste a several-page outline
              </span>
            </div>
            <textarea
              id="kdp-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A 100 page coloring book for 4 to 7 year olds with safari animals, space rockets and dinosaurs, or a survival guide of 25 car survival tactics..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-y"
              disabled={isLoading}
            />
          </div>

          {/* Quick options bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Target Pages:</span>
                <input
                  type="number"
                  min={24}
                  max={828}
                  value={pageCount}
                  onChange={(e) => setPageCount(Math.max(24, Math.min(828, parseInt(e.target.value) || 24)))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-xs font-semibold text-center text-slate-800 focus:ring-1 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <span className="text-[10px] text-slate-400">(min 24)</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Bleed:</span>
                <button
                  type="button"
                  onClick={() => setBleed(!bleed)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    bleed ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                  disabled={isLoading}
                >
                  {bleed ? 'Bleed ON (+0.125")' : 'Bleed OFF'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-slate-500 hover:text-slate-700 font-medium inline-flex items-center cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                {showAdvanced ? 'Hide Specs' : 'KDP Specs'}
              </button>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.99] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating KDP Package...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate KDP Book
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </div>

          {/* Last Generation Meta Badge */}
          {lastGeneratedMeta?.providerUsed && !isLoading && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Engineered with <strong>{lastGeneratedMeta.modelUsed}</strong> via{' '}
                <strong>{lastGeneratedMeta.providerUsed}</strong>
                {lastGeneratedMeta.durationMs ? ` (${(lastGeneratedMeta.durationMs / 1000).toFixed(1)}s)` : ''}
              </span>
            </div>
          )}

          {/* Advanced KDP Specs Drawer */}
          {showAdvanced && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center">
                <Settings2 className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                Enforced Amazon KDP Engineering Parameters:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-slate-400">Trim Size</div>
                  <div className="font-bold text-slate-800">8.5" × 11.0"</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-slate-400">Outer Margins</div>
                  <div className="font-bold text-slate-800">≥ 0.25" (18 pt)</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-slate-400">Inside Gutter</div>
                  <div className="font-bold text-slate-800">≥ 0.375" (Alternating)</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-slate-400">Spine Formula</div>
                  <div className="font-bold text-slate-800">0.002252 × Pages</div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Progress Bar when Loading */}
          {isLoading && (
            <div className="mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center text-xs text-indigo-900 animate-pulse">
              <Loader2 className="w-4 h-4 mr-2.5 text-indigo-700 animate-spin shrink-0" />
              <span>{generationStep || 'Consulting Amazon KDP specification engine...'}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
