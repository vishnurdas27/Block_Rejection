import React, { useState } from 'react';
import Navbar    from './components/Navbar';
import Predictor from './pages/Predictor';
import History   from './pages/History';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [page, setPage] = useState('predict');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page={page} setPage={setPage} />
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {page === 'predict'   && <Predictor />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'history'   && <History />}
      </main>
      <footer style={{ textAlign: 'center', padding: '16px', color: 'var(--text-3)', fontSize: 12,
        borderTop: '1px solid var(--border)' }}>
        Saint-Gobain · Block Rejection Prediction System · Gradient Boosting Model (ROC-AUC 0.923)
      </footer>
    </div>
  );
}
