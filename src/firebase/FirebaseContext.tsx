import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './config';
import {
  StoredBookSummary,
  syncUserProfile,
  saveBookToCloud,
  loadBookByIdFromCloud,
  deleteBookFromCloud,
  subscribeToUserBooks,
} from './bookService';
import { KDPBook } from '../types';

interface FirebaseContextType {
  user: User | null;
  authReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  cloudBooks: StoredBookSummary[];
  isSavingToCloud: boolean;
  saveCurrentBookToCloud: (book: KDPBook) => Promise<void>;
  loadBookFromCloud: (bookId: string) => Promise<KDPBook | null>;
  deleteBookFromCloudById: (bookId: string) => Promise<void>;
  lastCloudSyncTime: string | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  authReady: false,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  cloudBooks: [],
  isSavingToCloud: false,
  saveCurrentBookToCloud: async () => {},
  loadBookFromCloud: async () => null,
  deleteBookFromCloudById: async () => {},
  lastCloudSyncTime: null,
});

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [cloudBooks, setCloudBooks] = useState<StoredBookSummary[]>([]);
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (currentUser && currentUser.email) {
        try {
          await syncUserProfile(currentUser.uid, currentUser.email, currentUser.displayName || undefined);
        } catch (e) {
          console.warn('Profile sync notice:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore books once auth is ready and user is signed in
  useEffect(() => {
    if (!authReady || !user) {
      setCloudBooks([]);
      return;
    }

    const unsub = subscribeToUserBooks(
      (books) => {
        setCloudBooks(books);
      },
      (err) => {
        console.warn('Subscription error:', err);
      }
    );

    return () => unsub();
  }, [authReady, user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCloudBooks([]);
    } catch (err: any) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  const saveCurrentBookToCloud = async (book: KDPBook) => {
    if (!user) {
      throw new Error('Please sign in with Google to sync your book to Firebase Firestore.');
    }
    setIsSavingToCloud(true);
    try {
      await saveBookToCloud(book);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastCloudSyncTime(timeStr);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  const loadBookFromCloud = async (bookId: string): Promise<KDPBook | null> => {
    return await loadBookByIdFromCloud(bookId);
  };

  const deleteBookFromCloudById = async (bookId: string) => {
    await deleteBookFromCloud(bookId);
  };

  return (
    <FirebaseContext.Provider
      value={{
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
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
