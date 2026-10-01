import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  getDocFromServer,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TestResult, AppSettings } from '../types';

// Suppress transient Firestore transport retry logs
try {
  setLogLevel('error');
} catch (e) {
  // Ignore
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: true,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Active Firebase configuration with fallback support for Vercel, Firebase Hosting, and local dev
export const activeFirebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || firebaseConfig.apiKey || "AIzaSyBuxUEBR86fUtJeLmuQc8rcf-sK2ocXmE0",
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || firebaseConfig.authDomain || "g-compas.firebaseapp.com",
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || firebaseConfig.projectId || "g-compas",
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || firebaseConfig.storageBucket || "g-compas.firebasestorage.app",
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || firebaseConfig.messagingSenderId || "992610184607",
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || firebaseConfig.appId || "1:992610184607:web:c542ac88701916bf14a1aa"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(activeFirebaseConfig) : getApp();

/* Firestore instance */
export const db = getFirestore(app);

// Test connection on boot per Firebase guidelines
async function testConnection() {
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('the client is offline')), 2500));
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeout
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline or backend initializing, utilizing cached storage fallback.');
    }
  }
}
testConnection();

// Initial Default Settings
export const DEFAULT_SETTINGS: AppSettings = {
  isAppActive: true,
  schoolName: 'SMA Genesis Medicare',
  schoolAddress: 'Jl. Gas Alam No. 9, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453',
  eventName: 'Open House & Talent Discovery 2026/2027',
  eventDate: 'Tahun Ajaran 2026/2027',
  principalName: 'Dra. Hj. Brimayanti',
  whatsappNumber: '081289123456',
  updatedAt: new Date().toISOString(),
};

// Local storage key for offline reliability
const LOCAL_STORAGE_KEY_RESULTS = 'gcompass_test_results_cache';
const LOCAL_STORAGE_KEY_SETTINGS = 'gcompass_settings_cache';

// Purge any lingering dummy records from previous versions
if (typeof window !== 'undefined') {
  try {
    const cachedStr = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
    if (cachedStr) {
      const parsed: TestResult[] = JSON.parse(cachedStr);
      const cleaned = parsed.filter(item => !item.id?.startsWith('res-demo-'));
      localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(cleaned));
    }
  } catch (e) {
    // Ignore
  }
}

// Helper: Save test result to Firestore database
export async function saveTestResult(result: TestResult): Promise<void> {
  const collectionName = 'test_results';

  // Save directly to Firestore collection
  try {
    const docRef = doc(db, collectionName, result.id);
    await setDoc(docRef, result);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${result.id}`);
  }

  // Update local storage cache with real submitted results only
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
    const list: TestResult[] = existingStr
      ? (JSON.parse(existingStr) as TestResult[]).filter(i => !i.id?.startsWith('res-demo-'))
      : [];
    const filtered = list.filter(item => item.id !== result.id);
    filtered.unshift(result);
    localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

// Helper: Fetch all real test results from Firestore database
export async function fetchAllTestResults(): Promise<TestResult[]> {
  const collectionName = 'test_results';
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const results: TestResult[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as TestResult;
      if (!data.id?.startsWith('res-demo-')) {
        results.push(data);
      }
    });
    // Update local cache with real database data only
    localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(results));
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }

  // Fallback to local storage (only real records, strictly NO dummy data)
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
    if (cached) {
      const parsed: TestResult[] = JSON.parse(cached);
      return parsed.filter(item => !item.id?.startsWith('res-demo-'));
    }
  } catch (e) {
    console.error('Cache read error', e);
  }

  return [];
}

// Helper to prevent hanging operations
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Helper: Fetch App Settings
export async function fetchAppSettings(): Promise<AppSettings> {
  const collectionName = 'settings';
  try {
    const docRef = doc(db, collectionName, 'general');
    const docSnap = await withTimeout(getDoc(docRef), 6000);
    if (docSnap.exists()) {
      const data = docSnap.data() as AppSettings;
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionName}/general`);
  }

  // Fallback to local storage
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Settings cache read error', e);
  }

  return DEFAULT_SETTINGS;
}

// Helper: Update App Settings
export async function updateAppSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
  const collectionName = 'settings';
  const current = await fetchAppSettings();
  const updated: AppSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, collectionName, 'general');
    await setDoc(docRef, updated, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/general`);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  return updated;
}

// Helper: Delete a test result (Admin only)
export async function deleteTestResult(id: string): Promise<void> {
  const collectionName = 'test_results';
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }

  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
    if (existingStr) {
      const list: TestResult[] = JSON.parse(existingStr);
      const filtered = list.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Delete cache update error', e);
  }
}
