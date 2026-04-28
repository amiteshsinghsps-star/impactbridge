import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import AppShell from '../../components/AppShell';

const TREND_DATA = [
  { month: 'Nov 25', needs: 84, assigned: 72, completed: 68 },
  { month: 'Dec 25', needs: 97, assigned: 89, completed: 85 },
  { month: 'Jan 26', needs: 143, assigned: 128, completed: 121 },
  { month: 'Feb 26', needs: 112, assigned: 103, completed: 98 },
  { month: 'Mar 26', needs: 168, assigned: 151, completed: 144 },
  { month: 'Apr 26', needs: 89, assigned: 82, completed: 74 },
];

const CATEGORY_DATA = [
  { name: 'Medical', value: 31, color: '#ff4444' },
  { name: 'Food', value: 24, color: '#ff8800' },
  { name: 'Shelter', value: 18, color: '#ffcc00' },
  { name: 'Education', value: 14, color: '#44ff88' },
  { name: 'Water', value: 8, color: '#44aaff' },
  { name: 'Other', value: 5, color: '#fff' },
];

const FORECAST_DATA = [
  { day: 'Mon', actual: 12, forecast: 12 },
  { day: 'Tue', actual: 8, forecast: 8 },
  { day: 'Wed', actual: 15, forecast: 15 },
  { day: 'Thu', actual: 11, forecast: 11 },
  { day: 'Fri', actual: 14, forecast: 14 },
  { day: 'Sat', actual: null, forecast: 16 },
  { day: 'Sun', actual: null, forecast: 13 },
  { day: 'Mon+1', actual: null, forecast: 19 },
  { day: 'Tue+1', actual: null, forecast: 17 },
  { day: 'Wed+1', actual: null, forecast: 22 },
];

const SDG_METRICS = [
  { sdg: 'SDG 1', label: 'No Poverty', value: 312, unit: 'People lifted', color: '#ff4444' },
  { sdg: 'SDG 3', label: 'Good Health', value: 187, unit: 'Medical interventions', color: '#44ff88' },
  { sdg: 'SDG 10', label: 'Reduced Inequalities', value: 94, unit: 'Communities served', color: '#4488ff' },
  { sdg: 'SDG 11', label: 'Sustainable Cities', value: 23, unit: 'Zones covered', color: '#ffcc00' },
  { sdg: 'SDG 17', label: 'Partnerships', value: 8, unit: 'NGOs networked', color: '#ff88ff' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 16px', fontFamily: "'IBM Plex Mono', monospace" }}>
      <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fff', margin: '0 0 8px 0' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ fontSize: '12px', color: p.color, margin: '3px 0' }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [tab, setTab] = useState<'overview' | 'needs' | 'forecast' | 'sdg' | 'report'>('overview');
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportLang, setReportLang] = useState('English');

  const handleGenerateReport = () => {
    setGenerating(true);
    setReportGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setReportGenerated(true);
    }, 2500);
  };

  const tabs = ['overview', 'needs', 'forecast', 'sdg', 'report'] as const;

  return (
    <AppShell>
      <div style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', margin: '0 0 8px 0' }}>ImpactPulse</p>
          <h1 style={{ fontFamily: "'Geist Pixel', monospace", fontSize: 'clamp(24px, 3vw, 40px)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
            Analytics & Reports
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0' }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: tab === t ? '#fff' : '#fff',
                border: 'none',
                borderBottom: `2px solid ${tab === t ? '#fff' : 'transparent'}`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.2s',
              }}
            >
              {t === 'report' ? 'AI Report' : t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            {/* KPI bar */}
            <div style={{ display: 'flex', marginBottom: '32px' }}>
              {[
                { label: 'Total Needs', value: '693', delta: '+23%' },
                { label: 'Completed', value: '590', delta: '+18%' },
                { label: 'Match Accuracy', value: '91%', delta: '+4pp' },
                { label: 'Avg Response', value: '3.2h', delta: '-1.4h' },
                { label: 'Volunteers Active', value: '6', delta: '+2' },
              ].map((kpi, i, arr) => (
                <div key={kpi.label} style={{ flex: 1, padding: '24px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', border: '1px solid rgba(255,255,255,0.08)', borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '28px', color: '#fff' }}>{kpi.value}</div>
                  <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#fff', margin: '4px 0 6px 0' }}>{kpi.label}</div>
                  <div style={{ fontSize: '10px', color: '#44ff88' }}>{kpi.delta} vs last period</div>
                </div>
              ))}
            </div>

            {/* Trend chart */}
            <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px', marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>6-Month Needs Trend</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="needsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#44ff88" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#44ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#fff', fontFamily: "'IBM Plex Mono', monospace' " }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#fff', fontFamily: "'IBM Plex Mono', monospace'" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="needs" name="Needs Submitted" stroke="#fff" fill="url(#needsGrad)" strokeWidth={1} />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#44ff88" fill="url(#completedGrad)" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Needs Analysis */}
        {tab === 'needs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>Category Distribution</p>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <PieChart width={160} height={160}>
                  <Pie data={CATEGORY_DATA} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                    {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CATEGORY_DATA.map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: '#fff', flex: 1 }}>{c.name}</span>
                      <span style={{ fontSize: '11px', color: '#fff', fontFamily: "'Geist Pixel', monospace'" }}>{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>Monthly Volume</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={TREND_DATA}>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#fff', fontFamily: "'IBM Plex Mono', monospace'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#fff', fontFamily: "'IBM Plex Mono', monospace'" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="needs" name="Submitted" fill="rgba(255,255,255,0.15)" />
                  <Bar dataKey="completed" name="Completed" fill="#fff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Forecast */}
        {tab === 'forecast' && (
          <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px 20px', border: '1px solid rgba(68,255,136,0.2)', background: 'rgba(68,255,136,0.03)' }}>
              <span style={{ fontSize: '12px', color: '#44ff88' }}>◈ BigQuery ML ARIMA_PLUS</span>
              <span style={{ fontSize: '12px', color: '#fff' }}>·</span>
              <span style={{ fontSize: '12px', color: '#fff' }}>10-day forecast with weather + event signals</span>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '32px', marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', margin: '0 0 24px 0' }}>
                Need Volume Forecast — Next 10 Days
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={FORECAST_DATA}>
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#44aaff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#44aaff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#fff', fontFamily: "'IBM Plex Mono', monospace'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#fff', fontFamily: "'IBM Plex Mono', monospace'" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="actual" name="Actual" stroke="#fff" fill="rgba(255,255,255,0.05)" strokeWidth={1.5} connectNulls={false} />
                  <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#44aaff" fill="url(#forecastGrad)" strokeWidth={1.5} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ border: '1px solid rgba(255,136,0,0.25)', padding: '20px 24px', background: 'rgba(255,136,0,0.04)' }}>
              <p style={{ fontSize: '11px', color: '#ff8800', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ⚠ Anomaly Alert — Wed+1
              </p>
              <p style={{ fontSize: '12px', color: '#fff', margin: 0, lineHeight: 1.6 }}>
                Predicted spike of 22 needs on Wednesday (+46% above baseline). Weather signal: heavy rainfall forecast. Pre-deploy 3 additional volunteers to Sector 7 and Dugri zones.
              </p>
            </div>
          </div>
        )}

        {/* SDG Alignment */}
        {tab === 'sdg' && (
          <div>
            <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.7, marginBottom: '32px', maxWidth: '600px' }}>
              ImpactBridge tracks alignment with 5 UN Sustainable Development Goals. Metrics are derived from completed need categories and volunteer deployment patterns.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SDG_METRICS.map(sdg => (
                <div key={sdg.sdg} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div style={{ width: '60px', height: '60px', border: `2px solid ${sdg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', color: sdg.color, textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.2 }}>{sdg.sdg}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px 0' }}>{sdg.label}</p>
                    <p style={{ fontSize: '10px', color: '#fff', margin: 0, textTransform: 'uppercase' }}>{sdg.unit}</p>
                  </div>
                  <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '36px', color: sdg.color }}>
                    {sdg.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Report Generator */}
        {tab === 'report' && (
          <div style={{ maxWidth: '700px' }}>
            <div style={{ marginBottom: '32px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fff', margin: '0 0 4px 0' }}>Powered by Gemini 2.5 Pro</p>
              <p style={{ fontSize: '12px', color: '#fff', margin: 0, lineHeight: 1.6 }}>
                Generates donor-ready impact reports with beneficiary narratives, resource analysis, and SDG alignment — in any language.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', marginBottom: '8px' }}>
                  Report Type
                </label>
                <select style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', padding: '10px 12px', outline: 'none' }}>
                  <option style={{ background: '#111' }}>Monthly Impact Report</option>
                  <option style={{ background: '#111' }}>Quarterly Summary</option>
                  <option style={{ background: '#111' }}>Donor Report</option>
                  <option style={{ background: '#111' }}>SDG Alignment Report</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', marginBottom: '8px' }}>
                  Language
                </label>
                <select
                  value={reportLang}
                  onChange={e => setReportLang(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', padding: '10px 12px', outline: 'none' }}
                >
                  {['English', 'Hindi', 'Punjabi', 'Spanish', 'French', 'Arabic', 'Swahili'].map(l => (
                    <option key={l} style={{ background: '#111' }}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={generating}
              style={{ width: '100%', padding: '16px', background: '#fff', color: '#000', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.6 : 1, marginBottom: '24px' }}
            >
              {generating ? 'Generating with Gemini...' : 'Generate Impact Report →'}
            </button>

            {reportGenerated && (
              <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '32px', animation: 'fadeInUp 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#44ff88', margin: 0 }}>✓ Report Generated — {reportLang}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['PDF', 'Word', 'CSV'].map(fmt => (
                      <button key={fmt} style={{ padding: '6px 12px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer' }}>
                        ↓ {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ImpactBridge Monthly Report — April 2026
                </h3>

                <div style={{ fontSize: '12px', color: '#fff', lineHeight: 1.9 }}>
                  <p style={{ fontWeight: 400, color: '#fff', marginBottom: '12px' }}>Executive Summary</p>
                  <p>This month, ImpactBridge coordinated 89 community need responses across Ludhiana district, achieving a 91% volunteer-to-task match accuracy. A total of 74 needs were fully resolved within SLA targets, representing a 18% improvement over the previous period.</p>

                  <p style={{ marginTop: '16px', fontWeight: 400, color: '#fff', marginBottom: '12px' }}>Impact Highlights</p>
                  <p>A mother of three in Sector 7, whose youngest child had severe fever for two days, was connected to a certified pediatric nurse within 22 minutes of need submission — down from a typical 72-hour response time before ImpactBridge. The child received treatment within the hour.</p>
                  <p style={{ marginTop: '8px' }}>In Dugri, 150 residents were left without clean water following a burst pipe. ImpactBridge matched two trained plumbers and coordinated a water tanker within 4 hours, preventing a potential public health crisis.</p>

                  <p style={{ marginTop: '16px', fontWeight: 400, color: '#fff', marginBottom: '12px' }}>Resource Utilization</p>
                  <p>6 active volunteers logged 312 service hours across 5 need categories. Medical (31%) and Food Security (24%) remained the highest-demand categories. Skills gap analysis identifies a shortage of mental health counselors for the Ravi Nagar area.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
