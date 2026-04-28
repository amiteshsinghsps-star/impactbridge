import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { useNeeds, type Need } from '../../hooks/useNeeds';

const URGENCY_COLOR: Record<string, string> = {
  critical: '#ff5555', high: '#ff9900', medium: '#ffcc00', low: '#44ff88',
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  pending:     { color: '#fff',  bg: 'rgba(255,255,255,0.06)',  border: 'rgba(255,255,255,0.1)' },
  matching:    { color: '#ffcc00',                bg: 'rgba(255,204,0,0.08)',    border: 'rgba(255,204,0,0.2)' },
  assigned:    { color: '#44aaff',                bg: 'rgba(68,170,255,0.08)',   border: 'rgba(68,170,255,0.2)' },
  in_progress: { color: '#44aaff',                bg: 'rgba(68,170,255,0.1)',    border: 'rgba(68,170,255,0.25)' },
  completed:   { color: '#44ff88',                bg: 'rgba(68,255,136,0.06)',   border: 'rgba(68,255,136,0.15)' },
  closed:      { color: '#fff',  bg: 'transparent',             border: 'rgba(255,255,255,0.06)' },
};

function NeedCard({ need }: { need: Need }) {
  const [hov, setHov] = useState(false);
  const ss = STATUS_STYLE[need.status] || STATUS_STYLE.pending;
  const age = Math.round((Date.now() - (need.createdAt instanceof Date ? need.createdAt.getTime() : Date.now() - 7200000)) / 3600000);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? '#fff' : 'rgba(255,255,255,0.08)'}`,
        padding: '22px 24px',
        background: hov ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
        transition: 'border-color 0.2s, background 0.2s',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: URGENCY_COLOR[need.urgencyLevel], boxShadow: `0 0 6px ${URGENCY_COLOR[need.urgencyLevel]}70` }} />
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: URGENCY_COLOR[need.urgencyLevel], fontWeight: 500 }}>{need.urgencyLevel}</span>
          <span style={{ fontSize: '10px', color: '#fff' }}>·</span>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>{need.category.replace('_', ' ')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: '#fff' }}>{age}h ago</span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, padding: '3px 9px' }}>
            {need.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.65, margin: 0 }}>
        {need.description.slice(0, 140)}{need.description.length > 140 ? '…' : ''}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#fff' }}>📍 {need.location.formattedAddress}</span>
        <span style={{ fontSize: '11px', color: '#fff' }}>👥 {need.beneficiaryCount} people</span>
        {need.assignedVolunteerName && (
          <span style={{ fontSize: '11px', color: '#44aaff' }}>👤 {need.assignedVolunteerName}</span>
        )}
        <span style={{ fontSize: '11px', fontFamily: "'Geist Pixel', monospace", color: URGENCY_COLOR[need.urgencyLevel], marginLeft: 'auto' }}>
          {need.urgencyScore}/100
        </span>
      </div>

      {/* Tags */}
      {need.specificRequirements.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {need.specificRequirements.map((req, i) => (
            <span key={i} style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 9px', background: 'rgba(255,255,255,0.03)' }}>
              {req}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_FILTERS = ['all', 'pending', 'matching', 'assigned', 'in_progress', 'completed'];
const URGENCY_FILTERS = ['all', 'critical', 'high', 'medium', 'low'];

export default function Needs() {
  const { needs, loading } = useNeeds();
  const [filter, setFilter] = useState('all');
  const [urgency, setUrgency] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = needs.filter(n => {
    if (filter !== 'all' && n.status !== filter) return false;
    if (urgency !== 'all' && n.urgencyLevel !== urgency) return false;
    if (search && !n.description.toLowerCase().includes(search.toLowerCase()) && !n.category.includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div style={{ padding: '32px 40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 6px 0' }}>Coordinator · NeedsScan</p>
            <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(22px, 2.4vw, 34px)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Needs Management</h1>
          </div>
          <Link to="/needs/submit">
            <button style={{ padding: '11px 26px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              + Submit Need
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <input
            type="text"
            placeholder="Search needs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #fff', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', padding: '6px 0', outline: 'none', width: '200px' }}
          />
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '5px 12px', background: filter === s ? '#fff' : 'transparent', color: filter === s ? '#000' : '#fff', border: `1px solid ${filter === s ? '#fff' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", transition: 'all 0.15s' }}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {URGENCY_FILTERS.map(u => (
              <button key={u} onClick={() => setUrgency(u)} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '5px 12px', background: urgency === u ? (u === 'all' ? '#fff' : URGENCY_COLOR[u]) : 'transparent', color: urgency === u ? '#000' : (u === 'all' ? '#fff' : URGENCY_COLOR[u]), border: `1px solid ${u === 'all' ? 'rgba(255,255,255,0.1)' : URGENCY_COLOR[u] + '55'}`, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", transition: 'all 0.15s' }}>
                {u}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#fff', marginLeft: 'auto' }}>{filtered.length} needs</span>
        </div>

        {loading
          ? <div style={{ textAlign: 'center', padding: '80px', color: '#fff', fontSize: '12px' }}>Loading needs…</div>
          : filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '80px', color: '#fff', fontSize: '12px' }}>No needs match your filters.</div>
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '12px' }}>
                {filtered.sort((a, b) => b.urgencyScore - a.urgencyScore).map(need => <NeedCard key={need.id} need={need} />)}
              </div>
            )
        }
      </div>
    </AppShell>
  );
}
