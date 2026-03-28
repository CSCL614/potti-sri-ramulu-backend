const express = require('express');
const router = express.Router();
const TrustCard = require('../models/TrustCard');
const auth = require('../middleware/auth');

// GET /api/trust-cards — Public
router.get('/', async (req, res) => {
  try {
    const cards = await TrustCard.find().sort({ createdAt: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/trust-cards — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const card = await TrustCard.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    console.error('Create trust card error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/trust-cards/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const card = await TrustCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ error: 'Not found.' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/trust-cards/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await TrustCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
