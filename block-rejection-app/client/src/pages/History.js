import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card, { CardTitle } from '../components/Card';

const riskColor = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };

function Badge({ label, color }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11,
      fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}55` }}>
      {label}
    </span>
  );
}

export default function History() {
  const [data,    setData]    = useState({ records: [], total: 0 });
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const load = useCallback(async (p = 1) => {
    setLoading(true); setError('');
    try {
      const { data: d } = await axios.get(`/api/history?page=${p}&limit=15`);
      setData(d); setPage(p);
    } catch {
      setError('Could not load history. MongoDB may not be running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this prediction record?')) return;
    try {
      await axios.delete(`/api/history/${id}`);
      load(page);
    } catch { alert('Delete failed.'); }
  };

  const totalPages = Math.ceil(data.total / 15);

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Prediction History
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
            All past predictions stored in MongoDB · {data.total} total records
          </p>
        </div>
        <button onClick={() => load(page)} style={{
          padding: '10px 18px', borderRadius: 8,
          border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--text-2)', fontSize: 13, cursor: 'pointer',
        }}>↻ Refresh</button>
      </div>

      {error && (
        <div style={{ padding: '14px 18px', borderRadius: 10, marginBottom: 20,
          background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)',
          color: '#f59e0b', fontSize: 13 }}>
          ⚠️  {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-3)' }}>
          <div className="animate-spin" style={{ width: 36, height: 36, borderRadius: '50%',
            border: '3px solid var(--border)', borderTopColor: 'var(--blue-3)', margin: '0 auto 16px' }} />
          Loading records…
        </div>
      ) : data.records.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🕒</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>
            No predictions yet
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
            Make a prediction on the Predict page — it will appear here.
            <br/>(MongoDB must be running for history to save.)
          </div>
        </Card>
      ) : (
        <>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border)' }}>
                    {['Date/Time','Verdict','Risk','Prob%','Grog Type','Bin Height','Temp °C','Density','Module','Model',''].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '1.5px',
                        textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 500,
                        whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((r, i) => (
                    <tr key={r._id} className="animate-fadeIn"
                      style={{ borderBottom: '1px solid var(--border)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)',
                        animationDelay: `${i * 30}ms` }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-3)', whiteSpace: 'nowrap',
                        fontFamily: 'var(--mono)', fontSize: 11 }}>
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge
                          label={r.label}
                          color={r.prediction === 1 ? '#ef4444' : '#10b981'}
                        />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge label={r.risk_level} color={riskColor[r.risk_level]} />
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 12,
                        color: r.probability > 0.6 ? '#ef4444' : r.probability > 0.3 ? '#f59e0b' : '#10b981' }}>
                        {Math.round(r.probability * 100)}%
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>{r.grog_type}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>{r.bin_height}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 12,
                        color: 'var(--text-2)' }}>{r.temperature}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 12,
                        color: 'var(--text-2)' }}>{r.density}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>{r.module}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--blue-4)', fontSize: 11 }}>
                        {r.model_used}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => handleDelete(r._id)} style={{
                          background: 'none', border: 'none', color: 'var(--text-3)',
                          cursor: 'pointer', fontSize: 16, padding: '2px 6px',
                          borderRadius: 4, transition: 'color .2s',
                        }} title="Delete" onMouseEnter={e => e.target.style.color='#ef4444'}
                          onMouseLeave={e => e.target.style.color='var(--text-3)'}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => load(p)} style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: p === page ? 'var(--blue-2)' : 'transparent',
                  color: p === page ? '#fff' : 'var(--text-2)',
                  fontSize: 13, cursor: 'pointer', transition: 'all .2s',
                }}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
