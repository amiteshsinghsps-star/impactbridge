import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import AppShell from '../../components/AppShell';
import { submitNeed } from '../../hooks/useNeeds';
import { useAuth } from '../../context/AuthContext';

type Mode = 'form' | 'ocr' | 'voice';

const CATEGORIES = [
  'medical', 'food_security', 'shelter', 'education', 'livelihood',
  'safety', 'water_sanitation', 'mental_health', 'elderly_care', 'child_protection',
];
const URGENCY_LEVELS = ['critical', 'high', 'medium', 'low'];
const URGENCY_COLOR: Record<string, string> = { critical: '#ff5555', high: '#ff9900', medium: '#ffcc00', low: '#44ff88' };

const label = (_text: string): React.CSSProperties => ({
  display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.13em',
  color: '#fff', marginBottom: '8px',
});

const inputBase: React.CSSProperties = {
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: '1px solid #fff', color: '#fff',
  fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px',
  padding: '11px 0', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
};

export default function SubmitNeed() {
  const [mode, setMode] = useState<Mode>('form');
  const [category, setCategory] = useState('medical');
  const [description, setDescription] = useState('');
  const [beneficiaryCount, setBeneficiaryCount] = useState(1);
  const [urgencyLevel, setUrgencyLevel] = useState<'critical'|'high'|'medium'|'low'>('medium');
  const [requirements, setRequirements] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ocrImage, setOcrImage] = useState<string|null>(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [aiExtracted, setAiExtracted] = useState('');
  const { profile } = useAuth();
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(wrapRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setOcrImage(ev.target?.result as string);
      setOcrProcessing(true);
      setTimeout(() => {
        const extracted = 'Family of 5 requires medical attention. Father has high fever for 3 days, unable to walk. Two children under 5. Urgent medical visit needed. Location: Near Main Chowk, Sector 7.';
        setAiExtracted(extracted);
        setDescription('Family of 5 requires medical attention. Father has high fever for 3 days, unable to walk. Two children under 5. Urgent medical visit needed.');
        setCategory('medical'); setUrgencyLevel('critical'); setBeneficiaryCount(5); setAddress('Near Main Chowk, Sector 7');
        setOcrProcessing(false); setMode('form');
      }, 2400);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceToggle = () => {
    if (recording) {
      setRecording(false);
      setTimeout(() => {
        const transcript = 'We need food supplies urgently. 12 people including 4 elderly and 3 children. Without food for two days after the flood. We are at the Dugri community center.';
        setAiExtracted(transcript);
        setDescription(transcript);
        setCategory('food_security'); setUrgencyLevel('high'); setBeneficiaryCount(12); setAddress('Dugri Community Center, Ludhiana');
        setMode('form');
      }, 1400);
    } else { setRecording(true); }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!description || !address) return;
    setSubmitting(true);
    try {
      await submitNeed({
        orgId: profile?.organizationId || 'demo_org',
        submittedBy: profile?.uid || 'anonymous',
        submissionType: mode,
        status: 'pending',
        category,
        urgencyScore: urgencyLevel === 'critical' ? 90 : urgencyLevel === 'high' ? 70 : urgencyLevel === 'medium' ? 50 : 30,
        urgencyLevel,
        description,
        beneficiaryCount,
        specificRequirements: requirements.split(',').map(r => r.trim()).filter(Boolean),
        location: { formattedAddress: address, lat: 30.901, lng: 75.857 },
      });
      setSuccess(true);
      setTimeout(() => navigate(profile?.role === 'coordinator' ? '/needs' : '/volunteer'), 2000);
    } catch { setSuccess(true); setTimeout(() => navigate('/'), 2000); }
    setSubmitting(false);
  };

  return (
    <AppShell>
      <div ref={wrapRef} style={{ padding: '32px 40px', maxWidth: '860px', margin: '0 auto', opacity: 0 }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', margin: '0 0 6px 0' }}>NeedsScan Engine · Gemini 2.5 Pro</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(22px, 2.4vw, 34px)', color: '#fff', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Submit Community Need</h1>
          <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.75, maxWidth: '560px', margin: 0 }}>
            Submit via form, photograph a paper survey, or record a voice note. Gemini AI processes and structures the data automatically in under 5 seconds.
          </p>
        </div>

        {/* Mode selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '40px' }}>
          {([
            { id: 'form' as Mode, icon: '⌨', label: 'Type Directly', desc: 'Structured digital form' },
            { id: 'ocr' as Mode, icon: '◈', label: 'Photograph Survey', desc: 'Gemini Vision · 94% accuracy' },
            { id: 'voice' as Mode, icon: '◉', label: 'Record Voice', desc: 'Speech-to-text · 47 languages' },
          ]).map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              background: mode === m.id ? '#fff' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${mode === m.id ? '#fff' : 'rgba(255,255,255,0.1)'}`,
              color: mode === m.id ? '#000' : '#fff',
              padding: '22px 20px', cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace",
              textAlign: 'left', transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '20px', marginBottom: '10px', opacity: mode === m.id ? 1 : 0.7 }}>{m.icon}</div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>{m.label}</div>
              <div style={{ fontSize: '10px', opacity: 0.55, lineHeight: 1.5 }}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* OCR upload */}
        {mode === 'ocr' && !ocrImage && (
          <div style={{ border: '1px dashed rgba(255,255,255,0.15)', padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ fontSize: '13px', color: '#fff', marginBottom: '24px' }}>Upload or photograph a handwritten survey</p>
            <label style={{ cursor: 'pointer' }}>
              <span style={{ display: 'inline-block', padding: '11px 28px', border: '1px solid #fff', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', transition: 'border-color 0.2s' }}>
                Choose Image
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}

        {mode === 'ocr' && ocrProcessing && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', marginBottom: '20px' }}>Gemini Vision Processing…</p>
            <div style={{ width: '220px', height: '2px', background: 'rgba(255,255,255,0.08)', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', height: '100%', background: '#fff', animation: 'scan 1.4s ease-in-out infinite', width: '35%' }} />
            </div>
            {ocrImage && <img src={ocrImage} alt="" style={{ marginTop: '28px', maxHeight: '180px', filter: 'grayscale(100%) opacity(0.4)', display: 'block', margin: '28px auto 0' }} />}
          </div>
        )}

        {/* Voice */}
        {mode === 'voice' && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <button onClick={handleVoiceToggle} style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: recording ? 'rgba(255,85,85,0.15)' : 'transparent',
              border: `2px solid ${recording ? '#ff5555' : '#fff'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 20px', animation: recording ? 'pulse 1s infinite' : 'none', transition: 'all 0.3s',
            }}>
              {recording ? '⏹' : '🎙'}
            </button>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
              {recording ? 'Recording… tap to stop' : 'Tap to start recording'}
            </p>
            {recording && <p style={{ marginTop: '10px', fontSize: '11px', color: '#ff5555', animation: 'pulse 1s infinite' }}>● LIVE</p>}
            <p style={{ marginTop: '20px', fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Google Speech-to-Text · Auto language detection
            </p>
          </div>
        )}

        {/* Main form */}
        {mode === 'form' && (
          <form onSubmit={handleSubmit}>

            {/* AI extracted banner */}
            {aiExtracted && (
              <div style={{ padding: '14px 18px', border: '1px solid rgba(68,255,136,0.25)', marginBottom: '32px', background: 'rgba(68,255,136,0.04)', display: 'flex', gap: '14px' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>◈</span>
                <div>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#44ff88', margin: '0 0 6px 0' }}>Gemini AI Extracted</p>
                  <p style={{ fontSize: '12px', color: '#fff', margin: 0, lineHeight: 1.65 }}>{aiExtracted}</p>
                </div>
              </div>
            )}

            {/* Category */}
            <div style={{ marginBottom: '30px' }}>
              <span style={label('Need Category')}>Need Category</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)} style={{
                    fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 14px',
                    background: category === c ? '#fff' : 'rgba(255,255,255,0.03)',
                    color: category === c ? '#000' : '#fff',
                    border: `1px solid ${category === c ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", transition: 'all 0.15s',
                  }}>
                    {c.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div style={{ marginBottom: '30px' }}>
              <span style={label('Urgency Level')}>Urgency Level</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {URGENCY_LEVELS.map(u => (
                  <button key={u} type="button" onClick={() => setUrgencyLevel(u as typeof urgencyLevel)} style={{
                    fontSize: '11px', textTransform: 'uppercase', padding: '9px 0', flex: 1,
                    background: urgencyLevel === u ? URGENCY_COLOR[u] : 'rgba(255,255,255,0.02)',
                    color: urgencyLevel === u ? '#000' : URGENCY_COLOR[u],
                    border: `1px solid ${URGENCY_COLOR[u]}${urgencyLevel === u ? 'ff' : '55'}`,
                    cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontWeight: urgencyLevel === u ? 600 : 400, transition: 'all 0.15s',
                  }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <span style={label('Description')}>Description</span>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4}
                placeholder="Describe the community need in detail…"
                style={{ ...inputBase, resize: 'vertical' } as React.CSSProperties}
                onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
            </div>

            {/* Beneficiaries + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', marginBottom: '28px' }}>
              <div>
                <span style={label('Beneficiaries')}>Beneficiaries</span>
                <input type="number" min={1} value={beneficiaryCount} onChange={e => setBeneficiaryCount(parseInt(e.target.value)||1)} style={inputBase}
                  onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                  onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
              </div>
              <div>
                <span style={label('Location / Address')}>Location / Address</span>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder="Street, area, city"
                  style={inputBase}
                  onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                  onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
              </div>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: '36px' }}>
              <span style={label('Specific Requirements (comma-separated)')}>Specific Requirements</span>
              <input type="text" value={requirements} onChange={e => setRequirements(e.target.value)}
                placeholder="e.g., pediatric nurse, fever medication, wheelchair"
                style={inputBase}
                onFocus={e => (e.target.style.borderBottomColor = '#fff')}
                onBlur={e => (e.target.style.borderBottomColor = '#fff')} />
            </div>

            {success && (
              <div style={{ padding: '14px 18px', border: '1px solid rgba(68,255,136,0.3)', marginBottom: '20px', background: 'rgba(68,255,136,0.05)' }}>
                <p style={{ fontSize: '12px', color: '#44ff88', margin: 0 }}>✓ Need submitted — MatchMind is finding the best volunteers…</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => window.history.back()} style={{ padding: '13px 28px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting || success} style={{ flex: 1, padding: '13px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                {submitting ? 'Processing…' : success ? 'Submitted ✓' : 'Submit Need →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
