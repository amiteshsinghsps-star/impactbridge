import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth, type UserRole } from '../../context/AuthContext';

type Step = 'role' | 'details' | 'org';

const roles: { id: UserRole; title: string; desc: string; icon: string }[] = [
  { id: 'coordinator', title: 'NGO Coordinator', desc: 'Manage volunteers, track needs, run the command center.', icon: '◈' },
  { id: 'volunteer', title: 'Field Volunteer', desc: 'Collect data, deliver services, build community impact.', icon: '◉' },
  { id: 'reporter', title: 'Community Reporter', desc: 'Submit community needs and track their resolution.', icon: '◎' },
];

export default function Register() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<UserRole>('volunteer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      '.step-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [step]);

  const validateDetails = () => {
    if (!firstName.trim()) { setError('First name is required.'); return false; }
    if (!lastName.trim()) { setError('Last name is required.'); return false; }
    if (!email.trim() || !email.includes('@')) { setError('A valid email is required.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    setError('');
    return true;
  };

  const handleDetailsNext = () => {
    if (!validateDetails()) return;
    if (role === 'coordinator') {
      setStep('org');
    } else {
      doRegister();
    }
  };

  const doRegister = async (org?: string) => {
    setLoading(true);
    setError('');
    try {
      await register(email, password, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
        organizationName: org || orgName || undefined,
        organizationId: (org || orgName) ? `org_${(org || orgName).toLowerCase().replace(/\s+/g, '_')}` : undefined,
      });
      navigate(role === 'coordinator' ? '/dashboard' : role === 'volunteer' ? '/volunteer' : '/needs/submit');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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

  const primaryBtn: React.CSSProperties = {
    flex: 2,
    padding: '16px',
    background: loading ? '#fff' : '#fff',
    color: '#000',
    border: 'none',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  const secondaryBtn: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    background: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  };

  return (
    <div
      ref={containerRef}
      style={{ minHeight: '100vh', background: '#000', display: 'flex', fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Left — branding */}
      <div style={{ width: '40%', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ImpactBridge</span>
        </Link>

        <div>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(32px, 3.5vw, 56px)', fontWeight: 400, lineHeight: 0.96, color: '#fff', textTransform: 'uppercase', margin: '0 0 32px 0' }}>
            JOIN THE<br />MISSION
          </h1>
          <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.8, maxWidth: '300px' }}>
            5,000+ NGOs. 250,000 volunteers. 2 million community needs addressed. Be part of it.
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(['role', 'details', role === 'coordinator' ? 'org' : null] as (Step | null)[]).filter(Boolean).map((s, i) => (
            <div key={s!} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', border: `1px solid ${step === s ? '#fff' : '#fff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: step === s ? '#fff' : '#fff' }}>
                {i + 1}
              </div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: step === s ? '#fff' : '#fff' }}>
                {s === 'role' ? 'Select Role' : s === 'details' ? 'Your Details' : 'Organization'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — steps */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Step 1 — Role */}
          {step === 'role' && (
            <div className="step-content">
              <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', margin: '0 0 40px 0' }}>
                How will you use ImpactBridge?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      background: role === r.id ? '#fff' : 'transparent',
                      border: `1px solid ${role === r.id ? '#fff' : 'rgba(255,255,255,0.15)'}`,
                      color: role === r.id ? '#000' : '#fff',
                      padding: '20px 24px',
                      cursor: 'pointer',
                      fontFamily: "'IBM Plex Mono', monospace",
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <span style={{ fontSize: '18px', lineHeight: 1, marginTop: '2px' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{r.title}</div>
                      <div style={{ fontSize: '11px', opacity: 0.6, lineHeight: 1.6 }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('details')} style={{ marginTop: '32px', width: '100%', padding: '16px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Details */}
          {step === 'details' && (
            <div className="step-content">
              <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', margin: '0 0 40px 0' }}>
                Your Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                    onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                    onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                  onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Password (min. 6 characters)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                  onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
              </div>

              {error && <p style={{ fontSize: '11px', color: '#ff6666', marginBottom: '16px', lineHeight: 1.5 }}>{error}</p>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setError(''); setStep('role'); }} style={secondaryBtn}>Back</button>
                <button onClick={handleDetailsNext} disabled={loading} style={primaryBtn}>
                  {loading ? 'Creating...' : role === 'coordinator' ? 'Continue →' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Org (coordinator only) */}
          {step === 'org' && (
            <div className="step-content">
              <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', margin: '0 0 40px 0' }}>
                Your Organization
              </h2>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Organization Name</label>
                <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g., Ludhiana Community Aid" style={inputStyle}
                  onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                  onBlur={e => (e.target.style.borderBottomColor = '#fff')}
                  onKeyDown={e => { if (e.key === 'Enter') doRegister(); }} />
              </div>
              <p style={{ fontSize: '10px', color: '#fff', marginBottom: '32px' }}>Optional — you can set this up later</p>

              {error && <p style={{ fontSize: '11px', color: '#ff6666', marginBottom: '16px', lineHeight: 1.5 }}>{error}</p>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setError(''); setStep('details'); }} style={secondaryBtn}>Back</button>
                <button onClick={() => doRegister()} disabled={loading} style={primaryBtn}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <p style={{ marginTop: '32px', fontSize: '11px', color: '#fff' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '1px' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
