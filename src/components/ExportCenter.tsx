import React, { useState } from 'react';
import { 
  Download, 
  FileDown, 
  Archive, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Sparkles, 
  FileCode, 
  DollarSign, 
  Layout, 
  Layers 
} from 'lucide-react';
import { KDPBook } from '../types';
import { 
  generateInteriorPdf, 
  generateCoverWrapPdf, 
  createKDPSubmissionZip, 
  generateMetadataJson, 
  generatePricingJson, 
  generateCoverInfoJson, 
  downloadBlob, 
  downloadJsonFile 
} from '../utils/pdfGenerator';
import { useFirebase } from '../firebase/FirebaseContext';
import { Cloud, CloudUpload, CheckCircle, Database } from 'lucide-react';

interface ExportCenterProps {
  book: KDPBook;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({ book }) => {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<string | null>(null);
  const { user, isSavingToCloud, saveCurrentBookToCloud, signInWithGoogle } = useFirebase();

  const handleCloudSave = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (e) {
        return;
      }
    }
    try {
      setCloudSaveStatus('saving');
      await saveCurrentBookToCloud(book);
      setCloudSaveStatus('success');
      setTimeout(() => setCloudSaveStatus(null), 4000);
    } catch (err: any) {
      setCloudSaveStatus('error');
      setTimeout(() => setCloudSaveStatus(null), 5000);
    }
  };

  const safeTitle = book.metadata.title.replace(/[^a-zA-Z0-9_-]/g, '_');

  const handleDownloadInterior = async () => {
    try {
      setDownloadingType('interior');
      const pdfBytes = await generateInteriorPdf(book);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `${safeTitle}_Interior_8.5x11_AmazonKDP.pdf`);
    } catch (err) {
      console.error('Failed to generate interior PDF:', err);
      alert('Error generating interior PDF');
    } finally {
      setDownloadingType(null);
    }
  };

  const handleDownloadCover = async () => {
    try {
      setDownloadingType('cover');
      const pdfBytes = await generateCoverWrapPdf(book);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `${safeTitle}_FullWrap_Cover_AmazonKDP.pdf`);
    } catch (err) {
      console.error('Failed to generate cover PDF:', err);
      alert('Error generating cover PDF');
    } finally {
      setDownloadingType(null);
    }
  };

  const handleDownloadMetadataJson = () => {
    downloadJsonFile('metadata.json', generateMetadataJson(book));
  };

  const handleDownloadPricingJson = () => {
    downloadJsonFile('pricing.json', generatePricingJson(book));
  };

  const handleDownloadCoverInfoJson = () => {
    downloadJsonFile('cover-info.json', generateCoverInfoJson(book));
  };

  const handleDownloadMasterZip = async () => {
    try {
      setDownloadingType('zip');
      const [interiorBytes, coverBytes] = await Promise.all([
        generateInteriorPdf(book),
        generateCoverWrapPdf(book),
      ]);
      const zipBlob = await createKDPSubmissionZip(book, interiorBytes, coverBytes);
      downloadBlob(zipBlob, `${safeTitle}_Complete_AmazonKDP_Kit.zip`);
    } catch (err) {
      console.error('Failed to build KDP zip kit:', err);
      alert('Error creating master ZIP package');
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="kdp-export-center">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                One-Click Amazon KDP Submission Center
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Print Engine Certified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Instant download of 300 DPI interior PDF, full-wrap cover PDF, metadata.json, pricing.json, and copy-paste guides.
            </p>
          </div>
        </div>

        {/* Master Zip Download Action */}
        <button
          type="button"
          onClick={handleDownloadMasterZip}
          disabled={downloadingType !== null}
          className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] shadow-md disabled:opacity-60 cursor-pointer transition-all shrink-0"
        >
          {downloadingType === 'zip' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-950" />
              Compiling Master ZIP...
            </>
          ) : (
            <>
              <Archive className="w-4 h-4 mr-2 text-slate-950" />
              Download Complete KDP Submission Kit (.ZIP)
            </>
          )}
        </button>
      </div>

      {/* Grid of Individual Deliverables */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Interior PDF */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-indigo-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <FileText className="w-4 h-4 mr-1 text-indigo-600" />
                Interior PDF
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                8.5×11 Standard
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              {book.pages.length} pages, 0.375" alternating gutter, 0.25" outer margins, 300 DPI.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadInterior}
            disabled={downloadingType !== null}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-indigo-50 hover:border-indigo-400 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            {downloadingType === 'interior' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-indigo-600" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Interior PDF
              </>
            )}
          </button>
        </div>

        {/* Cover Wrap PDF */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-indigo-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <Archive className="w-4 h-4 mr-1 text-indigo-600" />
                Full-Wrap Cover
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                {book.coverSpec.spineWidthInches}" Spine
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Front, back, calculated spine thickness, 0.125" bleed, and barcode box clearance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadCover}
            disabled={downloadingType !== null}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-indigo-50 hover:border-indigo-400 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            {downloadingType === 'cover' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-indigo-600" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Cover Wrap PDF
              </>
            )}
          </button>
        </div>

        {/* metadata.json */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-blue-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <FileCode className="w-4 h-4 mr-1 text-blue-600" />
                metadata.json
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ⭐ Smart 7
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              SEO titles, 300-word description, 7 backend keywords, and 2 BISAC categories.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadMetadataJson}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-blue-50 hover:border-blue-400 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            metadata.json
          </button>
        </div>

        {/* pricing.json */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-emerald-600" />
                pricing.json
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Cost × 3
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Auto-pricing for US ($), UK (£), CA (C$), EU (€) with 60% Amazon royalty breakdown.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadPricingJson}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-emerald-50 hover:border-emerald-400 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            pricing.json
          </button>
        </div>

        {/* cover-info.json */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-purple-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <Layout className="w-4 h-4 mr-1 text-purple-600" />
                cover-info.json
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Spine & Bleed
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Spine width formula, total flat wrap dimensions (pts & inches), and barcode zone.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadCoverInfoJson}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-purple-50 hover:border-purple-400 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            cover-info.json
          </button>
        </div>

        {/* Firestore Cloud Sync */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-amber-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <Database className="w-4 h-4 mr-1 text-amber-600" />
                Cloud Backup
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Firestore
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Save complete manuscript, cover specs, spine width, and metadata to Google Cloud.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCloudSave}
            disabled={cloudSaveStatus === 'saving' || isSavingToCloud}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-amber-50 hover:border-amber-400 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            {cloudSaveStatus === 'saving' || isSavingToCloud ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-amber-600" />
                Saving...
              </>
            ) : cloudSaveStatus === 'success' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Saved to Cloud!
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                {user ? 'Save to Firestore' : 'Sign In & Save'}
              </>
            )}
          </button>
        </div>

      </div>

      {/* Upload Instructions Walkthrough */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-700">
        <div className="font-bold text-slate-900 mb-2 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
          How to Submit to Amazon KDP (kdp.amazon.com) in 3 Steps:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-700">1. Paperback Details:</span>
            <p className="text-slate-600 mt-0.5">
              Copy & paste the SEO Title, 300-word Description HTML, and the 7 backend search keywords from your metadata.json.
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-700">2. Paperback Content:</span>
            <p className="text-slate-600 mt-0.5">
              Select 8.5" × 11.0" trim size. Upload the Interior PDF, choose "Upload a cover you already have", and upload the Full-Wrap Cover PDF.
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-700">3. Rights & Pricing:</span>
            <p className="text-slate-600 mt-0.5">
              Select Worldwide rights. Enter ${book.metadata.internationalPricing?.retailUS || book.metadata.listPriceUSD} USD for US (or your international prices from pricing.json) and submit!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
