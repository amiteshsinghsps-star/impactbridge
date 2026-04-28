import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { auth as fbAuth, db as fbDb, firebaseReady } from '../firebase';

export type UserRole = 'coordinator' | 'volunteer' | 'reporter';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profile: Omit<UserProfile, 'uid' | 'email'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── localStorage fallback ─────────────────────────────────────────────────

const STORAGE_KEY  = 'impactbridge_user';
const ACCOUNTS_KEY = 'impactbridge_accounts';

const DEMO_ACCOUNTS: Record<string, UserProfile & { password: string }> = {
  'coordinator@impactbridge.app': {
    uid: 'demo_coordinator', email: 'coordinator@impactbridge.app', password: 'demo1234',
    firstName: 'Priya', lastName: 'Coordinator', role: 'coordinator',
    organizationId: 'demo_org', organizationName: 'Ludhiana Community Aid',
  },
  'volunteer@impactbridge.app': {
    uid: 'demo_volunteer', email: 'volunteer@impactbridge.app', password: 'demo1234',
    firstName: 'Amandeep', lastName: 'Singh', role: 'volunteer',
    organizationId: 'demo_org', organizationName: 'Ludhiana Community Aid',
  },
  'reporter@impactbridge.app': {
    uid: 'demo_reporter', email: 'reporter@impactbridge.app', password: 'demo1234',
    firstName: 'Community', lastName: 'Reporter', role: 'reporter',
  },
};

function getLocalAccounts() {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    return stored ? { ...DEMO_ACCOUNTS, ...JSON.parse(stored) } : { ...DEMO_ACCOUNTS };
  } catch { return { ...DEMO_ACCOUNTS }; }
}

function saveLocalAccount(account: UserProfile & { password: string }) {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    const existing = stored ? JSON.parse(stored) : {};
    existing[account.email] = account;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(existing));
  } catch {}
}

// ─── Provider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseReady && fbAuth && fbDb) {
      const db = fbDb;
      const unsub = onAuthStateChanged(fbAuth, async (u) => {
        if (u) {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) setProfile(snap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      return unsub;
    } else {
      // localStorage fallback
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setProfile(JSON.parse(stored));
      } catch {}
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (firebaseReady && fbAuth && fbDb) {
      await signInWithEmailAndPassword(fbAuth, email, password);
      // profile set by onAuthStateChanged listener above
    } else {
      const accounts = getLocalAccounts();
      const account = accounts[email.toLowerCase()];
      if (!account || account.password !== password) throw new Error('Invalid email or password.');
      const { password: _pw, ...userProfile } = account;
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    }
  };

  const register = async (
    email: string,
    password: string,
    profileData: Omit<UserProfile, 'uid' | 'email'>
  ) => {
    if (!email || !password) throw new Error('Email and password are required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    if (firebaseReady && fbAuth && fbDb) {
      const db = fbDb;
      const cred = await createUserWithEmailAndPassword(fbAuth, email, password);
      const newProfile: UserProfile = { uid: cred.user.uid, email: email.toLowerCase(), ...profileData };
      await setDoc(doc(db, 'users', cred.user.uid), { ...newProfile, createdAt: serverTimestamp() });
      setProfile(newProfile);
    } else {
      const accounts = getLocalAccounts();
      if (accounts[email.toLowerCase()]) throw new Error('An account with this email already exists.');
      const uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const newAccount = { uid, email: email.toLowerCase(), password, ...profileData };
      saveLocalAccount(newAccount);
      const { password: _pw, ...userProfile } = newAccount;
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    }
  };

  const logout = async () => {
    if (firebaseReady && fbAuth) await signOut(fbAuth);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user: profile, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
