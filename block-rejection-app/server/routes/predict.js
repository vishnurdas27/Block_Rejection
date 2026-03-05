const express    = require('express');
const axios      = require('axios');
const { body, validationResult } = require('express-validator');
const Prediction = require('../models/Prediction');

const router   = express.Router();
const ML_URL   = process.env.ML_URL || 'http://127.0.0.1:5001';

const numericFields = [
  { name: 'temperature',  min: 1600,  max: 2000 },
  { name: 'density',      min: 3.0,   max: 5.0  },
  { name: 'energy',       min: 0,     max: 5000  },
  { name: 'pouring_time', min: 0,     max: 600   },
  { name: 'flowrate',     min: 0,     max: 100   },
  { name: 'tilt_angle',   min: 0,     max: 90    },
  { name: 'unit_wgt',     min: 0,     max: 2000  },
];
const catFields = ['bin_height','grog_type','quality','module','mould_type','sub_location'];

const validators = [
  ...numericFields.map(f =>
    body(f.name)
      .notEmpty().withMessage(`${f.name} is required`)
      .isFloat({ min: f.min, max: f.max })
      .withMessage(`${f.name} must be between ${f.min} and ${f.max}`)
  ),
  ...catFields.map(f =>
    body(f).notEmpty().withMessage(`${f} is required`).isString()
  ),
];

// POST /api/predict
router.post('/', validators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Call Python ML microservice
    const { data: mlResult } = await axios.post(`${ML_URL}/predict`, req.body, { timeout: 10000 });

    // Persist to MongoDB (non-blocking failure is ok)
    try {
      await Prediction.create({ ...req.body, ...mlResult });
    } catch (_) { /* MongoDB optional */ }

    return res.json(mlResult);
  } catch (err) {
    const msg = err.response?.data?.error || err.message;
    return res.status(500).json({ error: `ML service error: ${msg}` });
  }
});

module.exports = router;
