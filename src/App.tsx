import { useEffect, type ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { siteConfig } from './config';
import { useAuth } from './context/AuthContext';

// Landing
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Manifesto from './sections/Manifesto';
import Facilities from './sections/Facilities';
import Observation from './sections/Observation';
import Archives from './sections/Archives';
import Footer from './sections/Footer';
import FacilityDetail from './pages/FacilityDetail';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Coordinator
import Dashboard from './pages/coordinator/Dashboard';
import Needs from './pages/coordinator/Needs';
import Volunteers from './pages/coordinator/Volunteers';
import Analytics from './pages/coordinator/Analytics';
import Settings from './pages/coordinator/Settings';

// Volunteer
import VolunteerHome from './pages/volunteer/VolunteerHome';
import Discover from './pages/volunteer/Discover';
import ImpactProfile from './pages/volunteer/ImpactProfile';

// Reporter
import ReporterHome from './pages/reporter/ReporterHome';

// Shared
import SubmitNeed from './pages/needs/SubmitNeed';
import NotFound from './pages/NotFound';

const HOME_BY_ROLE: Record<string, string> = {
  coordinator: '/dashboard',
  volunteer: '/volunteer',
  reporter: '/reporter',
};

function Home() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'auto', block: 'start' }));
  }, [hash]);

  return (
    <>
      <main>
        <Hero />
        <Stats />
        <Manifesto />
        <Facilities />
        <Observation />
        <Archives />
      </main>
      <Footer />
    </>
  );
}

function RequireAuth({ children, role }: { children: ReactNode; role?: string }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Loading...
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;
  if (role && profile.role !== role) {
    return <Navigate to={HOME_BY_ROLE[profile.role] || '/'} replace />;
  }
  return <>{children}</>;
}

function App() {
  useEffect(() => {
    document.title = siteConfig.siteTitle || 'ImpactBridge';
    document.documentElement.lang = siteConfig.language || 'en';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = siteConfig.siteDescription || '';
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/facility/:slug" element={<FacilityDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Coordinator */}
      <Route path="/dashboard"  element={<RequireAuth role="coordinator"><Dashboard /></RequireAuth>} />
      <Route path="/needs"      element={<RequireAuth role="coordinator"><Needs /></RequireAuth>} />
      <Route path="/volunteers" element={<RequireAuth role="coordinator"><Volunteers /></RequireAuth>} />
      <Route path="/analytics"  element={<RequireAuth role="coordinator"><Analytics /></RequireAuth>} />
      <Route path="/settings"   element={<RequireAuth role="coordinator"><Settings /></RequireAuth>} />

      {/* Volunteer */}
      <Route path="/volunteer"          element={<RequireAuth role="volunteer"><VolunteerHome /></RequireAuth>} />
      <Route path="/volunteer/discover" element={<RequireAuth role="volunteer"><Discover /></RequireAuth>} />
      <Route path="/volunteer/tasks"    element={<RequireAuth role="volunteer"><Discover /></RequireAuth>} />
      <Route path="/volunteer/impact"   element={<RequireAuth role="volunteer"><ImpactProfile /></RequireAuth>} />

      {/* Reporter */}
      <Route path="/reporter" element={<RequireAuth role="reporter"><ReporterHome /></RequireAuth>} />

      {/* Shared — any authenticated user */}
      <Route path="/needs/submit" element={<RequireAuth><SubmitNeed /></RequireAuth>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
