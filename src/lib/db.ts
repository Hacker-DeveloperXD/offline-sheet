<<<<<<< HEAD

// This file is no longer used as data storage is moving to Firestore.
// You can delete this file or keep it for reference if needed.

export {}; // To make it a module
=======
import type { SpreadsheetData, SpreadsheetInfo } from '@/types/spreadsheet';

const DB_NAME = 'OfflineSheetDB';
const DB_VERSION = 1;
const SPREADSHEET_STORE_NAME = 'spreadsheets';

interface DBResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SPREADSHEET_STORE_NAME)) {
        const store = db.createObjectStore(SPREADSHEET_STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
}

export async function saveSpreadsheet(spreadsheet: SpreadsheetData): Promise<DBResult<void>> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.put(spreadsheet);
      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getSpreadsheet(id: string): Promise<DBResult<SpreadsheetData>> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readonly');
    const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve({ success: true, data: request.result as SpreadsheetData });
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getAllSpreadsheetInfo(): Promise<DBResult<SpreadsheetInfo[]>> {
 try {
    const db = await openDB();
    const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readonly');
    const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
    const index = store.index('updatedAt'); // Sort by most recently updated
    
    return new Promise<DBResult<SpreadsheetInfo[]>>((resolve, reject) => {
      const spreadsheetsInfo: SpreadsheetInfo[] = [];
      // Iterate in reverse to get newest first
      const cursorRequest = index.openCursor(null, "prev"); 

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const { id, name, createdAt, updatedAt } = cursor.value as SpreadsheetData;
          spreadsheetsInfo.push({ id, name, createdAt, updatedAt });
          cursor.continue();
        } else {
          resolve({ success: true, data: spreadsheetsInfo });
        }
      };
      cursorRequest.onerror = () => reject(cursorRequest.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteSpreadsheet(id: string): Promise<DBResult<void>> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(SPREADSHEET_STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
