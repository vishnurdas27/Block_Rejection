import React from 'react';

const tabs = [
  { id: 'predict',   label: '🔮  Predict' },
  { id: 'dashboard', label: '📊  Dashboard' },
  { id: 'history',   label: '🕒  History' },
];

export default function Navbar({ page, setPage }) {
  return (
    <header style={{
      background: 'linear-gradient(90deg,#050e1f 0%,#0a1628 100%)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 32,
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', flexShrink: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg,#1e40af,#2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: '0 0 16px rgba(37,99,235,.4)',
        }}>🏭</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)', letterSpacing: '-.3px' }}>
            BlockGuard
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)', letterSpacing: '1px' }}>
            SAINT-GOBAIN · AI REJECTION PREDICTOR
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setPage(t.id)} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: page === t.id ? 'rgba(37,99,235,.18)' : 'transparent',
            color: page === t.id ? 'var(--blue-4)' : 'var(--text-2)',
            fontWeight: page === t.id ? 600 : 400,
            fontSize: 13, cursor: 'pointer',
            borderBottom: page === t.id ? '2px solid var(--blue-3)' : '2px solid transparent',
            transition: 'all .2s', borderRadius: '8px 8px 0 0',
          }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
        background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)',
        borderRadius: 20, fontSize: 11, color: '#10b981', fontFamily: 'var(--mono)',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981',
          animation: 'pulse 2s infinite' }} />
        LIVE
      </div>
    </header>
  );
}
