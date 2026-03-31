require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB using a global middleware
// This ensures that the DB resolves before processing routes, which fixes the Vercel cold boot and sleep drops.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Failed to establish DB connection in middleware:', err);
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files (index.html, activity.html, assets/, etc.)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/potti', require('./routes/potti'));
app.use('/api/trust-cards', require('./routes/trustCards'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact-info', require('./routes/contactInfo'));
app.use('/api/members', require('./routes/members'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/upload', require('./routes/upload'));

// Dashboard stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Member = require('./models/Member');
    const Contact = require('./models/Contact');
    const TrustCard = require('./models/TrustCard');
    const Activity = require('./models/Activity');
    const GalleryItem = require('./models/GalleryItem');

    const [members, contacts, trustCards, activities, gallery] = await Promise.all([
      Member.countDocuments(),
      Contact.countDocuments(),
      TrustCard.countDocuments(),
      Activity.countDocuments(),
      GalleryItem.countDocuments()
    ]);
    const newMsgs = await Contact.countDocuments({ status: 'New' });

    res.json({ members, contacts, newMsgs, trustCards, activities, gallery });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Fallback: serve index.html for any non-API route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏛️  Potti Sriramulu Trust Server`);
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`📡 API at http://localhost:${PORT}/api\n`);
});

module.exports = app; // For Vercel Serverless
