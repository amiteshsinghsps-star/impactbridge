import { useState, useMemo } from 'react';
import AppShell from '../../components/AppShell';
import { useNeeds, type Need } from '../../hooks/useNeeds';

const URGENCY_COLOR: Record<string, string> = {
  critical: '#ff5555', high: '#ff9900', medium: '#ffcc00', low: '#44ff88',
};

// Volunteer home coords (Sarabha Nagar, Ludhiana)
const HOME_LAT = 30.888;
const HOME_LNG = 75.831;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const INTERESTS_KEY = 'impactbridge_interests';
function loadInterests(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(INTERESTS_KEY) || '[]')); } catch { return new Set(); }
}
function saveInterest(id: string) {
  try {
    const s = loadInterests();
    s.add(id);
    localStorage.setItem(INTERESTS_KEY, JSON.stringify([...s]));
  } catch {}
}

function NeedListItem({ need, distKm, alreadyInterested, onInterest }: {
  need: Need; distKm: number; alreadyInterested: boolean; onInterest: (id: string) => void;
}) {
  const [hov, setHov] = useState(false);
  const [interested, setInterested] = useState(alreadyInterested);

  const handleInterest = () => {
    setInterested(true);
    saveInterest(need.id);
    onInterest(need.id);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '16px',
        padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: hov ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background 0.15s', alignItems: 'start',
      }}
    >
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: URGENCY_COLOR[need.urgencyLevel], marginTop: '5px', flexShrink: 0, boxShadow: `0 0 6px ${URGENCY_COLOR[need.urgencyLevel]}60` }} />
      <div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: URGENCY_COLOR[need.urgencyLevel], fontWeight: 500 }}>{need.urgencyLevel}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fff' }}>{need.category.replace('_', ' ')}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span style={{ fontSize: '10px', color: '#fff' }}>{distKm.toFixed(1)} km away</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span style={{ fontSize: '10px', color: '#fff' }}>👥 {need.beneficiaryCount}</span>
        </div>
        <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 7px 0', lineHeight: 1.55 }}>{need.description}</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0' }}>📍 {need.location.formattedAddress}</p>
        {need.specificRequirements.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {need.specificRequirements.map((r, i) => (
              <span key={i} style={{ fontSize: '9px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '2px 8px' }}>{r}</span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleInterest}
        disabled={interested}
        style={{
          padding: '9px 18px', marginTop: '4px',
          background: interested ? 'rgba(68,255,136,0.1)' : 'transparent',
          color: interested ? '#44ff88' : '#fff',
          border: `1px solid ${interested ? '#44ff88' : 'rgba(255,255,255,0.3)'}`,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          cursor: interested ? 'default' : 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
        }}
      >
        {interested ? '✓ Applied' : 'Express Interest'}
      </button>
    </div>
  );
}

export default function Discover() {
  const { needs, loading } = useNeeds();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [category, setCategory] = useState('all');
  const [urgency, setUrgency] = useState('all');
  const [search, setSearch] = useState('');
  const [interests, setInterests] = useState<Set<string>>(loadInterests);

  const openNeeds = needs.filter(n => n.status === 'pending' || n.status === 'matching');

  const needsWithDist = useMemo(() =>
    openNeeds.map(n => ({
      need: n,
      distKm: haversineKm(HOME_LAT, HOME_LNG, n.location.lat, n.location.lng),
    })).sort((a, b) => a.distKm - b.distKm),
  [openNeeds]);

  const filtered = needsWithDist.filter(({ need }) => {
    if (category !== 'all' && need.category !== category) return false;
    if (urgency !== 'all' && need.urgencyLevel !== urgency) return false;
    if (search && !need.description.toLowerCase().includes(search.toLowerCase()) && !need.category.includes(search.toLowerCase())) return false;
    return true;
  });

  const categories = ['all', ...Array.from(new Set(needs.map(n => n.category)))];

  const handleInterest = (id: string) => setInterests(prev => new Set([...prev, id]));

  // Pin positions based on actual lat/lng relative to Ludhiana bounds
  const mapNeeds = filtered.slice(0, 8).map(({ need }) => ({
    need,
    x: ((need.location.lng - 75.81) / 0.07) * 80 + 10,
    y: ((30.93 - need.location.lat) / 0.07) * 70 + 10,
  }));

  return (
    <AppShell>
      <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 4px 0' }}>Volunteer · MatchMind</p>
            <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '26px', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Discover Needs</h1>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['list', 'map'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '8px 16px', background: view === v ? '#fff' : 'transparent', color: view === v ? '#000' : '#fff', border: `1px solid ${view === v ? '#fff' : 'rgba(255,255,255,0.15)'}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s' }}>
                {v === 'list' ? '≡ List' : '⊞ Map'}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '12px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.01)' }}>
          <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', padding: '5px 0', outline: 'none', width: '160px' }} />

          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', padding: '6px 10px', outline: 'none', textTransform: 'uppercase', cursor: 'pointer' }}>
            {categories.map(c => <option key={c} value={c} style={{ background: '#111' }}>{c.replace(/_/g, ' ')}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'critical', 'high', 'medium', 'low'].map(u => (
              <button key={u} onClick={() => setUrgency(u)} style={{ fontSize: '10px', textTransform: 'uppercase', padding: '5px 10px', background: urgency === u ? (u === 'all' ? '#fff' : URGENCY_COLOR[u]) : 'transparent', color: urgency === u ? '#000' : u === 'all' ? '#fff' : URGENCY_COLOR[u], border: `1px solid ${u === 'all' ? 'rgba(255,255,255,0.15)' : URGENCY_COLOR[u] + '66'}`, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", transition: 'all 0.15s' }}>
                {u}
              </button>
            ))}
          </div>

          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#fff' }}>{filtered.length} needs · sorted by distance</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#fff', fontSize: '12px' }}>Loading needs…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#fff', fontSize: '12px' }}>No open needs match your filters.</div>
          ) : view === 'list' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '16px', padding: '9px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['', 'Need · Location · Requirements', 'Action'].map(h => (
                  <span key={h} style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff' }}>{h}</span>
                ))}
              </div>
              {filtered.map(({ need, distKm }) => (
                <NeedListItem key={need.id} need={need} distKm={distKm} alreadyInterested={interests.has(need.id)} onInterest={handleInterest} />
              ))}
            </>
          ) : (
            // Map view — pins based on real lat/lng
            <div style={{ position: 'relative', width: '100%', height: '100%', background: '#080808' }}>
              {/* Grid lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
                {[...Array(10)].map((_, i) => <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#fff" strokeWidth="1" />)}
                {[...Array(8)].map((_, i) => <line key={`h${i}`} x1="0" y1={`${i * 12.5}%`} x2="100%" y2={`${i * 12.5}%`} stroke="#fff" strokeWidth="1" />)}
              </svg>

              {/* Location label */}
              <p style={{ position: 'absolute', bottom: '16px', right: '20px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: 0 }}>
                Ludhiana, Punjab · Live Need Map
              </p>

              {/* Pins */}
              {mapNeeds.map(({ need, x, y }) => (
                <div key={need.id} title={need.description}
                  style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 5 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: URGENCY_COLOR[need.urgencyLevel], boxShadow: `0 0 10px ${URGENCY_COLOR[need.urgencyLevel]}`, border: '2px solid rgba(0,0,0,0.5)' }} />
                </div>
              ))}

              {/* Legend */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.7)', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {Object.entries(URGENCY_COLOR).map(([u, c]) => (
                  <div key={u} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.08em' }}>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
