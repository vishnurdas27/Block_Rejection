const express    = require('express');
const Prediction = require('../models/Prediction');
const router     = express.Router();

// GET /api/history?limit=20&page=1
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page  = Math.max(parseInt(req.query.page)  || 1,  1);
    const skip  = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Prediction.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Prediction.countDocuments(),
    ]);

    res.json({ records, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history/:id
router.delete('/:id', async (req, res) => {
  try {
    await Prediction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
