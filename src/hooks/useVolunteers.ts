import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export interface Volunteer {
  id: string;
  userId: string;
  orgIds: string[];
  status: 'available' | 'deployed' | 'offline' | 'suspended';
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    languages: string[];
    bio: string;
    photoUrl?: string;
  };
  skills: Array<{
    skillId: string;
    skillName: string;
    proficiencyLevel: 'expert' | 'intermediate' | 'beginner';
    certified: boolean;
  }>;
  location: {
    homeAddress: string;
    lat: number;
    lng: number;
    maxTravelRadius: number;
  };
  impactScore: number;
  tasksCompleted: number;
  rating: number;
  activeTaskCount: number;
  lastActiveDaysAgo: number;
  matchScore?: number;
}

export function useVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      setVolunteers(DEMO_VOLUNTEERS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [profile?.uid]);

  return { volunteers, loading };
}

export const DEMO_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol_001',
    userId: 'user_001',
    orgIds: ['demo_org'],
    status: 'available',
    profile: { firstName: 'Amandeep', lastName: 'Singh', phone: '+919876543210', languages: ['en', 'pa', 'hi'], bio: 'Retired teacher with 20 years experience in adult literacy programs.' },
    skills: [{ skillId: 'skill_education', skillName: 'Adult Education', proficiencyLevel: 'expert', certified: true }],
    location: { homeAddress: 'Sarabha Nagar, Ludhiana', lat: 30.888, lng: 75.831, maxTravelRadius: 15 },
    impactScore: 1240,
    tasksCompleted: 47,
    rating: 4.9,
    activeTaskCount: 0,
    lastActiveDaysAgo: 1,
  },
  {
    id: 'vol_002',
    userId: 'user_002',
    orgIds: ['demo_org'],
    status: 'deployed',
    profile: { firstName: 'Priya', lastName: 'Sharma', phone: '+919817654321', languages: ['en', 'hi', 'pa'], bio: 'Registered nurse with 5 years pediatric experience.' },
    skills: [{ skillId: 'skill_medical_rn', skillName: 'Registered Nurse', proficiencyLevel: 'expert', certified: true }, { skillId: 'skill_medical_pediatric', skillName: 'Pediatric Care', proficiencyLevel: 'expert', certified: true }],
    location: { homeAddress: 'Model Town, Ludhiana', lat: 30.923, lng: 75.862, maxTravelRadius: 20 },
    impactScore: 2180,
    tasksCompleted: 83,
    rating: 4.8,
    activeTaskCount: 1,
    lastActiveDaysAgo: 0,
  },
  {
    id: 'vol_003',
    userId: 'user_003',
    orgIds: ['demo_org'],
    status: 'deployed',
    profile: { firstName: 'Rajesh', lastName: 'Kumar', phone: '+919765432109', languages: ['hi', 'pa'], bio: 'Civil engineer specializing in structural assessment and rapid disaster response.' },
    skills: [{ skillId: 'skill_civil_eng', skillName: 'Civil Engineering', proficiencyLevel: 'expert', certified: true }, { skillId: 'skill_disaster_response', skillName: 'Disaster Response', proficiencyLevel: 'intermediate', certified: false }],
    location: { homeAddress: 'BRS Nagar, Ludhiana', lat: 30.895, lng: 75.818, maxTravelRadius: 30 },
    impactScore: 890,
    tasksCompleted: 34,
    rating: 4.6,
    activeTaskCount: 1,
    lastActiveDaysAgo: 0,
  },
  {
    id: 'vol_004',
    userId: 'user_004',
    orgIds: ['demo_org'],
    status: 'available',
    profile: { firstName: 'Simran', lastName: 'Kaur', phone: '+919654321098', languages: ['en', 'pa', 'hi'], bio: 'Clinical psychologist focused on trauma and disaster mental health support.' },
    skills: [{ skillId: 'skill_counseling', skillName: 'Mental Health Counseling', proficiencyLevel: 'expert', certified: true }],
    location: { homeAddress: 'Dugri, Ludhiana', lat: 30.878, lng: 75.847, maxTravelRadius: 25 },
    impactScore: 1560,
    tasksCompleted: 62,
    rating: 4.95,
    activeTaskCount: 0,
    lastActiveDaysAgo: 2,
  },
  {
    id: 'vol_005',
    userId: 'user_005',
    orgIds: ['demo_org'],
    status: 'offline',
    profile: { firstName: 'Harpreet', lastName: 'Bains', phone: '+919543210987', languages: ['pa', 'hi'], bio: 'Plumber and water systems expert. Available weekends for community service.' },
    skills: [{ skillId: 'skill_plumbing', skillName: 'Plumbing', proficiencyLevel: 'expert', certified: true }],
    location: { homeAddress: 'Ravi Nagar, Ludhiana', lat: 30.915, lng: 75.843, maxTravelRadius: 10 },
    impactScore: 420,
    tasksCompleted: 18,
    rating: 4.4,
    activeTaskCount: 0,
    lastActiveDaysAgo: 5,
  },
  {
    id: 'vol_006',
    userId: 'user_006',
    orgIds: ['demo_org'],
    status: 'available',
    profile: { firstName: 'Navdeep', lastName: 'Gill', phone: '+919432109876', languages: ['en', 'pa'], bio: 'Food service professional. Experienced in large-scale distribution events.' },
    skills: [{ skillId: 'skill_food_distribution', skillName: 'Food Distribution', proficiencyLevel: 'expert', certified: false }, { skillId: 'skill_logistics', skillName: 'Logistics', proficiencyLevel: 'intermediate', certified: false }],
    location: { homeAddress: 'Sector 7, Ludhiana', lat: 30.901, lng: 75.857, maxTravelRadius: 20 },
    impactScore: 730,
    tasksCompleted: 29,
    rating: 4.7,
    activeTaskCount: 0,
    lastActiveDaysAgo: 3,
  },
];
