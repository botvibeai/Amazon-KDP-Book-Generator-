import React, { useState } from 'react';
import { useFirebase } from '../firebase/FirebaseContext';
import { KDPBook } from '../types';
import {
  Cloud,
  CloudUpload,
  CheckCircle2,
  Trash2,
  BookOpen,
  LogIn,
  LogOut,
  X,
  RefreshCw,
  FolderGit2,
  Database,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface CloudLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBook: KDPBook;
  onLoadBook: (book: KDPBook) => void;
}

export const CloudLibraryModal: React.FC<CloudLibraryModalProps> = ({
  isOpen,
  onClose,
  currentBook,
  onLoadBook,
}) => {
  const {
    user,
    authReady,
    signInWithGoogle,
    signOutUser,
    cloudBooks,
    isSavingToCloud,
    saveCurrentBookToCloud,
    loadBookFromCloud,
    deleteBookFromCloudById,
    lastCloudSyncTime,
  } = useFirebase();

  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveCurrent = async () => {
    setErrorMsg(null);
    try {
      await saveCurrentBookToCloud(currentBook);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save to cloud storage.');
    }
  };

  const handleSelectBook = async (bookId: string) => {
    setErrorMsg(null);
    setLoadingBookId(bookId);
    try {
      const book = await loadBookFromCloud(bookId);
      if (book) {
        onLoadBook(book);
        onClose();
      } else {
        setErrorMsg('Book data could not be retrieved from cloud.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load book from cloud.');
    } finally {
      setLoadingBookId(null);
    }
  };

  const handleDeleteBook = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this book from your cloud library?')) return;
    setErrorMsg(null);
    setDeletingBookId(bookId);
    try {
      await deleteBookFromCloudById(bookId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete book.');
    } finally {
      setDeletingBookId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/20 text-amber-400 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Firebase Firestore Cloud Library
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                  connectoros-pilot
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Persistent storage across devices powered by Google Cloud Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">
                  {user.displayName || user.email}
                </span>
                <span className="text-[11px] text-slate-500">
                  {lastCloudSyncTime ? `Last synced at ${lastCloudSyncTime}` : 'Connected to Firestore'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Sign in with Google to enable automatic cloud backup and library syncing.</span>
            </div>
          )}

          <div>
            {user ? (
              <button
                onClick={() => signOutUser()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                Sign In with Google
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Book saved to Firebase Firestore successfully!</span>
            </div>
          )}

          {/* Quick Action: Save Current Book */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Current Active Book:</span>
                <span className="font-normal text-slate-700 truncate max-w-xs">
                  {currentBook.metadata.title || currentBook.coverSpec.frontTitle || 'Untitled Book'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentBook.pages.length} pages • {currentBook.interiorSpec.trimWidthInches}" × {currentBook.interiorSpec.trimHeightInches}" • Spine: {currentBook.coverSpec.spineWidthInches}"
              </p>
            </div>

            <button
              onClick={handleSaveCurrent}
              disabled={!user || isSavingToCloud}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                user && !isSavingToCloud
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSavingToCloud ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  Save to Firestore
                </>
              )}
            </button>
          </div>

          {/* Saved Books List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Your Saved Books in Firestore ({cloudBooks.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Project: connectoros-pilot
              </span>
            </div>

            {!user ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Cloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Please sign in to access your cloud library</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                  Your Amazon KDP manuscripts, full-wrap covers, spine calculations, and metadata packages will be securely synced to Google Cloud Firestore.
                </p>
                <button
                  onClick={() => signInWithGoogle()}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  Sign In with Google
                </button>
              </div>
            ) : cloudBooks.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No books saved to Firestore yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click the "Save to Firestore" button above to store your current active book project.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cloudBooks.map((b) => {
                  const isLoadingThis = loadingBookId === b.id;
                  const isDeletingThis = deletingBookId === b.id;
                  const isCurrentActive = b.id === currentBook.id;

                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBook(b.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrentActive
                          ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-13 rounded-md shadow-xs flex flex-col justify-between p-1 text-[8px] font-bold text-white shrink-0"
                          style={{ backgroundColor: b.primaryColor || '#0f172a' }}
                        >
                          <span className="line-clamp-2 leading-tight">{b.title}</span>
                          <span className="text-[7px] text-amber-300 font-mono">{b.pageCount}p</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {b.title}
                            </h5>
                            {isCurrentActive && (
                              <span className="text-[9px] bg-amber-200 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {b.author ? `By ${b.author}` : 'KDP Book'} • {b.pageCount} Pages • Spine: {b.spineWidthInches}"
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span>Saved: {new Date(b.updatedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="capitalize">{b.bookType || 'nonfiction'}</span>
                            {b.listPriceUSD && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-slate-600">${b.listPriceUSD}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleSelectBook(b.id)}
                          disabled={isLoadingThis}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                        >
                          {isLoadingThis ? 'Loading...' : 'Load'}
                        </button>
                        <button
                          onClick={(e) => handleDeleteBook(e, b.id)}
                          disabled={isDeletingThis}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete from Cloud"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Attribute-Based Access Control (ABAC) Firestore Rules Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
