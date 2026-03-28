const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// GET /api/contacts — Admin only
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/contacts — Public (contact form submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, msg } = req.body;
    if (!name || !email || !msg) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const contact = await Contact.create({
      name, email, phone: phone || '',
      msg, date: new Date().toLocaleString('en-IN'),
      status: 'New'
    });
    res.status(201).json(contact);
  } catch (err) {
    console.error('Submit contact error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/contacts/:id/read — Admin only (mark as read)
router.put('/:id/read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Not found.' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/contacts/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
