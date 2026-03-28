const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// GET /api/activities — Public
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/activities/:id — Public (for activity detail page)
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Not found.' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/activities — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    console.error('Create activity error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/activities/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) return res.status(404).json({ error: 'Not found.' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/activities/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
