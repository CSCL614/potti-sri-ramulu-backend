const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// GET /api/members — Admin: all members, Public: only showPublic=Yes & Active
router.get('/', async (req, res) => {
  try {
    const isPublic = req.query.public === 'true';
    let filter = {};
    if (isPublic) {
      filter = { showPublic: 'Yes', status: 'Active' };
    }
    const members = await Member.find(filter).sort({ createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/members — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    console.error('Create member error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/members/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Not found.' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/members/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
