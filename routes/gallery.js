const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');
const auth = require('../middleware/auth');

// GET /api/gallery — Public
router.get('/', async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/gallery — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Create gallery error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/gallery/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/gallery/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
