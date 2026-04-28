import { Link } from 'react-router-dom';
import { footerConfig } from '../config';

export default function Footer() {
  if (!footerConfig.copyrightText && !footerConfig.statusText) {
    return null;
  }

  const linkStyle: React.CSSProperties = {
    color: '#000',
    textDecoration: 'none',
    borderBottom: '1px solid transparent',
    paddingBottom: '1px',
    transition: 'border-color 0.2s',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <footer
      style={{
        background: '#ffffff',
        color: '#000000',
        borderTop: '1px solid #000',
        padding: '32px 40px',
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {footerConfig.copyrightText}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {footerConfig.statusText}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link to="/login"
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#000')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >Sign In</Link>
          <Link to="/register"
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#000')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >Register</Link>
          <Link to="/needs/submit"
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#000')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >Submit Need</Link>
          <Link to="/dashboard"
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#000')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >Coordinator</Link>
          <Link to="/volunteer"
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#000')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >Volunteer</Link>
        </div>

        <Link
          to="/register"
          style={{
            padding: '10px 24px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Get Started →
        </Link>
      </div>
    </footer>
  );
}
