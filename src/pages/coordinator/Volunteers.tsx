import { useState } from 'react';
import AppShell from '../../components/AppShell';
import { useVolunteers, type Volunteer } from '../../hooks/useVolunteers';

const STATUS_COLOR: Record<string, string> = {
  available: '#44ff88', deployed: '#ffcc00', offline: '#fff', suspended: '#ff5555',
};

function VolunteerCard({ vol }: { vol: Volunteer }) {
  const [hov, setHov] = useState(false);
  const initials = `${vol.profile.firstName[0]}${vol.profile.lastName[0]}`;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? '#fff' : 'rgba(255,255,255,0.08)'}`,
        padding: '24px',
        background: hov ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
        transition: 'border-color 0.2s, background 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', fontFamily: "'Geist Pixel', monospace", flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#fff', margin: 0, letterSpacing: '0.02em' }}>{vol.profile.firstName} {vol.profile.lastName}</p>
            <p style={{ fontSize: '10px', color: '#fff', margin: '3px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {vol.profile.languages.map(l => l.toUpperCase()).join(' · ')}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLOR[vol.status], boxShadow: vol.status === 'available' ? `0 0 6px ${STATUS_COLOR[vol.status]}` : 'none' }} />
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: STATUS_COLOR[vol.status] }}>{vol.status}</span>
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: '11px', color: '#fff', lineHeight: 1.7, margin: 0 }}>{vol.profile.bio}</p>

      {/* Skill tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {vol.skills.map(skill => (
          <span key={skill.skillId} style={{
            fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em',
            border: `1px solid ${skill.certified ? 'rgba(68,255,136,0.35)' : 'rgba(255,255,255,0.1)'}`,
            color: skill.certified ? '#44ff88' : '#fff',
            padding: '3px 9px', background: skill.certified ? 'rgba(68,255,136,0.06)' : 'transparent',
          }}>
            {skill.skillName}{skill.certified ? ' ✓' : ''}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        {[
          { label: 'Tasks', value: vol.tasksCompleted },
          { label: 'Rating', value: `${vol.rating}★` },
          { label: 'Impact', value: vol.impactScore.toLocaleString() },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '18px', color: '#fff', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginTop: '5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {vol.lastActiveDaysAgo > 14 && (
        <div style={{ padding: '9px 12px', background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.18)' }}>
          <p style={{ fontSize: '10px', color: '#ff8888', margin: 0 }}>⚠ Inactive {vol.lastActiveDaysAgo} days — retention risk</p>
        </div>
      )}
    </div>
  );
}

export default function Volunteers() {
  const { volunteers, loading } = useVolunteers();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = volunteers.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    const name = `${v.profile.firstName} ${v.profile.lastName}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase()) && !v.skills.some(s => s.skillName.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const counts = {
    total: volunteers.length,
    available: volunteers.filter(v => v.status === 'available').length,
    deployed: volunteers.filter(v => v.status === 'deployed').length,
    atRisk: volunteers.filter(v => v.lastActiveDaysAgo > 14).length,
  };

  return (
    <AppShell>
      <div style={{ padding: '32px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 6px 0' }}>Coordinator · MatchMind</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(22px, 2.4vw, 34px)', color: '#fff', textTransform: 'uppercase', margin: '0 0 28px 0' }}>Volunteer Roster</h1>

          {/* Stat row */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '28px' }}>
            {[
              { label: 'Total', value: counts.total, color: '#fff' },
              { label: 'Available', value: counts.available, color: '#44ff88' },
              { label: 'Deployed', value: counts.deployed, color: '#ffcc00' },
              { label: 'At Risk', value: counts.atRisk, color: '#ff8888' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, padding: '18px 24px', border: '1px solid rgba(255,255,255,0.08)', borderLeft: i > 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '30px', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by name or skill…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #fff', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', padding: '6px 0', outline: 'none', width: '220px' }} />
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'available', 'deployed', 'offline'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '5px 12px', background: statusFilter === s ? '#fff' : 'transparent', color: statusFilter === s ? '#000' : '#fff', border: `1px solid ${statusFilter === s ? '#fff' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", transition: 'all 0.15s' }}>
                  {s}
                </button>
              ))}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#fff' }}>{filtered.length} volunteers</span>
          </div>
        </div>

        {loading
          ? <div style={{ textAlign: 'center', padding: '80px', color: '#fff', fontSize: '12px' }}>Loading volunteers…</div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {filtered.map(vol => <VolunteerCard key={vol.id} vol={vol} />)}
            </div>
        }
      </div>
    </AppShell>
  );
}
