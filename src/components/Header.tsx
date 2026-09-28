import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Download,
  Layers,
  RotateCcw,
  Radio,
  Cloud,
  Database,
  LogIn,
} from 'lucide-react';
import { useFirebase } from '../firebase/FirebaseContext';

interface HeaderProps {
  onQuickExport: () => void;
  pageCount: number;
  spineWidth: number;
  hasSavedSession?: boolean;
  onRestoreSession?: () => void;
  lastSavedTime?: string | null;
  onOpenRadar?: () => void;
  onOpenCloudLibrary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onQuickExport,
  pageCount,
  spineWidth,
  hasSavedSession,
  onRestoreSession,
  lastSavedTime,
  onOpenRadar,
  onOpenCloudLibrary,
}) => {
  const { user, cloudBooks, isSavingToCloud } = useFirebase();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">KDP Book Studio</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-amber-600" />
                  Amazon KDP 8.5×11 Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Print-Ready Interior PDF • Full-Wrap Cover • 0.002252 Spine Engine • Direct Metadata
              </p>
            </div>
          </div>

          {/* Right badges & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Firestore Cloud Library Button */}
            <button
              onClick={onOpenCloudLibrary}
              title="Open Firebase Firestore Cloud Library"
              className={`inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg border shadow-2xs transition-colors cursor-pointer ${
                user
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Database className={`w-3.5 h-3.5 mr-1.5 ${user ? 'text-emerald-600' : 'text-amber-500'}`} />
              <span className="hidden sm:inline">
                {user ? `Cloud Books (${cloudBooks.length})` : 'Cloud Library'}
              </span>
              <span className="sm:hidden">{user ? `${cloudBooks.length}` : 'Cloud'}</span>
              {isSavingToCloud && (
                <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            {/* Live KDP Radar Quick Button */}
            {onOpenRadar && (
              <button
                onClick={onOpenRadar}
                title="Open Live KDP Regulations & Market Radar (Google Search Grounded)"
                className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-2xs transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 mr-1.5 text-indigo-600 animate-pulse" />
                <span className="hidden sm:inline">KDP Live Radar</span>
                <span className="sm:hidden">Radar</span>
              </button>
            )}

            {/* Restore Session Button if data is found in localStorage */}
            {hasSavedSession && onRestoreSession && (
              <button
                id="kdp-restore-session-btn"
                onClick={onRestoreSession}
                title="Restore previously saved book session from local storage"
                className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-700" />
                <span className="hidden sm:inline">Restore Session</span>
                <span className="sm:hidden">Restore</span>
              </button>
            )}

            <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
              <span className="flex items-center font-medium">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {pageCount}p
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-600">
                Spine: <strong className="text-slate-900 font-semibold">{spineWidth.toFixed(4)}"</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Pre-Flight
              </span>
            </div>

            <button
              onClick={onQuickExport}
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download KDP Kit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
