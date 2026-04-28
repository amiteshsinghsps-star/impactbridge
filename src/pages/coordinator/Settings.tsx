import { useState } from 'react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';

const FACTOR_WEIGHTS = [
  { key: 'skill', label: 'Skill Match', default: 30, desc: 'How well volunteer skills match need requirements' },
  { key: 'proximity', label: 'Geographic Proximity', default: 25, desc: 'Distance between volunteer and need location' },
  { key: 'availability', label: 'Availability Window', default: 20, desc: 'Overlap between volunteer availability and need deadline' },
  { key: 'impact', label: 'Past Impact Score', default: 10, desc: 'Historical task completion and community ratings' },
  { key: 'workload', label: 'Current Workload', default: 10, desc: 'Number of active tasks volunteer is handling' },
  { key: 'language', label: 'Language Match', default: 5, desc: 'Shared language with community' },
];

const SETTINGS_KEY = 'impactbridge_settings';

function loadSettings(_orgName: string) {
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function Settings() {
  const { profile } = useAuth();
  const saved0 = loadSettings(profile?.organizationName || '');
  const [orgName, setOrgName] = useState(saved0?.orgName ?? profile?.organizationName ?? 'Demo Organization');
  const [coverage, setCoverage] = useState(saved0?.coverage ?? 'Ludhiana, Punjab');
  const [weights, setWeights] = useState<Record<string, number>>(
    saved0?.weights ?? Object.fromEntries(FACTOR_WEIGHTS.map(f => [f.key, f.default]))
  );
  const [notifications, setNotifications] = useState(saved0?.notifications ?? {
    email: true, push: true, sms: false, whatsapp: false, criticalOnly: false,
  });
  const [saved, setSaved] = useState(false);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ orgName, coverage, weights, notifications }));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    padding: '12px 0',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#fff',
    marginBottom: '8px',
  };

  return (
    <AppShell>
      <div style={{ padding: '40px', maxWidth: '800px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', margin: '0 0 8px 0' }}>Coordinator</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(24px, 3vw, 40px)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
            Settings
          </h1>
        </div>

        {/* Organization Profile */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 32px 0', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            Organization Profile
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <label style={labelStyle}>Organization Name</label>
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
            </div>
            <div>
              <label style={labelStyle}>Coverage Zones</label>
              <input type="text" value={coverage} onChange={e => setCoverage(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>SDG Focus Areas</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['SDG 1', 'SDG 3', 'SDG 10', 'SDG 11', 'SDG 17'].map(sdg => (
                <div key={sdg} style={{ padding: '6px 14px', border: '1px solid #fff', fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {sdg}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notification Rules */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 32px 0', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            Notification Channels
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'email', label: 'Email Notifications' },
              { key: 'push', label: 'Push Notifications' },
              { key: 'sms', label: 'SMS Alerts (via Twilio)' },
              { key: 'whatsapp', label: 'WhatsApp Notifications' },
              { key: 'criticalOnly', label: 'Critical Urgency Only' },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '13px', color: '#fff' }}>{n.label}</span>
                <button
                  onClick={() => setNotifications((prev: typeof notifications) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifications] }))}
                  style={{
                    width: '44px',
                    height: '22px',
                    background: notifications[n.key as keyof typeof notifications] ? '#fff' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '11px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: notifications[n.key as keyof typeof notifications] ? '25px' : '3px',
                    width: '16px',
                    height: '16px',
                    background: notifications[n.key as keyof typeof notifications] ? '#000' : '#fff',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MatchMind Configuration */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 8px 0', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            MatchMind Algorithm Weights
          </h2>
          <p style={{ fontSize: '11px', color: '#fff', margin: '0 0 32px 0' }}>
            Adjust how the AI prioritizes matching factors. Total must equal 100%.{' '}
            <span style={{ color: totalWeight === 100 ? '#44ff88' : '#ff4444' }}>
              Current: {totalWeight}%
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {FACTOR_WEIGHTS.map(factor => (
              <div key={factor.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#fff' }}>{factor.label}</span>
                    <span style={{ fontSize: '10px', color: '#fff', marginLeft: '12px' }}>{factor.desc}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#fff', fontFamily: "'Geist Pixel', monospace" }}>{weights[factor.key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={weights[factor.key]}
                  onChange={e => setWeights(prev => ({ ...prev, [factor.key]: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#fff', height: '2px' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Data Management */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 32px 0', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            Data Management
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Export All Data (GDPR)', 'Download Audit Log', 'Configure Data Retention', 'Manage API Keys'].map(action => (
              <button key={action} style={{ padding: '10px 20px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              >
                {action}
              </button>
            ))}
          </div>
        </section>

        {/* Save */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            style={{ padding: '14px 40px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
          >
            Save Changes
          </button>
          {saved && (
            <span style={{ fontSize: '11px', color: '#44ff88', animation: 'fadeInUp 0.3s ease' }}>
              ✓ Settings saved
            </span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
