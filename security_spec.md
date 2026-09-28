# Amazon KDP Book Generator - Security Specification

## 1. Data Invariants
1. **User Profile Ownership:** A user document at `/users/{userId}` can only be read or written by the authenticated user whose `request.auth.uid == userId`.
2. **Book Record Ownership:** Every KDP book at `/books/{bookId}` must strictly have `userId == request.auth.uid`. A user cannot read, query, create, update, or delete another user's books.
3. **Immutability of Key Fields:** Once created, `userId` and `createdAt` cannot be altered during any update operation.
4. **ID Hygiene:** Path variables `{userId}` and `{bookId}` must be valid IDs matching `^[a-zA-Z0-9_\-]+$` and `<= 128` characters.
5. **No Blind Blanket Reads:** Queries against `/books` must evaluate `resource.data.userId == request.auth.uid`.
6. **Strict Field Types & Boundaries:** Books must have a valid `title` (<= 200 chars), `pageCount` (>= 24 and <= 828), and bounded string lengths.

---

## 2. The "Dirty Dozen" Payloads (Designed to Break Identity, Integrity, and State)

1. **Payload 1 (Ghost Field Injection):**
   Injecting `isAdmin: true` into a `/users/{userId}` update.
2. **Payload 2 (Cross-User Book Read):**
   User A attempting to `get` `/books/{bookId_owned_by_B}`.
3. **Payload 3 (Cross-User Book Query/Scrape):**
   User A running a collection query `collection('books')` without filtering by `userId == A`.
4. **Payload 4 (Identity Spoofing on Create):**
   User A creating a book with `userId: "user_B"`.
5. **Payload 5 (Owner Hijacking on Update):**
   User A updating their book but trying to reassign `userId: "user_B"`.
6. **Payload 6 (CreatedAt Tampering on Update):**
   User modifying `createdAt` to falsify publishing timeline.
7. **Payload 7 (Unauthenticated Read):**
   Anonymous / null auth trying to read `/books/{bookId}`.
8. **Payload 8 (Unauthenticated Write):**
   Anonymous / null auth trying to create `/books/{bookId}`.
9. **Payload 9 (ID Poisoning Attack):**
   Attempting to write to `/books/` with a 2000-character malicious path ID containing SQL/script characters.
10. **Payload 10 (Page Count Underflow):**
    Attempting to create a book with `pageCount: 12` (violating KDP minimum 24-page limit).
11. **Payload 11 (Oversized Payload DOS):**
    Attempting to send a `title` containing 50,000 characters.
12. **Payload 12 (Cross-User Deletion):**
    User A attempting to `delete` `/books/{bookId_owned_by_B}`.

---

## 3. Security Assertions Summary
All 12 adversarial scenarios must be rejected with `PERMISSION_DENIED`.
