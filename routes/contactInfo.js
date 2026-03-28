const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo');
const auth = require('../middleware/auth');

// GET /api/contact-info — Public
router.get('/', async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = { addrTe: '', addrEn: '', ph: '', em: '', hrTe: '', hrEn: '' };
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/contact-info — Admin only
router.put('/', auth, async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (info) {
      Object.assign(info, req.body);
      await info.save();
    } else {
      info = await ContactInfo.create(req.body);
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
