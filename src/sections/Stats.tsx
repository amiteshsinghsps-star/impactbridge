import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 1.6, suffix: 'B', prefix: '', label: 'People lack access to basic social services globally', accent: '#fff' },
  { value: 73,  suffix: '%', prefix: '', label: 'Of NGO field data is lost before it can be analyzed', accent: '#ff9900' },
  { value: 91,  suffix: '%', prefix: '', label: 'AI volunteer match accuracy — up from 23% manual', accent: '#44ff88' },
  { value: 2,   suffix: 'h', prefix: '<', label: 'Average response time to critical community needs', accent: '#44aaff' },
];

function AnimatedStat({ stat, inView }: { stat: typeof stats[0]; inView: boolean }) {
  const [display, setDisplay] = useState('0');
  const obj = useRef({ val: 0 });

  useEffect(() => {
    if (!inView) return;
    gsap.to(obj.current, {
      val: stat.value, duration: 1.8, ease: 'power2.out',
      onUpdate: () => {
        const raw = obj.current.val;
        setDisplay(stat.value < 10 && stat.value % 1 !== 0 ? raw.toFixed(1) : Math.floor(raw).toString());
      },
    });
  }, [inView, stat.value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(52px, 5.5vw, 80px)', fontWeight: 400, lineHeight: 1, color: stat.accent, letterSpacing: '0.01em' }}>
        {stat.prefix}{display}{stat.suffix}
      </div>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 400, lineHeight: 1.7, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, maxWidth: '220px' }}>
        {stat.label}
      </p>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: sectionRef.current, start: 'top 75%', onEnter: () => setInView(true), once: true });
      gsap.fromTo('.stat-col', { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stats" style={{
      background: '#000', color: '#fff',
      padding: '100px 40px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        {/* Section label */}
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff', margin: '0 0 64px 0' }}>
          The Problem in Numbers
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-col" style={{
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              padding: '0 48px 0 0',
              marginRight: i < stats.length - 1 ? '48px' : '0',
              opacity: 0,
            }}>
              <AnimatedStat stat={stat} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
