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

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: The app will break without this line */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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

// Seed sample results so admin dashboard always has rich demo data on initial review
const SEED_RESULTS: TestResult[] = [
  {
    id: 'res-demo-001',
    fullName: 'Raffi Pratama',
    schoolOrigin: 'SMP Negeri 1 Depok',
    grade: '9-B',
    address: 'Jl. Margonda Raya No. 45, Depok',
    studentPhone: '081289123456',
    parentPhone: '081398765432',
    ipaScore: 28,
    ipsScore: 16,
    gardnerScores: {
      linguistic: 65,
      logical: 95,
      spatial: 88,
      naturalist: 75,
      interpersonal: 60,
      intrapersonal: 82,
      musical: 55,
      kinesthetic: 68,
    },
    talentDnaScores: {
      thinking: 92,
      doing: 78,
      relating: 64,
    },
    recommendation: 'IPA',
    recommendationTitle: 'Dominan IPA (The Future Technologist/Scientist)',
    topTalents: ['Analytical Mind', 'Algorithmic Thinker', 'Spatial Architect'],
    learningStyle: 'Visual & Eksperimental (Hands-on Lab Simulation)',
    careerProspects: ['AI & Robotics Engineer', 'Biomedical Scientist', 'Data Architect', 'Aero-space Specialist'],
    recommendedExtracurriculars: ['Robotics & IoT Club', 'KIR (Kelompok Ilmiah Remaja)', 'Genesis Coding Academy'],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'res-demo-002',
    fullName: 'Anindya Putri Kirana',
    schoolOrigin: 'SMP Islam Al-Azhar 19',
    grade: '9-A',
    address: 'Pesona Depok Estate Blok C2, Sukmajaya',
    studentPhone: '082155678901',
    parentPhone: '081299887766',
    ipaScore: 14,
    ipsScore: 30,
    gardnerScores: {
      linguistic: 92,
      logical: 68,
      spatial: 65,
      naturalist: 58,
      interpersonal: 96,
      intrapersonal: 86,
      musical: 72,
      kinesthetic: 60,
    },
    talentDnaScores: {
      thinking: 75,
      doing: 70,
      relating: 95,
    },
    recommendation: 'IPS',
    recommendationTitle: 'Dominan IPS (The Future Leader/Strategist)',
    topTalents: ['Strategic Communicator', 'Empathy Catalyst', 'Public Persuader'],
    learningStyle: 'Diskutif & Studi Kasus (Interactive Forum & Public Speaking)',
    careerProspects: ['Diplomat & Hubungan Internasional', 'Investment Strategist', 'Corporate Lawyer', 'Creative Director'],
    recommendedExtracurriculars: ['English Debate Society', 'Genesis Young Entrepreneurs', 'Jurnalistik & Public Speaking'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'res-demo-003',
    fullName: 'Farel Adrian Nugroho',
    schoolOrigin: 'SMP Taruna Bangsa',
    grade: '9-C',
    address: 'Cimanggis Indah Residence No. 12',
    studentPhone: '085712349988',
    parentPhone: '081122334455',
    ipaScore: 23,
    ipsScore: 24,
    gardnerScores: {
      linguistic: 82,
      logical: 85,
      spatial: 86,
      naturalist: 70,
      interpersonal: 84,
      intrapersonal: 80,
      musical: 64,
      kinesthetic: 76,
    },
    talentDnaScores: {
      thinking: 86,
      doing: 84,
      relating: 85,
    },
    recommendation: 'HYBRID',
    recommendationTitle: 'Multitalenta / Hybrid (The Innovative Polymath)',
    topTalents: ['Holistic Synthesizer', 'Agile Solver', 'Cross-Domain Innovator'],
    learningStyle: 'Project-Based Learning (Integrasi Sains & Bisnis/Sosial)',
    careerProspects: ['Tech Product Manager', 'Sustainable Urban Planner', 'FinTech Innovator', 'Bio-Entrepreneur'],
    recommendedExtracurriculars: ['Genesis Innovation Incubator', 'Multimedia Production Club', 'PMR & Lingkungan Hidup'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

// Helper to safely execute Firestore calls with timeout fallback
async function executeWithTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('the client is offline')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

// Helper: Save test result to Firestore with localStorage mirror
export async function saveTestResult(result: TestResult): Promise<void> {
  const collectionName = 'test_results';

  // Always mirror in localStorage immediately for instant offline resiliency
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
    const list: TestResult[] = existingStr ? JSON.parse(existingStr) : [...SEED_RESULTS];
    const filtered = list.filter(item => item.id !== result.id);
    filtered.unshift(result);
    localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

  try {
    const docRef = doc(db, collectionName, result.id);
    await executeWithTimeout(setDoc(docRef, result));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${result.id}`);
  }
}

// Helper: Fetch all test results
export async function fetchAllTestResults(): Promise<TestResult[]> {
  const collectionName = 'test_results';
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await executeWithTimeout(getDocs(q));
    if (!snapshot.empty) {
      const results: TestResult[] = [];
      snapshot.forEach(docSnap => {
        results.push(docSnap.data() as TestResult);
      });
      // Update local cache
      localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(results));
      return results;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }

  // Fallback to local storage or seed data
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Cache read error', e);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(SEED_RESULTS));
  return SEED_RESULTS;
}

// Helper: Fetch App Settings
export async function fetchAppSettings(): Promise<AppSettings> {
  const collectionName = 'settings';
  try {
    const docRef = doc(db, collectionName, 'general');
    const docSnap = await executeWithTimeout(getDoc(docRef));
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
