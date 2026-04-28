import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';

const BADGES = [
  { icon: '◈', label: 'First Responder', desc: 'Completed first critical task', earned: true },
  { icon: '◉', label: 'Medical Hero', desc: '10+ medical tasks completed', earned: true },
  { icon: '◎', label: 'Community Pillar', desc: '25+ tasks completed', earned: true },
  { icon: '○', label: 'Century Maker', desc: '100 tasks completed', earned: false },
  { icon: '◐', label: 'Crisis Commander', desc: 'Deployed during emergency', earned: true },
  { icon: '◑', label: 'Streak Master', desc: '10-week activity streak', earned: false },
];

const SKILL_DATA = [
  { name: 'Adult Education', tasks: 28, pct: 60 },
  { name: 'First Aid', tasks: 12, pct: 26 },
  { name: 'Food Distribution', tasks: 5, pct: 10 },
  { name: 'Community Outreach', tasks: 2, pct: 4 },
];

const ACTIVITY = [
  { month: 'Nov', tasks: 3 },
  { month: 'Dec', tasks: 7 },
  { month: 'Jan', tasks: 12 },
  { month: 'Feb', tasks: 8 },
  { month: 'Mar', tasks: 11 },
  { month: 'Apr', tasks: 6 },
];

export default function ImpactProfile() {
  const { profile } = useAuth();
  const headerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.4 + i * 0.1, transformOrigin: 'left' });
      });
    });
    return () => ctx.revert();
  }, []);

  const maxTasks = Math.max(...ACTIVITY.map(a => a.tasks));

  return (
    <AppShell>
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: '48px', opacity: 0 }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', margin: '0 0 8px 0' }}>Volunteer</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(28px, 4vw, 52px)', color: '#fff', textTransform: 'uppercase', margin: 0, lineHeight: 0.96 }}>
            Impact Profile
          </h1>
        </div>

        {/* Level + Score */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '40px', marginBottom: '24px', display: 'flex', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '72px', color: '#fff', lineHeight: 1 }}>1,240</div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '8px 0 0 0' }}>Impact Points</p>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.1em' }}>Silver</span>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.1em' }}>Gold → 2,000</span>
            </div>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '62%', background: '#fff', transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '24px' }}>
              {[
                { label: 'Name', value: `${profile?.firstName || 'Amandeep'} ${profile?.lastName || 'Singh'}` },
                { label: 'Tasks', value: '47' },
                { label: 'Rating', value: '4.9★' },
                { label: 'People Helped', value: '312' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '16px', color: '#fff', fontFamily: s.label === 'Name' ? "'IBM Plex Mono', monospace" : "'Geist Pixel', monospace" }}>{s.value}</div>
                  <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#fff', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Skills Breakdown */}
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>Skills Utilization</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SKILL_DATA.map((skill, i) => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#fff' }}>{skill.name}</span>
                    <span style={{ fontSize: '11px', color: '#fff' }}>{skill.tasks} tasks</span>
                  </div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      ref={el => { barRefs.current[i] = el; }}
                      style={{ height: '100%', width: `${skill.pct}%`, background: '#fff' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>6-Month Activity</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
              {ACTIVITY.map((a) => (
                <div key={a.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '9px', color: '#fff', fontFamily: "'Geist Pixel', monospace" }}>{a.tasks}</span>
                  <div style={{ width: '100%', background: '#fff', height: `${(a.tasks / maxTasks) * 70}px`, transition: 'height 0.8s ease' }} />
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#fff' }}>{a.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px', marginBottom: '16px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>Achievements</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {BADGES.map((badge) => (
              <div
                key={badge.label}
                style={{
                  padding: '16px',
                  border: `1px solid ${badge.earned ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  opacity: badge.earned ? 1 : 0.35,
                  transition: 'opacity 0.2s',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px', color: badge.earned ? '#fff' : '#fff' }}>{badge.icon}</div>
                <div style={{ fontSize: '11px', color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{badge.label}</div>
                <div style={{ fontSize: '9px', color: '#fff', lineHeight: 1.5 }}>{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Testimonials */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>Community Testimonials</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { quote: '"Sir ji came on time and taught our whole group. The children now know how to read. God bless him."', from: '— Community member, Sarabha Nagar' },
              { quote: '"He was very patient and explained everything clearly. We learned so much in just 4 sessions."', from: '— Program beneficiary, Ludhiana' },
            ].map((t, i) => (
              <div key={i} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.7, margin: '0 0 12px 0', fontStyle: 'italic' }}>{t.quote}</p>
                <p style={{ fontSize: '10px', color: '#fff', margin: 0 }}>{t.from}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
