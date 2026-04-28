import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, orderBy, limit,
  onSnapshot, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db as fbDb, firebaseReady } from '../firebase';
import { useAuth } from '../context/AuthContext';

export interface Need {
  id: string;
  orgId: string;
  submittedBy: string;
  submissionType: 'form' | 'ocr' | 'voice' | 'sms' | 'whatsapp';
  status: 'pending' | 'matching' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  category: string;
  urgencyScore: number;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  beneficiaryCount: number;
  specificRequirements: string[];
  location: { formattedAddress: string; lat: number; lng: number; geoZoneId?: string };
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  communityRating?: number;
  createdAt: unknown;
  updatedAt: unknown;
}

// ─── localStorage layer (fallback + offline cache) ─────────────────────────

const NEEDS_KEY   = 'impactbridge_needs';
const VERSION_KEY = 'impactbridge_needs_v';

const bus = new Set<() => void>();
function notify() {
  localStorage.setItem(VERSION_KEY, Date.now().toString());
  bus.forEach(fn => fn());
}

function loadLocal(): Need[] {
  try {
    const s = localStorage.getItem(NEEDS_KEY);
    return s ? JSON.parse(s) : [...DEMO_NEEDS];
  } catch { return [...DEMO_NEEDS]; }
}

function saveLocal(needs: Need[]) {
  try { localStorage.setItem(NEEDS_KEY, JSON.stringify(needs)); } catch {}
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useNeeds(_filters?: { status?: string; category?: string }) {
  const [needs, setNeeds]   = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const refresh = useCallback(() => { setNeeds(loadLocal()); setLoading(false); }, []);

  useEffect(() => {
    if (firebaseReady && fbDb) {
      const db = fbDb;
      const q = query(collection(db, 'needs'), orderBy('createdAt', 'desc'), limit(200));
      const unsub = onSnapshot(q, (snap) => {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as Need));
        setNeeds(fetched);
        saveLocal(fetched);
        setLoading(false);
      }, () => { refresh(); });
      return unsub;
    } else {
      // localStorage only
      const t = setTimeout(refresh, 150);
      bus.add(refresh);
      return () => { clearTimeout(t); bus.delete(refresh); };
    }
  }, [profile?.uid, refresh]);

  return { needs, loading, refresh };
}

// ─── Mutations ─────────────────────────────────────────────────────────────

export async function submitNeed(data: Omit<Need, 'id' | 'createdAt' | 'updatedAt'>) {
  if (firebaseReady && fbDb) {
    const db = fbDb;
    const ref = await addDoc(collection(db, 'needs'), {
      ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { id: ref.id, ...data };
  }
  // localStorage fallback
  const needs = loadLocal();
  const newNeed: Need = { ...data, id: `need_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
  needs.unshift(newNeed);
  saveLocal(needs);
  notify();
  return newNeed;
}

export async function updateNeed(needId: string, patch: Partial<Need>) {
  if (firebaseReady && fbDb) {
    const db = fbDb;
    await updateDoc(doc(db, 'needs', needId), { ...patch, updatedAt: serverTimestamp() });
    return;
  }
  const needs = loadLocal();
  const idx = needs.findIndex(n => n.id === needId);
  if (idx !== -1) { needs[idx] = { ...needs[idx], ...patch, updatedAt: new Date() }; saveLocal(needs); notify(); }
}

export async function updateNeedStatus(needId: string, status: Need['status']) {
  return updateNeed(needId, { status });
}

// ─── Demo data ─────────────────────────────────────────────────────────────

const DEMO_NEEDS: Need[] = [
  {
    id: 'need_001', orgId: 'demo_org', submittedBy: 'anonymous', submissionType: 'form',
    status: 'pending', category: 'medical', urgencyScore: 92, urgencyLevel: 'critical',
    description: 'Mother with three children, youngest has severe fever for 2 days. Requires pediatric nurse and fever medication immediately.',
    beneficiaryCount: 4, specificRequirements: ['pediatric nurse', 'fever medication'],
    location: { formattedAddress: '12 Main St, Sector 7, Ludhiana', lat: 30.901, lng: 75.8573 },
    createdAt: new Date(Date.now() - 2 * 3600000), updatedAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: 'need_002', orgId: 'demo_org', submittedBy: 'user_123', submissionType: 'voice',
    status: 'assigned', category: 'food_security', urgencyScore: 74, urgencyLevel: 'high',
    description: 'Family of 6 without food for 3 days due to flooding. Children under 10. Need emergency food supplies and clean water.',
    beneficiaryCount: 6, specificRequirements: ['emergency food supplies', 'clean water'],
    location: { formattedAddress: 'Ravi Nagar, Sector 4, Ludhiana', lat: 30.915, lng: 75.843 },
    assignedVolunteerId: 'vol_002', assignedVolunteerName: 'Priya Sharma',
    createdAt: new Date(Date.now() - 5 * 3600000), updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'need_003', orgId: 'demo_org', submittedBy: 'user_456', submissionType: 'sms',
    status: 'in_progress', category: 'shelter', urgencyScore: 81, urgencyLevel: 'critical',
    description: 'Roof collapsed after storm. Elderly couple unable to move. Needs immediate shelter assessment and temporary housing.',
    beneficiaryCount: 2, specificRequirements: ['structural assessment', 'temporary shelter'],
    location: { formattedAddress: 'Model Town, Ludhiana', lat: 30.923, lng: 75.862 },
    assignedVolunteerId: 'vol_003', assignedVolunteerName: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 8 * 3600000), updatedAt: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: 'need_004', orgId: 'demo_org', submittedBy: 'user_789', submissionType: 'form',
    status: 'completed', category: 'education', urgencyScore: 42, urgencyLevel: 'medium',
    description: 'Community learning center needs volunteers to teach basic literacy to 20 adults. Weekend sessions preferred.',
    beneficiaryCount: 20, specificRequirements: ['literacy teacher', 'teaching materials'],
    location: { formattedAddress: 'Sarabha Nagar, Ludhiana', lat: 30.888, lng: 75.831 },
    assignedVolunteerId: 'vol_001', assignedVolunteerName: 'Amandeep Singh', communityRating: 4.8,
    createdAt: new Date(Date.now() - 48 * 3600000), updatedAt: new Date(Date.now() - 24 * 3600000),
  },
  {
    id: 'need_005', orgId: 'demo_org', submittedBy: 'anonymous', submissionType: 'whatsapp',
    status: 'pending', category: 'water_sanitation', urgencyScore: 68, urgencyLevel: 'high',
    description: 'Water pipe burst in colony. 150+ residents without clean water. Need plumber and water tanker coordination.',
    beneficiaryCount: 150, specificRequirements: ['plumber', 'water tanker'],
    location: { formattedAddress: 'Dugri, Ludhiana', lat: 30.878, lng: 75.847 },
    createdAt: new Date(Date.now() - 3600000), updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'need_006', orgId: 'demo_org', submittedBy: 'user_321', submissionType: 'form',
    status: 'matching', category: 'mental_health', urgencyScore: 55, urgencyLevel: 'medium',
    description: 'Flood survivor showing signs of acute stress. Requires counseling support. Prefers female counselor. Speaks Punjabi.',
    beneficiaryCount: 1, specificRequirements: ['mental health counselor', 'Punjabi speaking', 'female preferred'],
    location: { formattedAddress: 'BRS Nagar, Ludhiana', lat: 30.895, lng: 75.818 },
    createdAt: new Date(Date.now() - 4 * 3600000), updatedAt: new Date(Date.now() - 1800000),
  },
];
