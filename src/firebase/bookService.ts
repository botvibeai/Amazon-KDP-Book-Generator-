import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './config';
import { KDPBook } from '../types';

export interface StoredBookSummary {
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  author?: string;
  bookType?: string;
  pageCount: number;
  listPriceUSD?: number;
  spineWidthInches?: number;
  primaryColor?: string;
  accentColor?: string;
  psychologyBadge?: string;
  createdAt: string;
  updatedAt: string;
}

export async function syncUserProfile(userId: string, email: string, displayName?: string, activeBookId?: string) {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!snap.exists()) {
      await setDoc(userRef, {
        userId,
        email,
        displayName: displayName || email.split('@')[0],
        activeBookId: activeBookId || '',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const updateData: Record<string, any> = {
        email,
        updatedAt: now,
      };
      if (displayName) updateData.displayName = displayName;
      if (activeBookId) updateData.activeBookId = activeBookId;
      await updateDoc(userRef, updateData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveBookToCloud(book: KDPBook): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to save to cloud storage.');
  }

  const path = `books/${book.id}`;
  try {
    const bookRef = doc(db, 'books', book.id);
    const existingSnap = await getDoc(bookRef);
    const now = new Date().toISOString();

    // Sanitize book payload to ensure strict adherence to rules & blueprint
    const serializedBookJson = JSON.stringify(book);
    const bookPayload = {
      id: book.id,
      userId: currentUser.uid,
      title: (book.metadata.title || book.coverSpec.frontTitle || 'Untitled Book').slice(0, 200),
      subtitle: (book.metadata.subtitle || book.coverSpec.frontSubtitle || '').slice(0, 300),
      author: (book.metadata.author || book.coverSpec.authorName || '').slice(0, 120),
      bookType: book.bookType || 'nonfiction',
      descriptionHtml: (book.metadata.descriptionHtml || '').slice(0, 4000),
      targetAudience: (book.metadata.targetAudience || '').slice(0, 200),
      pageCount: Math.max(24, Math.min(828, book.pages?.length || 24)),
      listPriceUSD: Number(book.metadata.listPriceUSD || 9.99),
      spineWidthInches: Number(book.coverSpec.spineWidthInches || 0.2),
      primaryColor: book.coverSpec.primaryColor || '#0f172a',
      accentColor: book.coverSpec.accentColor || '#38bdf8',
      psychologyBadge: (book.coverSpec.psychologyBadge || '').slice(0, 150),
      bookDataJson: serializedBookJson,
      updatedAt: now,
    };

    if (!existingSnap.exists()) {
      await setDoc(bookRef, {
        ...bookPayload,
        createdAt: now,
      });
    } else {
      await updateDoc(bookRef, bookPayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserBooksFromCloud(): Promise<StoredBookSummary[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  const path = 'books';
  try {
    const q = query(collection(db, path), where('userId', '==', currentUser.uid));
    const snapshot = await getDocs(q);
    const books: StoredBookSummary[] = [];

    snapshot.forEach((d) => {
      const data = d.data();
      books.push({
        id: data.id || d.id,
        userId: data.userId,
        title: data.title || 'Untitled',
        subtitle: data.subtitle,
        author: data.author,
        bookType: data.bookType,
        pageCount: data.pageCount || 24,
        listPriceUSD: data.listPriceUSD,
        spineWidthInches: data.spineWidthInches,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        psychologyBadge: data.psychologyBadge,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return books.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function loadBookByIdFromCloud(bookId: string): Promise<KDPBook | null> {
  const path = `books/${bookId}`;
  try {
    const bookRef = doc(db, 'books', bookId);
    const snap = await getDoc(bookRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    if (data.bookDataJson) {
      const parsed = JSON.parse(data.bookDataJson) as KDPBook;
      return parsed;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function deleteBookFromCloud(bookId: string): Promise<void> {
  const path = `books/${bookId}`;
  try {
    await deleteDoc(doc(db, 'books', bookId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserBooks(
  onBooksChanged: (books: StoredBookSummary[]) => void,
  onError: (error: Error) => void
): () => void {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    onBooksChanged([]);
    return () => {};
  }

  const path = 'books';
  const q = query(collection(db, path), where('userId', '==', currentUser.uid));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const books: StoredBookSummary[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        books.push({
          id: data.id || d.id,
          userId: data.userId,
          title: data.title || 'Untitled',
          subtitle: data.subtitle,
          author: data.author,
          bookType: data.bookType,
          pageCount: data.pageCount || 24,
          listPriceUSD: data.listPriceUSD,
          spineWidthInches: data.spineWidthInches,
          primaryColor: data.primaryColor,
          accentColor: data.accentColor,
          psychologyBadge: data.psychologyBadge,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      books.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      onBooksChanged(books);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (wrappedErr: any) {
        onError(wrappedErr);
      }
    }
  );

  return unsubscribe;
}
