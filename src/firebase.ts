import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDubJ8fGw6glc-UmqcMk3F9fnM20ThCZ2U",
  authDomain: "banstank-c16d6.firebaseapp.com",
  databaseURL: "https://banstank-c16d6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "banstank-c16d6",
  storageBucket: "banstank-c16d6.firebasestorage.app",
  messagingSenderId: "623031862681",
  appId: "1:623031862681:web:1b901577af6a4f7f07ff08",
  measurementId: "G-QHTQEZFV3R"
};

// Initialize Firebase with fallback support
let app;
let auth: any;
let db: any;
let isFirebaseConnected = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseConnected = true;
} catch (error) {
  console.warn("Firebase initialization failed. Running in standalone local sandbox mode:", error);
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { 
  app, 
  auth, 
  db, 
  googleProvider,
  isFirebaseConnected,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
};
export type { User };
