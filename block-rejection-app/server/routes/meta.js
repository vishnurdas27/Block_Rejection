const express = require('express');
const axios   = require('axios');
const router  = express.Router();
const ML_URL  = process.env.ML_URL || 'http://127.0.0.1:5001';

// GET /api/meta  — returns model metadata, dropdown options, ranges
router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`${ML_URL}/meta`, { timeout: 5000 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'ML service unavailable' });
  }
});

module.exports = router;
