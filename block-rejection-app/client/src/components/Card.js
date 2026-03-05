import React from 'react';

export default function Card({ children, style = {}, className = '' }) {
  return (
    <div className={className} style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>{icon}</div>
      )}
      <h3 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'var(--blue-4)', fontWeight: 500 }}>
        {children}
      </h3>
    </div>
  );
}
