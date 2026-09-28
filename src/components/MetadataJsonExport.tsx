import React, { useState } from 'react';
import { KDPBook } from '../types';
import { 
  generateMetadataJson, 
  generatePricingJson, 
  generateCoverInfoJson, 
  downloadJsonFile 
} from '../utils/pdfGenerator';
import { FileJson, Download, Copy, Check, Code, ShieldCheck } from 'lucide-react';

interface MetadataJsonExportProps {
  book: KDPBook;
}

export const MetadataJsonExport: React.FC<MetadataJsonExportProps> = ({ book }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const metadataData = generateMetadataJson(book);
  const pricingData = generatePricingJson(book);
  const coverInfoData = generateCoverInfoJson(book);

  const handleCopy = (obj: any, section: string) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const jsonCards = [
    {
      id: 'metadata',
      filename: 'metadata.json',
      title: 'metadata.json',
      subtitle: 'SEO titles, 300-word description, 7 keywords, 2 BISAC categories, author and publishing rights',
      data: metadataData,
      color: 'border-blue-500/40 bg-blue-50/20',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'pricing',
      filename: 'pricing.json',
      title: 'pricing.json',
      subtitle: 'Print cost × 3 formula, US/UK/CA/EU currency matrix, and 60% royalty projections',
      data: pricingData,
      color: 'border-emerald-500/40 bg-emerald-50/20',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'cover-info',
      filename: 'cover-info.json',
      title: 'cover-info.json',
      subtitle: 'Calculated spine width, total flat wrap dimensions (points & inches), barcode safe zone coordinates, and font pairings',
      data: coverInfoData,
      color: 'border-purple-500/40 bg-purple-50/20',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="space-y-6" id="kdp-metadata-json-export">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400">
            <FileJson className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Metadata JSON Export Hub</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                ⭐ Smart Addition 7
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Download clean, modular JSON payloads for your automated publishing pipelines, catalog databases, or external KDP automation tools.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              downloadJsonFile('metadata.json', metadataData);
              downloadJsonFile('pricing.json', pricingData);
              downloadJsonFile('cover-info.json', coverInfoData);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download All 3 JSON Files
          </button>
        </div>
      </div>

      {/* 3 JSON Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {jsonCards.map((card) => (
          <div 
            key={card.id} 
            className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-mono text-sm font-bold text-slate-900">{card.title}</h3>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${card.badgeColor}`}>
                  KDP Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                {card.subtitle}
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="p-4 bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
              <pre>{JSON.stringify(card.data, null, 2)}</pre>
            </div>

            {/* Card Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopy(card.data, card.id)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                {copiedSection === card.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === card.id ? 'Copied' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={() => downloadJsonFile(card.filename, card.data)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-500 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs hover:text-indigo-600 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
