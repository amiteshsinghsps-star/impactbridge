import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace', padding: '40px" }}>
      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff', margin: '0 0 16px 0' }}>404 · Page Not Found</p>
      <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(48px, 8vw, 96px)', color: '#fff', textTransform: 'uppercase', margin: '0 0 24px 0', lineHeight: 0.96 }}>
        LOST?
      </h1>
      <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 40px 0', maxWidth: '320px', textAlign: 'center', lineHeight: 1.7 }}>
        This page doesn't exist. Let's get you back to where you need to be.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/" style={{ padding: '13px 28px', background: '#fff', color: '#000', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', transition: 'opacity 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          ← Home
        </Link>
        <Link to="/login" style={{ padding: '13px 28px', background: 'transparent', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
