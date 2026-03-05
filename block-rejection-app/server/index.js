require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const mongoose = require('mongoose');

const predictRouter  = require('./routes/predict');
const historyRouter  = require('./routes/history');
const metaRouter     = require('./routes/meta');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'   // ← add this after you get Vercel URL
  ]
}));
app.use(express.json());
app.use(morgan('dev'));

// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/block_rejection';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => console.warn('⚠️   MongoDB not connected – history disabled\n', err.message));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/predict', predictRouter);
app.use('/api/history', historyRouter);
app.use('/api/meta',    metaRouter);

app.get('/', (_req, res) => res.json({ status: 'Block Rejection API running' }));

app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
