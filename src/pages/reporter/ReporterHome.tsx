import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import AppShell from '../../components/AppShell';
import { useNeeds } from '../../hooks/useNeeds';
import { useAuth } from '../../context/AuthContext';

const URGENCY_COLOR: Record<string, string> = {
  critical: '#ff5555', high: '#ff9900', medium: '#ffcc00', low: '#44ff88',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Submitted', matching: 'Finding volunteer', assigned: 'Volunteer assigned',
  in_progress: 'In progress', completed: 'Resolved ✓', closed: 'Closed',
};

export default function ReporterHome() {
  const { profile } = useAuth();
  const { needs } = useNeeds();
  const headerRef = useRef<HTMLDivElement>(null);

  const myNeeds = needs.filter(n => n.submittedBy === profile?.uid || n.submittedBy === 'anonymous').slice(0, 10);

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }, []);

  return (
    <AppShell>
      <div style={{ padding: '32px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <div ref={headerRef} style={{ marginBottom: '40px', opacity: 0 }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 6px 0' }}>Community Reporter</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(24px, 3vw, 38px)', color: '#fff', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
            {profile?.firstName ? `Welcome, ${profile.firstName}` : 'Report Hub'}
          </h1>
          <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.7, margin: 0 }}>
            Submit community needs and track their resolution in real time.
          </p>
        </div>

        {/* Submit CTA */}
        <div style={{ border: '1px solid rgba(255,255,255,0.12)', padding: '28px 32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 6px 0' }}>Report a community need</p>
            <p style={{ fontSize: '11px', color: '#fff', margin: 0 }}>Via photo, voice, or form — Gemini processes it instantly</p>
          </div>
          <Link to="/needs/submit">
            <button style={{ padding: '12px 28px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              + Submit Need
            </button>
          </Link>
        </div>

        {/* How it works */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '40px' }}>
          {[
            { step: '01', title: 'Submit', desc: 'Report via form, photo of paper survey, or voice message' },
            { step: '02', title: 'AI Processes', desc: 'Gemini extracts details, categorizes and scores urgency automatically' },
            { step: '03', title: 'Track', desc: 'See when a volunteer is matched and the need is resolved' },
          ].map(s => (
            <div key={s.step} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
              <p style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '22px', color: '#fff', margin: '0 0 10px 0' }}>{s.step}</p>
              <p style={{ fontSize: '12px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>{s.title}</p>
              <p style={{ fontSize: '11px', color: '#fff', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* My submitted needs */}
        <div>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#fff', margin: '0 0 16px 0' }}>
            Recent Submissions
          </p>
          {myNeeds.length === 0 ? (
            <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: '#fff', fontSize: '12px' }}>
              No submissions yet. Submit your first community need above.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myNeeds.map(need => (
                <div key={need.id} style={{ padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: URGENCY_COLOR[need.urgencyLevel], marginTop: '4px', flexShrink: 0, boxShadow: `0 0 5px ${URGENCY_COLOR[need.urgencyLevel]}` }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 5px 0', lineHeight: 1.4 }}>{need.description.slice(0, 100)}{need.description.length > 100 ? '…' : ''}</p>
                    <p style={{ fontSize: '10px', color: '#fff', margin: 0 }}>{need.category.replace('_', ' ')} · {need.location.formattedAddress}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: need.status === 'completed' ? '#44ff88' : need.status === 'assigned' || need.status === 'in_progress' ? '#44aaff' : '#fff', border: `1px solid ${need.status === 'completed' ? 'rgba(68,255,136,0.3)' : 'rgba(255,255,255,0.12)'}`, padding: '3px 10px', display: 'inline-block' }}>
                      {STATUS_LABEL[need.status] || need.status}
                    </span>
                    {need.assignedVolunteerName && (
                      <p style={{ fontSize: '10px', color: '#fff', margin: '5px 0 0 0' }}>👤 {need.assignedVolunteerName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
