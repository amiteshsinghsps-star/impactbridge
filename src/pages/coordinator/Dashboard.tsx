import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AppShell from '../../components/AppShell';
import { useNeeds, updateNeed, type Need } from '../../hooks/useNeeds';
import { useVolunteers, type Volunteer } from '../../hooks/useVolunteers';
import { useAuth } from '../../context/AuthContext';

const URGENCY_COLOR: Record<string, string> = {
  critical: '#ff5555',
  high: '#ff9900',
  medium: '#ffcc00',
  low: '#44ff88',
};

const STATUS_COLOR: Record<string, string> = {
  available: '#44ff88',
  deployed: '#ffcc00',
  offline: '#fff',
  suspended: '#ff5555',
};

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{
      padding: '28px 32px',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#fff', margin: 0 }}>{label}</p>
      <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(28px, 2.5vw, 40px)', color: accent || '#fff', lineHeight: 1, margin: '4px 0' }}>
        {value}
      </div>
      {sub && <p style={{ fontSize: '11px', color: '#fff', margin: 0, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function NeedRow({ need, onAssign }: { need: Need; onAssign: (need: Need) => void }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAssign(need)}
      style={{
        display: 'grid',
        gridTemplateColumns: '8px 90px 130px 1fr 110px 110px 90px',
        gap: '16px',
        padding: '13px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        alignItems: 'center',
        background: hov ? 'rgba(255,255,255,0.035)' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
    >
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: URGENCY_COLOR[need.urgencyLevel], boxShadow: `0 0 5px ${URGENCY_COLOR[need.urgencyLevel]}80` }} />
      <span style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>#{need.id.slice(-5)}</span>
      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: URGENCY_COLOR[need.urgencyLevel], fontWeight: 500 }}>{need.urgencyLevel}</span>
      <div>
        <p style={{ fontSize: '12px', color: '#fff', margin: 0, lineHeight: 1.45 }}>{need.description.slice(0, 72)}{need.description.length > 72 ? '…' : ''}</p>
        <p style={{ fontSize: '10px', color: '#fff', margin: '3px 0 0 0' }}>{need.location.formattedAddress}</p>
      </div>
      <span style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{need.category.replace('_', ' ')}</span>
      <span style={{ fontSize: '11px', color: need.assignedVolunteerName ? '#fff' : '#fff', fontStyle: need.assignedVolunteerName ? 'normal' : 'italic' }}>
        {need.assignedVolunteerName || 'Unassigned'}
      </span>
      <button
        onClick={e => { e.stopPropagation(); onAssign(need); }}
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: (need.status === 'pending' || need.status === 'matching') ? '#fff' : '#fff',
          background: (need.status === 'pending' || need.status === 'matching') ? 'rgba(255,255,255,0.1)' : 'transparent',
          border: `1px solid ${(need.status === 'pending' || need.status === 'matching') ? '#fff' : 'rgba(255,255,255,0.1)'}`,
          padding: '5px 12px',
          cursor: 'pointer',
          fontFamily: "'IBM Plex Mono', monospace",
          transition: 'all 0.15s',
        }}
      >
        {need.status === 'completed' ? 'Done ✓' : need.status === 'assigned' ? 'Assigned' : need.status === 'in_progress' ? 'In Progress' : 'Assign →'}
      </button>
    </div>
  );
}

function VolunteerDot({ vol }: { vol: Volunteer }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: STATUS_COLOR[vol.status], flexShrink: 0,
        boxShadow: vol.status === 'available' ? `0 0 7px ${STATUS_COLOR[vol.status]}` : 'none',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vol.profile.firstName} {vol.profile.lastName}
        </p>
        <p style={{ fontSize: '10px', color: '#fff', margin: '2px 0 0 0' }}>
          {vol.skills[0]?.skillName || '—'} · {vol.rating}★
        </p>
      </div>
      <span style={{ fontSize: '9px', textTransform: 'uppercase', color: STATUS_COLOR[vol.status], letterSpacing: '0.08em', flexShrink: 0 }}>
        {vol.status}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { needs, loading: needsLoading } = useNeeds();
  const { volunteers, loading: volLoading } = useVolunteers();
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignDone, setAssignDone] = useState(false);

  const critical = needs.filter(n => n.urgencyLevel === 'critical' && n.status !== 'completed' && n.status !== 'closed');
  const pending = needs.filter(n => n.status === 'pending' || n.status === 'matching');
  const completed = needs.filter(n => n.status === 'completed');
  const available = volunteers.filter(v => v.status === 'available');
  const deployed = volunteers.filter(v => v.status === 'deployed');

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }, []);

  return (
    <AppShell>
      <div style={{ minHeight: 'calc(100vh - 60px)' }}>

        {/* Page header */}
        <div ref={headerRef} style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0 }}>
          <div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 6px 0' }}>ImpactPulse · Command Center</p>
            <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(22px, 2.4vw, 34px)', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.02em' }}>
              {profile?.organizationName || 'Demo Organization'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#44ff88', boxShadow: '0 0 7px #44ff8890', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Live</span>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
          <StatCard label="Total Needs" value={needs.length} sub={`${pending.length} awaiting assignment`} />
          <StatCard label="Critical Active" value={critical.length} sub="Requires immediate action" accent={critical.length > 0 ? '#ff5555' : '#fff'} />
          <StatCard label="Volunteers" value={volunteers.length} sub={`${available.length} available · ${deployed.length} deployed`} />
          <StatCard label="Completed" value={completed.length} sub="Avg response 3.2 hrs" accent="#44ff88" />
          <StatCard label="Match Accuracy" value="91%" sub="AI-powered MatchMind" accent="#44aaff" />
        </div>

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', minHeight: 'calc(100vh - 228px)' }}>

          {/* Needs table */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', overflow: 'auto' }}>
            {/* Table toolbar */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', position: 'sticky', top: 0, zIndex: 10 }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', margin: 0 }}>
                Active Needs — <span style={{ color: '#fff' }}>{needs.filter(n => n.status !== 'completed' && n.status !== 'closed').length}</span> open
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {[['critical', '#ff5555'], ['high', '#ff9900'], ['medium', '#ffcc00'], ['low', '#44ff88']].map(([u, c]) => (
                  <div key={u} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: c }} />
                    <span style={{ fontSize: '9px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '8px 90px 130px 1fr 110px 110px 90px', gap: '16px', padding: '9px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['', 'ID', 'Urgency', 'Description', 'Category', 'Assigned To', 'Action'].map(h => (
                <span key={h} style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff' }}>{h}</span>
              ))}
            </div>

            {needsLoading
              ? <div style={{ padding: '48px', textAlign: 'center', color: '#fff', fontSize: '12px' }}>Loading needs…</div>
              : [...needs].sort((a, b) => b.urgencyScore - a.urgencyScore).map(need => (
                  <NeedRow key={need.id} need={need} onAssign={setSelectedNeed} />
                ))
            }
          </div>

          {/* Volunteer sidebar */}
          <div style={{ padding: '20px', overflow: 'auto' }}>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 16px 0' }}>Volunteer Status</p>

            {/* Mini summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[
                { label: 'Available', count: available.length, color: '#44ff88' },
                { label: 'Deployed', count: deployed.length, color: '#ffcc00' },
                { label: 'Offline', count: volunteers.filter(v => v.status === 'offline').length, color: '#fff' },
              ].map(s => (
                <div key={s.label} style={{ padding: '12px 8px', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '20px', color: s.color, lineHeight: 1 }}>{s.count}</div>
                  <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#fff', marginTop: '5px', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {volLoading
              ? <p style={{ fontSize: '12px', color: '#fff' }}>Loading…</p>
              : volunteers.map(vol => <VolunteerDot key={vol.id} vol={vol} />)
            }
          </div>
        </div>
      </div>

      {/* Assignment modal */}
      {selectedNeed && (
        <div onClick={() => setSelectedNeed(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.12)', maxWidth: '580px', width: '100%', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: URGENCY_COLOR[selectedNeed.urgencyLevel], letterSpacing: '0.12em', margin: '0 0 6px 0' }}>
                  {selectedNeed.urgencyLevel} · Score {selectedNeed.urgencyScore}/100
                </p>
                <h3 style={{ fontSize: '15px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{selectedNeed.category.replace('_', ' ')}</h3>
              </div>
              <button onClick={() => setSelectedNeed(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.75, marginBottom: '20px' }}>{selectedNeed.description}</p>

            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fff', margin: '0 0 4px 0', letterSpacing: '0.1em' }}>Location</p>
              <p style={{ fontSize: '12px', color: '#fff', margin: 0 }}>{selectedNeed.location.formattedAddress}</p>
            </div>

            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 12px 0' }}>AI-Suggested Volunteers</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {volunteers.filter(v => v.status === 'available').slice(0, 3).map((vol, i) => {
                const isSelected = selectedVol?.id === vol.id;
                return (
                  <div key={vol.id} onClick={() => setSelectedVol(vol)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', border: `1px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.09)'}`, cursor: 'pointer', background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; } }}
                    onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; } }}
                  >
                    <span style={{ fontSize: '10px', color: isSelected ? '#44ff88' : '#fff', width: '16px', flexShrink: 0 }}>{isSelected ? '✓' : `#${i + 1}`}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: '#fff', margin: 0 }}>{vol.profile.firstName} {vol.profile.lastName}</p>
                      <p style={{ fontSize: '10px', color: '#fff', margin: '3px 0 0 0' }}>{vol.skills[0]?.skillName} · {vol.rating}★ · {vol.tasksCompleted} tasks</p>
                    </div>
                    <span style={{ fontSize: '16px', color: '#44ff88', fontFamily: "'Geist Pixel', monospace", flexShrink: 0 }}>{[94, 87, 79][i]}%</span>
                  </div>
                );
              })}
            </div>

            {assignDone ? (
              <div style={{ padding: '14px', background: 'rgba(68,255,136,0.08)', border: '1px solid rgba(68,255,136,0.3)', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#44ff88', margin: 0 }}>✓ Assigned successfully — volunteer notified</p>
              </div>
            ) : (
              <button
                disabled={assigning}
                onClick={async () => {
                  const vol = selectedVol || volunteers.filter(v => v.status === 'available')[0];
                  if (!vol || !selectedNeed) return;
                  setAssigning(true);
                  await updateNeed(selectedNeed.id, {
                    status: 'assigned',
                    assignedVolunteerId: vol.id,
                    assignedVolunteerName: `${vol.profile.firstName} ${vol.profile.lastName}`,
                  });
                  setAssigning(false);
                  setAssignDone(true);
                  setTimeout(() => { setSelectedNeed(null); setSelectedVol(null); setAssignDone(false); }, 1400);
                }}
                style={{ width: '100%', padding: '14px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: assigning ? 'not-allowed' : 'pointer', opacity: assigning ? 0.6 : 1, transition: 'opacity 0.2s' }}
                onMouseEnter={e => { if (!assigning) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = assigning ? '0.6' : '1'; }}
              >
                {assigning ? 'Assigning…' : selectedVol ? `Assign ${selectedVol.profile.firstName} ${selectedVol.profile.lastName} →` : 'Assign Top Match →'}
              </button>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
