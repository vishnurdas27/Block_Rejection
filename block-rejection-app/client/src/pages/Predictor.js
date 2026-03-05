import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card, { CardTitle } from '../components/Card';
import ResultPanel from '../components/ResultPanel';

// ── field config ──────────────────────────────────────────────────────────────
const NUMERIC_FIELDS = [
  { key: 'temperature',  label: 'Temperature',   unit: '°C',   min: 1600, max: 2000, step: 0.1,
    hint: 'Typical: 1780–1850 °C',  icon: '🌡️' },
  { key: 'density',      label: 'Density',        unit: 'g/cm³', min: 3.0, max: 5.0,  step: 0.01,
    hint: 'Typical: 3.70–3.90',     icon: '⚖️' },
  { key: 'energy',       label: 'Energy',          unit: 'kWh',  min: 0,   max: 5000, step: 1,
    hint: 'Typical: 1200–2200',     icon: '⚡' },
  { key: 'pouring_time', label: 'Pouring Time',    unit: 'sec',  min: 0,   max: 600,  step: 0.1,
    hint: 'Typical: 20–120 sec',    icon: '⏱️' },
  { key: 'flowrate',     label: 'Flow Rate',        unit: 'u/s',  min: 0,   max: 100,  step: 0.01,
    hint: 'Optimal: 4–8 u/s',       icon: '💧' },
  { key: 'tilt_angle',   label: 'Tilt Angle',       unit: '°',    min: 0,   max: 90,   step: 0.01,
    hint: 'Typical: 8–18 °',        icon: '📐' },
  { key: 'unit_wgt',     label: 'Unit Weight',      unit: 'kg',   min: 0,   max: 2000, step: 0.1,
    hint: 'Typical: 50–200 kg',     icon: '🏋️' },
];

const CAT_LABELS = {
  bin_height:   { label: 'Bin Height',    icon: '📦', hint: 'Optimal: 4–6 Feet' },
  grog_type:    { label: 'Grog Type',     icon: '🪨', hint: 'System = highest risk (57%)' },
  quality:      { label: 'Quality Grade', icon: '🏷️', hint: 'Product quality classification' },
  module:       { label: 'Module',        icon: '⚙️', hint: 'Production module identifier' },
  mould_type:   { label: 'Mould Type',    icon: '🔩', hint: 'Type of mould used' },
  sub_location: { label: 'Sub Location',  icon: '📍', hint: 'Plant / furnace location' },
};

// defaults for the form
const DEFAULTS = {
  temperature: 1810, density: 3.8, energy: 1700, pouring_time: 55,
  flowrate: 6.0, tilt_angle: 13, unit_wgt: 133,
  bin_height: '', grog_type: '', quality: '', module: '', mould_type: '', sub_location: '',
};

export default function Predictor() {
  const [meta,    setMeta]    = useState(null);
  const [form,    setForm]    = useState(DEFAULTS);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [apiErr,  setApiErr]  = useState('');

  useEffect(() => {
    axios.get('/api/meta').then(r => {
      setMeta(r.data);
      // set first option as default for selects
      const catDefaults = {};
      Object.entries(r.data.cat_options).forEach(([k, opts]) => {
        catDefaults[k] = opts[0];
      });
      setForm(prev => ({ ...prev, ...catDefaults }));
    }).catch(() => setApiErr('⚠️  Cannot reach backend — make sure the server is running.'));
  }, []);

  const validate = () => {
    const errs = {};
    NUMERIC_FIELDS.forEach(f => {
      const v = parseFloat(form[f.key]);
      if (isNaN(v))                      errs[f.key] = 'Required';
      else if (v < f.min || v > f.max)   errs[f.key] = `Must be ${f.min}–${f.max}`;
    });
    Object.keys(CAT_LABELS).forEach(k => {
      if (!form[k]) errs[k] = 'Please select a value';
    });
    return errs;
  };

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setResult(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setApiErr(''); setResult(null);
    try {
      const payload = { ...form };
      NUMERIC_FIELDS.forEach(f => { payload[f.key] = parseFloat(payload[f.key]); });
      const { data } = await axios.post('/api/predict', payload);
      setResult(data);
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Prediction failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(DEFAULTS);
    setResult(null); setErrors({}); setApiErr('');
    if (meta) {
      const catDefaults = {};
      Object.entries(meta.cat_options).forEach(([k, opts]) => { catDefaults[k] = opts[0]; });
      setForm(prev => ({ ...prev, ...catDefaults }));
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fadeIn">
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
          Block Rejection Predictor
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
          Enter furnace and production parameters to predict whether a glass block will be accepted or rejected.
          Uses <strong style={{ color: 'var(--blue-4)' }}>Gradient Boosting</strong> (best model, ROC-AUC 0.923).
        </p>
      </div>

      {apiErr && (
        <div style={{ padding: '14px 18px', borderRadius: 10, marginBottom: 20,
          background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
          color: '#ef4444', fontSize: 13 }}>
          {apiErr}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT: form ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>

          {/* Furnace Parameters */}
          <Card style={{ marginBottom: 20 }}>
            <CardTitle icon="🌡️">Furnace Process Parameters</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {NUMERIC_FIELDS.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
                    marginBottom: 6, letterSpacing: '.3px' }}>
                    <span>{f.icon}</span>
                    {f.label}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10,
                      color: 'var(--text-3)', fontWeight: 400 }}>({f.unit})</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number" step={f.step} min={f.min} max={f.max}
                      value={form[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      style={errors[f.key] ? { borderColor: '#ef4444' } : {}}
                      placeholder={`e.g. ${DEFAULTS[f.key] ?? f.min}`}
                    />
                    <span style={{ position: 'absolute', right: 12, top: '50%',
                      transform: 'translateY(-50%)', fontSize: 11,
                      color: 'var(--text-3)', pointerEvents: 'none',
                      fontFamily: 'var(--mono)' }}>{f.unit}</span>
                  </div>
                  {errors[f.key]
                    ? <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors[f.key]}</div>
                    : <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{f.hint}</div>
                  }
                </div>
              ))}
            </div>
          </Card>

          {/* Material & Production Parameters */}
          <Card style={{ marginBottom: 20 }}>
            <CardTitle icon="🏭">Material &amp; Production Parameters</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {Object.entries(CAT_LABELS).map(([key, cfg]) => (
                <div key={key}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
                    marginBottom: 6, letterSpacing: '.3px' }}>
                    <span>{cfg.icon}</span>{cfg.label}
                  </label>
                  <select
                    value={form[key]}
                    onChange={e => handleChange(key, e.target.value)}
                    style={errors[key] ? { borderColor: '#ef4444' } : {}}
                  >
                    {!meta && <option>Loading…</option>}
                    {meta?.cat_options[key]?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors[key]
                    ? <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors[key]}</div>
                    : <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{cfg.hint}</div>
                  }
                </div>
              ))}
            </div>
          </Card>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '14px 24px', borderRadius: 10, border: 'none',
              background: loading ? 'var(--border)' : 'linear-gradient(135deg,#1e40af,#2563eb)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(37,99,235,.4)',
              transition: 'all .2s', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
            }}>
              {loading
                ? <><span className="animate-spin" style={{ display:'inline-block',
                    width:18,height:18,border:'3px solid rgba(255,255,255,.3)',
                    borderTopColor:'#fff',borderRadius:'50%'}}/>  Predicting…</>
                : '🔮  Predict Rejection'}
            </button>
            <button type="button" onClick={handleReset} style={{
              padding: '14px 20px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-2)', fontSize: 14, fontWeight: 500,
              transition: 'all .2s',
            }}>
              ↺ Reset
            </button>
          </div>
        </form>

        {/* ── RIGHT: result panel ───────────────────────────────────────────── */}
        <div style={{ position: 'sticky', top: 90 }}>
          {!result && !loading && (
            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔮</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>
                Awaiting Prediction
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
                Fill in all the block parameters on the left and click
                <strong style={{ color: 'var(--blue-4)' }}> Predict Rejection</strong>.
                <br/><br/>
                The model will analyse the 13 features and return an
                accept / reject verdict with probability and risk level.
              </div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '🪨', text: 'grog_type is the #1 risk driver' },
                  { icon: '📦', text: 'Bins under 3 ft → 56% rejection rate' },
                  { icon: '🌡️', text: 'Target temperature: 1800–1820 °C' },
                ].map(t => (
                  <div key={t.text} style={{ fontSize: 12, color: 'var(--text-3)',
                    background: 'var(--bg-input)', borderRadius: 8, padding: '8px 12px',
                    textAlign: 'left', display: 'flex', gap: 8 }}>
                    <span>{t.icon}</span> {t.text}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {loading && (
            <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div className="animate-spin" style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
                border: '4px solid var(--border)', borderTopColor: 'var(--blue-3)',
              }} />
              <div style={{ color: 'var(--text-2)', fontSize: 15, fontWeight: 600 }}>
                Running Gradient Boosting model…
              </div>
              <div style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 8 }}>
                Encoding features → Scaling → Predicting
              </div>
            </Card>
          )}

          {result && <ResultPanel result={result} />}
        </div>
      </div>
    </div>
  );
}
