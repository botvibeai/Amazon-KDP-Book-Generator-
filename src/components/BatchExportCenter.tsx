import React, { useState } from 'react';
import { KDPBook } from '../types';
import { 
  createColoringBookPreset, 
  createSurvivalGuidePreset, 
  createYearlyPlannerPreset,
  createCookbookPreset,
  createAssortedBookPreset,
} from '../data/presets';
import { 
  generateInteriorPdf, 
  generateCoverWrapPdf, 
  createBatchSubmissionZip, 
  downloadBlob 
} from '../utils/pdfGenerator';
import { 
  Zap, 
  Layers, 
  Download, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  FileSpreadsheet, 
  BookOpen, 
  Check 
} from 'lucide-react';

interface BatchExportCenterProps {
  onLoadBook: (book: KDPBook) => void;
}

export const BatchExportCenter: React.FC<BatchExportCenterProps> = ({ onLoadBook }) => {
  const [selectedBatchTheme, setSelectedBatchTheme] = useState<string>('coloring');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; status: string } | null>(null);
  const [completedZipBlob, setCompletedZipBlob] = useState<Blob | null>(null);

  const batchThemes = [
    {
      id: 'coloring',
      name: '10 Kids Activity & Coloring Volumes',
      description: '10 unique coloring books (100 pages each, Bleed ON, vector line art, Amazon SEO keywords)',
      icon: '🎨',
      creator: createColoringBookPreset,
      subTitles: [
        'Vol 1: Friendly Safari & Jungle Animals',
        'Vol 2: Prehistoric Dinosaur Adventures',
        'Vol 3: Outer Space & Rocket Journeys',
        'Vol 4: Underwater Ocean Coral Reefs',
        'Vol 5: Whimsical Forest & Woodland Friends',
        'Vol 6: Monster Trucks & Super Vehicles',
        'Vol 7: Magical Castles & Little Dragons',
        'Vol 8: Happy Farmyard Animals',
        'Vol 9: Baby Pets & Cozy Kittens',
        'Vol 10: Alphabet & Number Animals',
      ],
    },
    {
      id: 'survival',
      name: '10 Tactical Survival Handbooks',
      description: '10 field-ready vehicle & outdoor survival manuals (32 pages each, high-contrast, emergency protocols)',
      icon: '🚗',
      creator: createSurvivalGuidePreset,
      subTitles: [
        'Vol 1: Stranded in Your Car (25 Tactics)',
        'Vol 2: Winter Blizzard & Sub-Zero Cold Survival',
        'Vol 3: Desert Breakdown & Extreme Heat Hydration',
        'Vol 4: Mountain Pass & Avalanche Preparedness',
        'Vol 5: Vehicle Bug-Out & Emergency Evacuation',
        'Vol 6: Glovebox Emergency First Aid & Trauma',
        'Vol 7: Off-Grid Signaling & Search Rescue Contact',
        'Vol 8: Grid-Down Automotive Power & Communications',
        'Vol 9: Flood & Flash Water Evacuation Manual',
        'Vol 10: Remote Wilderness Navigation & Tracking',
      ],
    },
    {
      id: 'planner',
      name: '10 Executive Planners & Journals',
      description: '10 high-performance planners (60 pages each, 52-week roadmap, Eisenhower matrix, habit streaks)',
      icon: '📅',
      creator: createYearlyPlannerPreset,
      subTitles: [
        'Vol 1: Master Productivity & Focus Planner',
        'Vol 2: Daily Deep Work & Time-Blocking Journal',
        'Vol 3: 52-Week Wealth & Financial Freedom Roadmap',
        'Vol 4: Mindful Habit Streak & Wellness Blueprint',
        'Vol 5: Founder & Startup Sprint Organizer',
        'Vol 6: Student Academic & Research Master Planner',
        'Vol 7: Real Estate Agent Daily Sales Pipeline',
        'Vol 8: Fitness & Strength Progression Tracker',
        'Vol 9: Creative Writing & Author Sprint Journal',
        'Vol 10: Annual North-Star Strategic Milestone Planner',
      ],
    },
    {
      id: 'cookbook',
      name: '10 Culinary Masterclass Cookbooks',
      description: '10 structured recipe manuals (40 pages each, prep/cook badges, chef tips, ingredient tables)',
      icon: '🍳',
      creator: createCookbookPreset,
      subTitles: [
        'Vol 1: The Weeknight Gourmet (30-Min Meals)',
        'Vol 2: Cast-Iron Skillet Master Recipes',
        'Vol 3: Artisan Sourdough & Crusty Breads',
        'Vol 4: Mediterranean Coastal Table Classics',
        'Vol 5: High-Protein Sheet Pan Dinners',
        'Vol 6: Low-Carb Searing & Savory Cuts',
        'Vol 7: Fresh Pasta & Italian Sauces',
        'Vol 8: Slow-Cooker Savory Comforts',
        'Vol 9: French Bistro Cooking at Home',
        'Vol 10: Plant-Based Elevated Dinners',
      ],
    },
    {
      id: 'assorted',
      name: '10 Non-Fiction Masterclass Volumes',
      description: '10 intellectual frameworks (48 pages each, first principles deconstruction, decision logs)',
      icon: '📚',
      creator: createAssortedBookPreset,
      subTitles: [
        'Vol 1: The Asymmetric Mind: Mental Models',
        'Vol 2: First Principles Thinking & Leverage',
        'Vol 3: The Deep Work Operating System',
        'Vol 4: Second-Order Decision Architecture',
        'Vol 5: High-Output Strategic Management',
        'Vol 6: Cognitive Bias Immunity Handbook',
        'Vol 7: Compounding Asymmetric Upside',
        'Vol 8: Systems Thinking in Complex Markets',
        'Vol 9: The Psychology of High Execution',
        'Vol 10: Ruthless Prioritization for Founders',
      ],
    },
  ];

  const currentTheme = batchThemes.find(t => t.id === selectedBatchTheme) || batchThemes[0];

  const handleStartBatchGeneration = async () => {
    setIsGenerating(true);
    setCompletedZipBlob(null);

    const batchItems: Array<{
      book: KDPBook;
      interiorBytes: Uint8Array;
      coverBytes: Uint8Array;
      index: number;
    }> = [];

    const totalBooks = 10;

    try {
      for (let i = 0; i < totalBooks; i++) {
        const subTitle = currentTheme.subTitles[i];
        setProgress({
          current: i + 1,
          total: totalBooks,
          status: `Compiling Book ${i + 1} of 10: "${subTitle}"...`,
        });

        // Create base book instance from preset
        const baseBook = currentTheme.creator();
        
        // Customize title & volume metadata for distinct books in the batch
        const bookTitle = `${baseBook.metadata.title}: ${subTitle}`;
        const updatedBook: KDPBook = {
          ...baseBook,
          id: `batch-${selectedBatchTheme}-${i + 1}`,
          metadata: {
            ...baseBook.metadata,
            title: bookTitle,
            subtitle: `${subTitle} — Complete Amazon KDP Edition`,
            seoTitle: `${bookTitle} (Amazon KDP Paperback Edition)`,
          },
          coverSpec: {
            ...baseBook.coverSpec,
            frontTitle: subTitle.toUpperCase(),
          },
        };

        // Render interior PDF
        const interiorBytes = await generateInteriorPdf(updatedBook);
        // Render cover wrap PDF
        const coverBytes = await generateCoverWrapPdf(updatedBook);

        batchItems.push({
          book: updatedBook,
          interiorBytes,
          coverBytes,
          index: i,
        });

        // Small pause to yield UI event loop
        await new Promise(r => setTimeout(r, 60));
      }

      setProgress({
        current: 10,
        total: 10,
        status: 'Packaging Master 10-Book Archive (10 Interiors + 10 Covers + 10 JSON Kits)...',
      });

      const zipBlob = await createBatchSubmissionZip(batchItems);
      setCompletedZipBlob(zipBlob);
      setIsGenerating(false);
      setProgress(null);
    } catch (err: any) {
      console.error('Batch generation error:', err);
      alert('Error during batch export: ' + (err.message || 'Unknown error'));
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const handleDownloadMasterZip = () => {
    if (completedZipBlob) {
      downloadBlob(completedZipBlob, `KDP_Batch_${selectedBatchTheme.toUpperCase()}_10_Books_MasterKit.zip`);
    }
  };

  return (
    <div className="space-y-6" id="kdp-batch-export-center">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-indigo-300">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Batch Export Mode (10 Books / 1-Click)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  ⭐ Smart Addition 4
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Generate <b>10 interior PDFs</b>, <b>10 full-wrap covers</b>, and <b>10 complete metadata kits</b> in a single automated click. Build an entire Amazon KDP publishing catalog in minutes.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              disabled={isGenerating}
              onClick={handleStartBatchGeneration}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-all ${
                isGenerating 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Catalog...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  Generate 10 Books in 1-Click
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">Yields 10 Interiors + 10 Covers + 10 JSONs</span>
          </div>
        </div>

        {/* Progress Display */}
        {progress && (
          <div className="mt-6 p-4 bg-slate-950/80 border border-indigo-500/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300">{progress.status}</span>
              <span className="font-mono font-bold text-white">{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Completed Master Download Banner */}
        {completedZipBlob && !isGenerating && (
          <div className="mt-6 p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Batch Compilation Finished Successfully!</div>
                <div className="text-xs text-emerald-300">
                  All 10 books compiled: 10 Interiors, 10 Covers, 10 metadata.json, 10 pricing.json, 10 cover-info.json + CSV catalog summary.
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadMasterZip}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg shadow-md transition-all shrink-0 text-xs"
            >
              <Download className="w-4 h-4" />
              Download Master Batch Kit (.ZIP)
            </button>
          </div>
        )}
      </div>

      {/* Select Batch Catalog Theme */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Select 10-Book Publishing Niche
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {batchThemes.map((theme) => {
            const isSelected = selectedBatchTheme === theme.id;
            return (
              <button
                key={theme.id}
                disabled={isGenerating}
                onClick={() => {
                  setSelectedBatchTheme(theme.id);
                  setCompletedZipBlob(null);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="text-2xl mb-1.5">{theme.icon}</div>
                <div className="text-xs font-bold">{theme.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {theme.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10-Book Queue Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">10-Book Generation Queue</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {currentTheme.name}
          </span>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
          {currentTheme.subTitles.map((sub, idx) => (
            <div key={idx} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 font-bold text-slate-600 font-mono text-[11px]">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{sub}</div>
                  <div className="text-[11px] text-slate-500">
                    Includes 8.5×11 Interior PDF • FullWrap Cover • metadata.json • pricing.json • cover-info.json
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready for Batch
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
