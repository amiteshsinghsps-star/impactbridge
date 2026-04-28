import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { manifestoConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo(rightRef.current, { opacity: 0, x: 40 }, {
        opacity: 1, x: 0, duration: 1.1, ease: 'power2.out', delay: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="manifesto" style={{
      background: '#fff', color: '#000',
      padding: '120px 40px',
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

        {/* Left — video + key facts */}
        <div ref={leftRef} style={{ opacity: 0 }}>
          {manifestoConfig.videoPath && (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#000', marginBottom: '32px' }}>
              <video autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                <source src={manifestoConfig.videoPath} type="video/mp4" />
              </video>
            </div>
          )}
          {/* Key stats on white */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', border: '1px solid #000' }}>
            {[
              { label: 'NGOs onboarded target', value: '5,000' },
              { label: 'Volunteers coordinated', value: '250K' },
              { label: 'Match accuracy target', value: '91%' },
              { label: 'Languages supported', value: '47' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '20px 24px', borderRight: i % 2 === 0 ? '1px solid #000' : 'none', borderBottom: i < 2 ? '1px solid #000' : 'none' }}>
                <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '28px', color: '#000', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — manifesto text */}
        <div ref={rightRef} style={{ opacity: 0 }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)', margin: '0 0 24px 0' }}>
            Our Mission
          </p>
          <h2 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(28px, 2.8vw, 42px)', color: '#000', textTransform: 'uppercase', margin: '0 0 32px 0', lineHeight: 1.05 }}>
            NO COMMUNITY NEED GOES UNADDRESSED
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 2, color: 'rgba(0,0,0,0.78)', margin: '0 0 32px 0' }}>
            {manifestoConfig.text}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Gemini 2.5 Pro multimodal AI — photo, voice, SMS, WhatsApp',
              'Offline-first Flutter app — works in zero-connectivity areas',
              'Real-time volunteer matching in under 90 seconds',
            ].map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.3)', marginTop: '2px', flexShrink: 0 }}>0{i + 1}</span>
                <p style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(0,0,0,0.65)', margin: 0 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
