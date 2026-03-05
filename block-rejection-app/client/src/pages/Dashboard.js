import React, { useEffect, useState } from 'react';
import apiClient from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell,
} from 'recharts';
import Card, { CardTitle } from '../components/Card';

const COLORS = ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6'];

function MetricBadge({ label, val, color }) {
  return (
    <div style={{
      background: 'var(--bg-input)', borderRadius: 10, padding: '14px 16px',
      border: '1px solid var(--border)', textAlign: 'center',
    }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-3)',
        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{val}</div>
    </div>
  );
}

const FI_DATA = [
  { feature: 'grog_type',    pct: 21.2, color: '#ef4444' },
  { feature: 'bin_height',   pct: 17.7, color: '#f59e0b' },
  { feature: 'temperature',  pct: 12.0, color: '#f97316' },
  { feature: 'flowrate',     pct: 10.1, color: '#8b5cf6' },
  { feature: 'density',      pct: 6.6,  color: '#2563eb' },
  { feature: 'tilt_angle',   pct: 6.5,  color: '#06b6d4' },
  { feature: 'energy',       pct: 5.6,  color: '#10b981' },
  { feature: 'unit_wgt',     pct: 5.4,  color: '#10b981' },
  { feature: 'pouring_time', pct: 5.2,  color: '#10b981' },
  { feature: 'module',       pct: 3.6,  color: '#94a3b8' },
  { feature: 'quality',      pct: 3.4,  color: '#94a3b8' },
  { feature: 'mould_type',   pct: 1.7,  color: '#475569' },
  { feature: 'sub_location', pct: 1.2,  color: '#475569' },
];

const GROG_RISK = [
  { name: 'System',          pct: 57.3, color: '#ef4444' },
  { name: 'Recycle 6-18mm',  pct: 44.5, color: '#f97316' },
  { name: 'Recycle 2-6mm',   pct: 42.5, color: '#f97316' },
  { name: 'MPBV2',           pct: 18.1, color: '#f59e0b' },
  { name: 'MPBV3',           pct: 9.9,  color: '#10b981' },
  { name: 'Fresh 2-6mm',     pct: 10.5, color: '#10b981' },
  { name: 'Fresh 6-18mm',    pct: 9.6,  color: '#10b981' },
];

const BIN_RISK = [
  { name: '< 3 Feet',    pct: 56.5, color: '#ef4444' },
  { name: '7 Ft Bottom', pct: 42.9, color: '#f97316' },
  { name: '6–8 Feet',    pct: 27.2, color: '#f59e0b' },
  { name: '3–4 Feet',    pct: 17.8, color: '#f59e0b' },
  { name: '4–5 Feet',    pct: 9.9,  color: '#10b981' },
  { name: '5–6 Feet',    pct: 9.6,  color: '#10b981' },
];

export default function Dashboard() {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    apiClient.get('/api/meta').then(r => setMeta(r.data)).catch(() => {});
  }, []);

  const modelResults = meta?.all_results ?? [];
  const best = modelResults.find(m => m.model === meta?.best_model_name) ?? {};

  const radarData = [
    { metric: 'Accuracy',  value: best.accuracy ?? 0 },
    { metric: 'Precision', value: (best.precision ?? 0) * 100 },
    { metric: 'Recall',    value: (best.recall ?? 0) * 100 },
    { metric: 'F1 Score',  value: (best.f1 ?? 0) * 100 },
    { metric: 'ROC-AUC',   value: (best.roc_auc ?? 0) * 100 },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
          Model Dashboard
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
          Performance metrics for all trained models and key data insights.
        </p>
      </div>

      {/* Best model hero */}
      <Card style={{ marginBottom: 20,
        background: 'linear-gradient(135deg,#0f172a,#0a1628)',
        border: '1px solid rgba(37,99,235,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg,#1e40af,#2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, boxShadow: '0 0 24px rgba(37,99,235,.5)',
          }}>🏆</div>
          <div>
            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-3)',
              letterSpacing: '2px', textTransform: 'uppercase' }}>Best Model</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue-4)' }}>
              {meta?.best_model_name ?? '…'}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {[
            { label: 'Accuracy',  val: `${best.accuracy ?? '—'}%`,     color: '#60a5fa' },
            { label: 'Precision', val: best.precision ?? '—',           color: '#34d399' },
            { label: 'Recall',    val: best.recall ?? '—',              color: '#f59e0b' },
            { label: 'F1 Score',  val: best.f1 ?? '—',                  color: '#a78bfa' },
            { label: 'ROC-AUC',   val: best.roc_auc ?? '—',             color: '#f472b6' },
          ].map(m => <MetricBadge key={m.label} {...m} />)}
        </div>
      </Card>

      {/* All models comparison */}
      <Card style={{ marginBottom: 20 }}>
        <CardTitle icon="📊">All Models — Performance Comparison</CardTitle>
        {modelResults.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={modelResults.map(m => ({
              name: m.model.replace(' ', '\n'),
              Accuracy: m.accuracy,
              'F1 Score': Math.round(m.f1 * 100),
              'ROC-AUC': Math.round(m.roc_auc * 100),
            }))} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} domain={[40, 100]} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text-1)' }}
              />
              <Bar dataKey="Accuracy"  fill="#2563eb" radius={[4,4,0,0]} />
              <Bar dataKey="F1 Score"  fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="ROC-AUC"   fill="#8b5cf6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign:'center', color:'var(--text-3)', padding:40 }}>Loading…</div>
        )}
        <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:12 }}>
          {[['Accuracy','#2563eb'],['F1 Score','#10b981'],['ROC-AUC (×100)','#8b5cf6']].map(([l,c])=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-2)'}}>
              <div style={{width:10,height:10,borderRadius:2,background:c}}/>
              {l}
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Feature Importance */}
        <Card>
          <CardTitle icon="🔍">Feature Importance (Random Forest)</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {FI_DATA.map(f => (
              <div key={f.feature} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)',
                  width: 110, textAlign: 'right', color: 'var(--text-2)', flexShrink: 0 }}>
                  {f.feature}
                </div>
                <div style={{ flex: 1, height: 16, background: 'var(--bg-input)',
                  borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(f.pct/21.2)*100}%`, height: '100%',
                    background: f.color, borderRadius: 4, opacity: 0.85,
                    transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)',
                  color: f.color, width: 38, textAlign: 'right', flexShrink: 0 }}>
                  {f.pct}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Best model radar */}
        <Card>
          <CardTitle icon="🎯">Best Model — Metric Radar</CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
              <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25}
                strokeWidth={2} dot={{ fill: '#60a5fa', r: 4 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text-1)' }}
                formatter={v => [`${v.toFixed(1)}%`]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Grog Type Risk */}
        <Card>
          <CardTitle icon="🪨">Grog Type — Rejection Rate</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GROG_RISK} layout="vertical" margin={{ left: 80, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-3)', fontSize: 10 }}
                domain={[0, 70]} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
              <Tooltip formatter={v => [`${v}%`, 'Rejection Rate']}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text-1)' }} />
              <Bar dataKey="pct" radius={[0,4,4,0]}>
                {GROG_RISK.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Bin Height Risk */}
        <Card>
          <CardTitle icon="📦">Bin Height — Rejection Rate</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BIN_RISK} layout="vertical" margin={{ left: 80, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-3)', fontSize: 10 }}
                domain={[0, 70]} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
              <Tooltip formatter={v => [`${v}%`, 'Rejection Rate']}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text-1)' }} />
              <Bar dataKey="pct" radius={[0,4,4,0]}>
                {BIN_RISK.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
