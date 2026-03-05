import React from 'react';
import Card, { CardTitle } from './Card';

const riskColors = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };
const riskBg     = { Low: 'rgba(16,185,129,.1)', Medium: 'rgba(245,158,11,.1)', High: 'rgba(239,68,68,.1)' };
const riskBorder = { Low: 'rgba(16,185,129,.3)', Medium: 'rgba(245,158,11,.3)', High: 'rgba(239,68,68,.3)' };

export default function ResultPanel({ result }) {
  const isRejected = result.prediction === 1;
  const prob       = Math.round(result.probability * 100);
  const riskColor  = riskColors[result.risk_level];

  return (
    <div className="animate-fadeIn">
      {/* Main verdict */}
      <div style={{
        borderRadius: 20, padding: '32px 28px', marginBottom: 20, textAlign: 'center',
        background: isRejected
          ? 'linear-gradient(135deg, rgba(239,68,68,.12), rgba(239,68,68,.04))'
          : 'linear-gradient(135deg, rgba(16,185,129,.12), rgba(16,185,129,.04))',
        border: `2px solid ${isRejected ? 'rgba(239,68,68,.4)' : 'rgba(16,185,129,.4)'}`,
        animation: 'glowPulse 2.5s infinite',
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>
          {isRejected ? '❌' : '✅'}
        </div>
        <div style={{
          fontSize: 32, fontWeight: 800, letterSpacing: '-1px',
          color: isRejected ? '#ef4444' : '#10b981',
          marginBottom: 8,
        }}>
          {result.label}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-2)' }}>
          {isRejected
            ? 'This block is predicted to be defective and will be rejected.'
            : 'This block passes quality checks and is predicted to be good.'}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {/* Probability */}
        <Card style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '2px',
            color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Rejection Probability
          </div>
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 12px' }}>
            <svg viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="8"/>
              <circle cx="40" cy="40" r="34" fill="none"
                stroke={isRejected ? '#ef4444' : '#10b981'}
                strokeWidth="8"
                strokeDasharray={`${prob * 2.136} 213.6`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: isRejected ? '#ef4444' : '#10b981' }}>
              {prob}%
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Confidence: {result.probability > 0.7 ? 'High' : result.probability > 0.4 ? 'Medium' : 'Low'}
          </div>
        </Card>

        {/* Risk Level */}
        <Card style={{ textAlign: 'center', padding: '20px 16px',
          background: riskBg[result.risk_level],
          border: `1px solid ${riskBorder[result.risk_level]}` }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '2px',
            color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Risk Level
          </div>
          <div style={{ fontSize: 44, marginBottom: 8 }}>
            {result.risk_level === 'Low' ? '🟢' : result.risk_level === 'Medium' ? '🟡' : '🔴'}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: riskColor }}>
            {result.risk_level}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
            {result.risk_level === 'Low'    ? 'prob < 30%'
           : result.risk_level === 'Medium' ? '30% ≤ prob < 60%'
           :                                  'prob ≥ 60%'}
          </div>
        </Card>

        {/* Model */}
        <Card style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '2px',
            color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Model Used
          </div>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue-4)', lineHeight: 1.4 }}>
            {result.model_used}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'AUC', val: '0.923' },
              { label: 'Acc', val: '89.4%' },
            ].map(m => (
              <span key={m.label} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: 'rgba(37,99,235,.15)', color: 'var(--blue-4)',
                fontFamily: 'var(--mono)' }}>
                {m.label} {m.val}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Action guidance */}
      <Card style={{ padding: '16px 20px', borderLeft: `4px solid ${isRejected ? '#ef4444' : '#10b981'}` }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6,
          color: isRejected ? '#ef4444' : '#10b981' }}>
          {isRejected ? '⚠️  Recommended Action' : '✅  Status Clear'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8 }}>
          {isRejected
            ? result.risk_level === 'High'
              ? 'HIGH RISK — Do not proceed. Escalate to QC supervisor immediately. Flag this batch for inspection. Check grog type and bin height.'
              : 'MEDIUM RISK — Flag block for enhanced visual inspection before pouring. Review grog_type and temperature parameters.'
            : 'Block parameters look healthy. Proceed with standard production workflow. Continue monitoring flowrate and temperature.'}
        </div>
      </Card>
    </div>
  );
}
