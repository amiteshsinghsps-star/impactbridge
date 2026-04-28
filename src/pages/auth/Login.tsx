import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, profile } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      const dest = profile.role === 'coordinator' ? '/dashboard' : profile.role === 'volunteer' ? '/volunteer' : '/reporter';
      navigate(dest);
    }
  }, [profile]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #fff',
    color: '#fff',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    padding: '12px 0',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
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
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: '50%',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ImpactBridge
          </span>
        </Link>

        <div>
          <p style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
            Google Solution Challenge 2025
          </p>
          <h1
            style={{
              fontFamily: "'Geist Pixel', monospace",
              fontSize: 'clamp(36px, 4vw, 64px)',
              fontWeight: 400,
              lineHeight: 0.96,
              color: '#fff',
              textTransform: 'uppercase',
              margin: '0 0 32px 0',
            }}
          >
            SIGN IN<br />TO YOUR<br />WORKSPACE
          </h1>
          <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.8, maxWidth: '340px' }}>
            Access your coordination command center, volunteer dashboard, or community reporting tools.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                All Systems Operational
              </span>
            </div>
          </div>
          <p style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            SDG 1 · 3 · 10 · 11 · 17
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div ref={formRef} style={{ width: '100%', maxWidth: '400px', opacity: 0 }}>
          <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', margin: '0 0 48px 0' }}>
            Access Platform
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@organization.org"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottomColor = '#fff')}
                onBlur={(e) => (e.target.style.borderBottomColor = '#fff')}
              />
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottomColor = '#fff')}
                onBlur={(e) => (e.target.style.borderBottomColor = '#fff')}
              />
            </div>

            {error && (
              <p style={{ fontSize: '11px', color: '#ff4444', marginBottom: '24px', lineHeight: 1.5 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: '#fff',
                color: '#000',
                border: 'none',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px' }}>
            <p style={{ fontSize: '11px', color: '#fff', marginBottom: '12px' }}>
              New to ImpactBridge?{' '}
              <Link
                to="/register"
                style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '1px' }}
              >
                Create account
              </Link>
            </p>
            <p style={{ fontSize: '10px', color: '#fff', lineHeight: 1.6 }}>
              coordinator@impactbridge.app / demo1234<br />
              volunteer@impactbridge.app / demo1234<br />
              reporter@impactbridge.app / demo1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
