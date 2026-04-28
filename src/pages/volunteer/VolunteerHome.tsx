import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import AppShell from '../../components/AppShell';
import { useNeeds } from '../../hooks/useNeeds';
import { useAuth } from '../../context/AuthContext';

const URGENCY_COLOR: Record<string, string> = {
  critical: '#ff5555', high: '#ff9900', medium: '#ffcc00', low: '#44ff88',
};

export default function VolunteerHome() {
  const { profile } = useAuth();
  const { needs } = useNeeds();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const nearbyNeeds = needs.filter(n => n.status === 'pending' || n.status === 'matching').slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      if (gridRef.current) {
        gsap.fromTo(Array.from(gridRef.current.children), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', delay: 0.25 });
      }
    });
    return () => ctx.revert();
  }, []);

  const card = (children: React.ReactNode, span?: number, extra?: React.CSSProperties) => (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: '28px', gridColumn: span ? `span ${span}` : undefined, ...extra }}>
      {children}
    </div>
  );

  const sectionLabel = (text: string) => (
    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#fff', margin: '0 0 18px 0' }}>{text}</p>
  );

  return (
    <AppShell>
      <div style={{ padding: '32px 40px' }}>

        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: '36px', opacity: 0 }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 8px 0' }}>Volunteer Dashboard</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(26px, 3.5vw, 48px)', color: '#fff', textTransform: 'uppercase', margin: 0, lineHeight: 0.96 }}>
            {(profile?.firstName || 'Volunteer').toUpperCase()}
          </h1>
          <p style={{ fontSize: '12px', color: '#fff', margin: '14px 0 0 0' }}>
            {nearbyNeeds.length} open needs near you · {needs.filter(n => n.status === 'completed').length} completed this month
          </p>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

          {/* Impact score */}
          {card(<>
            {sectionLabel('Impact Score')}
            <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '64px', color: '#fff', lineHeight: 1, marginBottom: '12px' }}>1,240</div>
            <div style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>Silver</span>
                <span style={{ fontSize: '10px', color: '#fff' }}>Gold → 2,000 pts</span>
              </div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: '62%', background: '#fff' }} />
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#fff', margin: '10px 0 0 0' }}>760 points to Gold tier</p>
          </>)}

          {/* Quick stats */}
          {card(<>
            {sectionLabel('Your Stats')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Tasks Done', value: '47' },
                { label: 'Avg Rating', value: '4.9★' },
                { label: 'People Helped', value: '312' },
                { label: 'Active Weeks', value: '8' },
              ].map(s => (
                <div key={s.label} style={{ padding: '14px', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '22px', color: '#fff', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginTop: '5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>)}

          {/* Quick submit */}
          {card(<>
            {sectionLabel('Report a Need')}
            <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.75, marginBottom: '24px' }}>
              Spotted a community need during fieldwork? Submit via photo, voice, or form — Gemini processes it instantly.
            </p>
            <Link to="/needs/submit">
              <button style={{ width: '100%', padding: '13px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                + Submit Need
              </button>
            </Link>
          </>)}

          {/* Nearby needs — full row */}
          {card(<>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              {sectionLabel('Open Needs Near You')}
              <Link to="/volunteer/discover" style={{ fontSize: '11px', color: '#fff', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '1px', marginBottom: '18px' }}>
                View all →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
              {nearbyNeeds.length === 0
                ? <p style={{ fontSize: '12px', color: '#fff', gridColumn: '1/-1' }}>No open needs right now.</p>
                : nearbyNeeds.map(need => (
                    <div key={need.id} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: URGENCY_COLOR[need.urgencyLevel], boxShadow: `0 0 5px ${URGENCY_COLOR[need.urgencyLevel]}70` }} />
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', color: URGENCY_COLOR[need.urgencyLevel], letterSpacing: '0.08em' }}>{need.urgencyLevel}</span>
                        <span style={{ fontSize: '9px', color: '#fff', marginLeft: 'auto' }}>~2.{Math.floor(Math.random()*9)+1} km</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#fff', margin: '0 0 8px 0', lineHeight: 1.5 }}>{need.description.slice(0, 65)}…</p>
                      <p style={{ fontSize: '10px', color: '#fff', margin: '0 0 14px 0' }}>{need.category.replace('_', ' ')}</p>
                      <button style={{ width: '100%', padding: '7px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      >
                        Express Interest
                      </button>
                    </div>
                  ))
              }
            </div>
          </>, 3)}

        </div>
      </div>
    </AppShell>
  );
}
