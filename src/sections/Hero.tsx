import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import AsciiCanvas from '../components/AsciiCanvas';
import { heroConfig, navigationConfig } from '../config';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(navRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1);
      tl.fromTo(eyebrowRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7 }, 0.35);
      if (titleRef.current) {
        const spans = titleRef.current.querySelectorAll('span');
        tl.fromTo(Array.from(spans),
          { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.9, stagger: 0.12 },
          0.5
        );
      }
      tl.fromTo(bodyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 1.1);
      tl.fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 1.35);
    });
    return () => ctx.revert();
  }, []);

  const linkStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#fff',
    textTransform: 'uppercase',
    textDecoration: 'none',
    letterSpacing: '0.1em',
    borderBottom: '1px solid transparent',
    paddingBottom: '2px',
    transition: 'border-color 0.2s',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      {/* ── Full-width nav, outside and above the hero section ── */}
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontFamily: "'IBM Plex Mono', monospace",
          opacity: 0,
        }}
      >
        {/* Brand */}
        <span style={{ fontSize: '14px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
          {navigationConfig.brandName}
        </span>

        {/* Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navigationConfig.links.map(item => (
            <a
              key={item.label}
              href={item.href}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            >
              {item.label}
            </a>
          ))}

          <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />

          <Link
            to="/login"
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            style={{
              fontSize: '11px',
              color: '#000',
              background: '#fff',
              textTransform: 'uppercase',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              padding: '8px 20px',
              flexShrink: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <section
        ref={sectionRef}
        id="hero"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {/* Left panel */}
        <div style={{
          position: 'relative',
          width: '46%',
          minWidth: '340px',
          background: '#000',
          flexShrink: 0,
        }}>
          {/* Hero content — pushed below the 60px nav */}
          <div style={{
            position: 'absolute',
            left: '40px',
            right: '32px',
            top: 'calc(60px + 9vh)',
            bottom: '80px',
            overflow: 'hidden',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            <p ref={eyebrowRef} style={{
              fontSize: '10px',
              lineHeight: 1.6,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#fff',
              margin: '0 0 20px 0',
              opacity: 0,
            }}>
              {heroConfig.eyebrow}
            </p>

            <h1 ref={titleRef} style={{
              fontFamily: "'Geist Pixel', monospace",
              fontSize: 'clamp(42px, 5vw, 76px)',
              fontWeight: 400,
              lineHeight: 0.96,
              color: '#fff',
              textTransform: 'uppercase',
              margin: '0 0 32px 0',
              letterSpacing: '0.015em',
            }}>
              {heroConfig.titleLines.map((line, i) => (
                <span key={i} style={{ display: 'block', overflow: 'hidden' }}>{line}</span>
              ))}
            </h1>

            <div ref={bodyRef} style={{ opacity: 0, marginBottom: '36px', maxWidth: '420px' }}>
              <p style={{ fontSize: '14px', lineHeight: 1.85, color: '#fff', margin: '0 0 20px 0' }}>
                {heroConfig.leadText}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {heroConfig.supportingNotes.slice(0, 2).map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>—</span>
                    <p style={{ fontSize: '12px', lineHeight: 1.75, color: '#fff', margin: 0 }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right panel — ASCII canvas + overlaid CTAs */}
        <div style={{ position: 'relative', flex: 1, background: '#000', overflow: 'hidden' }}>
          <AsciiCanvas />

          {/* CTAs overlaid bottom-left of sphere panel */}
          <div
            ref={ctaRef}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              opacity: 0,
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/register" style={{
                display: 'inline-block', padding: '14px 30px',
                background: '#fff', color: '#000',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px', textTransform: 'uppercase',
                letterSpacing: '0.1em', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Enter Platform →
              </Link>
              <Link to="/login" style={{
                display: 'inline-block', padding: '14px 30px',
                background: 'transparent', color: '#fff',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px', textTransform: 'uppercase',
                letterSpacing: '0.1em', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.5)',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
              >
                Sign In
              </Link>
            </div>

            {/* Status row */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#44ff88', boxShadow: '0 0 7px #44ff88', animation: 'pulse 2s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)' }}>All Systems Operational</span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>·</span>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>SDG 1 · 3 · 10 · 11 · 17</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
