const express = require('express');
const router = express.Router();
const PottiInfo = require('../models/PottiInfo');
const auth = require('../middleware/auth');

// GET /api/potti — Public
router.get('/', async (req, res) => {
  try {
    let info = await PottiInfo.findOne();
    if (!info) {
      info = { nte: '', nen: '', dates: '', p1te: '', p1en: '', qte: '', qen: '', p2te: '', p2en: '', photo: '', chips: '' };
    }
    res.json(info);
  } catch (err) {
    console.error('Get potti error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/potti — Admin only
router.put('/', auth, async (req, res) => {
  try {
    const data = req.body;
    let info = await PottiInfo.findOne();
    if (info) {
      Object.assign(info, data);
      await info.save();
    } else {
      info = await PottiInfo.create(data);
    }
    res.json(info);
  } catch (err) {
    console.error('Update potti error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
