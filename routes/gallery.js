const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const cardId = req.params.id;
    const baseDir = process.env.VERCEL ? path.join('/tmp/uploads/gallery', cardId) : path.join(__dirname, '..', 'uploads', 'gallery', cardId);
    
    try {
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }
    } catch (e) {
      console.log('Error creating specific gallery dir on Vercel Read-Only env', e);
    }
    cb(null, baseDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  }
});

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

// POST /api/gallery/:id/upload — Admin only
router.post('/:id/upload', auth, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const newPhotos = req.files.map(f => `/uploads/gallery/${req.params.id}/${f.filename}`);
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      { $push: { photos: { $each: newPhotos } } },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found.' });
    res.json(item);
  } catch (err) {
    console.error('Gallery upload error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
